"""Brief Writer Node: generates investment briefs for high-scoring deals."""

import json
import re
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

import config
from config import OPENAI_API_KEY
from state import ScoredDeal, ResearchPackage, Brief, InvestmentRadarState


BRIEF_PROMPT = """You are a senior investment banking analyst writing an investment brief for the M&A advisory team. Write a professional, concise brief with exactly 4 sections.

RULES:
- Use objective, analytical language. NO marketing hype ("game-changer", "revolutionary", etc.).
- NEVER use phrases like "Strong Buy", "We recommend buying", or "The firm should invest." You are providing analysis, not investment advice.
- Every factual claim must be traceable to the provided article or research data.
- If the EV/EBITDA multiple exceeds 50x, explicitly flag it as requiring manual verification.
- Keep each section to 3-5 sentences maximum.

SECTIONS:
1. DEAL OVERVIEW — What happened? Who acquired whom? Deal value. Date. Key terms.
2. THESIS ALIGNMENT — Why does this deal fit the firm's investment criteria? Reference specific scoring criteria and evidence.
3. RISK FACTORS — What are the key risks? Consider: regulatory/antitrust, integration complexity, market competition, valuation concerns. Base this on available information only.
4. RECOMMENDED ACTION — What should the analyst do next? (e.g., "Initiate full due diligence", "Schedule coverage call with [acquirer]", "Monitor for regulatory filings"). Be specific and actionable.

Format as clean markdown with ## headers for each section.
"""


def _generate_brief(
    llm: ChatOpenAI,
    scored_deal: ScoredDeal,
    research: ResearchPackage | None,
) -> Brief:
    """Generate an investment brief for a single high-scoring deal."""
    # Build research context
    research_text = ""
    if research:
        parts = []
        if research.competitors:
            parts.append(f"Competitors: {', '.join(research.competitors)}")
        if research.market_size:
            parts.append(f"Market Size: {research.market_size}")
        if research.key_customers:
            parts.append(f"Key Customers: {', '.join(research.key_customers)}")
        if research.funding_history:
            parts.append(f"Funding History: {research.funding_history}")
        if research.additional_context:
            parts.append(f"Additional Context: {research.additional_context}")
        research_text = "\n".join(parts)

    # Build scoring context
    scoring_text = f"Overall Score: {scored_deal.score:.2f} ({scored_deal.verdict})\n"
    for criterion, data in scored_deal.criteria_scores.items():
        if isinstance(data, dict):
            scoring_text += f"  {criterion}: {data['score']:.2f} — {data['reasoning']}\n"
    scoring_text += f"Overall Reasoning: {scored_deal.reasoning}"

    messages = [
        SystemMessage(content=BRIEF_PROMPT),
        HumanMessage(content=(
            f"DEAL INFORMATION:\n"
            f"Acquirer: {scored_deal.deal.acquirer_company}\n"
            f"Target: {scored_deal.deal.target_company}\n"
            f"Deal Value: {scored_deal.deal.deal_value}\n"
            f"Sector: {scored_deal.deal.sector}\n"
            f"Deal Type: {scored_deal.deal.deal_type}\n"
            f"Strategic Rationale: {scored_deal.deal.strategic_rationale}\n"
            f"Date: {scored_deal.deal.published_date}\n"
            f"Source: {scored_deal.deal.source_name}\n\n"
            f"THESIS SCORING:\n{scoring_text}\n\n"
            f"RESEARCH DATA:\n{research_text if research_text else 'No supplementary research available.'}\n\n"
            f"ORIGINAL ARTICLE:\n{scored_deal.deal.raw_content[:2000]}"
        )),
    ]

    try:
        response = llm.invoke(messages)
        brief_text = response.content.strip()

        # Parse sections from markdown
        sections = {"deal_overview": "", "thesis_alignment": "", "risk_factors": "", "recommended_action": ""}
        current_section = None

        for line in brief_text.split("\n"):
            lower = line.lower().strip()
            if "deal overview" in lower:
                current_section = "deal_overview"
                continue
            elif "thesis alignment" in lower:
                current_section = "thesis_alignment"
                continue
            elif "risk" in lower and ("factor" in lower or "assessment" in lower):
                current_section = "risk_factors"
                continue
            elif "recommended action" in lower or "next step" in lower:
                current_section = "recommended_action"
                continue

            if current_section:
                sections[current_section] += line + "\n"

        # Apply legal guardrail: check for prohibited language
        full_text = brief_text.lower()
        prohibited = ["strong buy", "we recommend buying", "the firm should invest",
                       "buy rating", "must buy", "immediate purchase"]
        for phrase in prohibited:
            if phrase in full_text:
                brief_text = brief_text.replace(phrase, "[REDACTED — legal guardrail]")

        # Apply financial reality guardrail: flag extreme multiples
        ev_match = re.findall(r'(\d+(?:\.\d+)?)\s*x\s*(?:ev/ebitda|ebitda)', full_text)
        for match in ev_match:
            if float(match) > 50:
                sections["risk_factors"] += f"\n[!] MANUAL VERIFICATION REQUIRED: EV/EBITDA multiple of {match}x exceeds 50x threshold.\n"

        return Brief(
            scored_deal=scored_deal,
            research=research,
            deal_overview=sections["deal_overview"].strip(),
            thesis_alignment=sections["thesis_alignment"].strip(),
            risk_factors=sections["risk_factors"].strip(),
            recommended_action=sections["recommended_action"].strip(),
        )
    except Exception as e:
        print(f"    -> Brief generation failed: {e}")
        return Brief(
            scored_deal=scored_deal,
            research=research,
            deal_overview=f"Error generating brief: {e}",
        )


def brief_writer_node(state: InvestmentRadarState) -> dict:
    """Generate investment briefs for high-scoring deals."""
    print("\n" + "=" * 70)
    print("NODE: BRIEF WRITER — Generating investment briefs")
    print("=" * 70)

    scored_deals = state.get("scored_deals", [])
    research_packages = state.get("research_packages", {})
    high_scoring = [sd for sd in scored_deals if sd.score >= config.SCORE_THRESHOLD]

    if not high_scoring:
        print("  No high-scoring deals to write briefs for.")
        return {"briefs": []}

    llm = ChatOpenAI(
        model="gpt-4o",
        temperature=0.2,  # slight creativity for writing
        api_key=OPENAI_API_KEY,
    )

    briefs: list[Brief] = []

    for i, sd in enumerate(high_scoring):
        deal_idx = scored_deals.index(sd)
        research = research_packages.get(deal_idx)
        print(f"\n  [{i + 1}/{len(high_scoring)}] Writing brief: {sd.deal.target_company} (score: {sd.score:.2f})")

        brief = _generate_brief(llm, sd, research)
        briefs.append(brief)
        print(f"    -> Brief generated ({len(brief.deal_overview) + len(brief.thesis_alignment) + len(brief.risk_factors) + len(brief.recommended_action)} chars)")

    print(f"\n  SUMMARY: Generated {len(briefs)} investment brief(s)")

    return {"briefs": briefs}
