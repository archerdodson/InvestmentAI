"""Matcher Node: scores deals against the firm's investment thesis."""

import json
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

import config
from config import OPENAI_API_KEY
from state import Deal, ScoredDeal, InvestmentRadarState


SCORING_PROMPT = """You are an M&A investment thesis matcher at a large investment bank. Your job is to score how well a deal aligns with the firm's investment thesis.

INVESTMENT THESIS (summary):
The firm focuses on M&A deals involving companies that automate high-volume, regulated financial workflows. Key criteria:
1. SECTOR ALIGNMENT — Target operates in financial services, fintech, payments, banking technology, insurance technology, regulatory technology, or adjacent regulated industries.
2. DEAL TYPE FIT — The deal structure aligns with recognized M&A rationales: Horizontal Integration, Vertical Integration, Market Extension, Product Extension, or Transformative/Platform deals.
3. STRATEGIC RATIONALE STRENGTH — The rationale is clear, specific, and defensible. It creates measurable value (cost synergies, market share, technology acquisition, regulatory capability).
4. FINANCIAL WORKFLOW RELEVANCE — The target company automates, streamlines, or enhances high-volume regulated workflows (payments processing, compliance monitoring, audit automation, fraud detection, KYC/AML, tax filing, loan origination, etc.).

SCORING INSTRUCTIONS:
- Score each criterion from 0.0 to 1.0 (two decimal places).
- Provide a brief reasoning for each score.
- Calculate the overall score as the weighted average:
  - Sector Alignment: 25%
  - Deal Type Fit: 20%
  - Strategic Rationale: 25%
  - Financial Workflow Relevance: 30%

Return a JSON object:
{
  "sector_alignment": {"score": 0.0, "reasoning": "..."},
  "deal_type_fit": {"score": 0.0, "reasoning": "..."},
  "strategic_rationale": {"score": 0.0, "reasoning": "..."},
  "financial_workflow_relevance": {"score": 0.0, "reasoning": "..."},
  "overall_score": 0.0,
  "overall_reasoning": "2-3 sentence summary of why this deal does or does not fit the thesis"
}
"""


def _score_deal(llm: ChatOpenAI, deal: Deal, thesis: str) -> ScoredDeal:
    """Score a single deal against the thesis."""
    messages = [
        SystemMessage(content=SCORING_PROMPT + f"\n\nADDITIONAL THESIS CONTEXT:\n{thesis[:3000]}"),
        HumanMessage(content=(
            f"DEAL TO SCORE:\n"
            f"Acquirer: {deal.acquirer_company}\n"
            f"Target: {deal.target_company}\n"
            f"Deal Value: {deal.deal_value}\n"
            f"Sector: {deal.sector}\n"
            f"Deal Type: {deal.deal_type}\n"
            f"Strategic Rationale: {deal.strategic_rationale}\n\n"
            f"Article Content:\n{deal.raw_content[:2000]}"
        )),
    ]

    try:
        response = llm.invoke(messages)
        content = response.content.strip()

        # Strip code fences
        if content.startswith("```"):
            content = content.split("\n", 1)[1] if "\n" in content else content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        if content.startswith("json"):
            content = content[4:].strip()

        result = json.loads(content)

        overall_score = float(result.get("overall_score", 0.0))
        overall_score = max(0.0, min(1.0, overall_score))

        criteria_scores = {}
        for key in ["sector_alignment", "deal_type_fit", "strategic_rationale", "financial_workflow_relevance"]:
            if key in result and isinstance(result[key], dict):
                criteria_scores[key] = {
                    "score": float(result[key].get("score", 0.0)),
                    "reasoning": result[key].get("reasoning", ""),
                }

        # Determine verdict
        if overall_score >= 0.80:
            verdict = "Strong"
        elif overall_score >= 0.50:
            verdict = "Moderate"
        else:
            verdict = "Weak"

        return ScoredDeal(
            deal=deal,
            score=overall_score,
            reasoning=result.get("overall_reasoning", ""),
            criteria_scores=criteria_scores,
            verdict=verdict,
        )
    except Exception as e:
        print(f"    -> Scoring failed: {e}")
        return ScoredDeal(
            deal=deal,
            score=0.0,
            reasoning=f"Scoring error: {e}",
            criteria_scores={},
            verdict="Error",
        )


def matcher_node(state: InvestmentRadarState) -> dict:
    """Score all validated deals against the investment thesis."""
    print("\n" + "=" * 70)
    print("NODE: MATCHER — Scoring deals against investment thesis")
    print("=" * 70)

    deals = state.get("validated_deals", [])
    thesis = state.get("investment_thesis", "")

    if not deals:
        print("  No deals to score.")
        return {"scored_deals": []}

    llm = ChatOpenAI(
        model="gpt-4o",
        temperature=0,
        api_key=OPENAI_API_KEY,
    )

    scored: list[ScoredDeal] = []

    for i, deal in enumerate(deals, 1):
        print(f"\n  [{i}/{len(deals)}] Scoring: {deal.acquirer_company} -> {deal.target_company}")
        sd = _score_deal(llm, deal, thesis)
        scored.append(sd)

        # Print score breakdown
        print(f"    OVERALL SCORE: {sd.score:.2f} [{sd.verdict}]")
        for criterion, data in sd.criteria_scores.items():
            if isinstance(data, dict):
                print(f"      {criterion}: {data['score']:.2f} — {data['reasoning'][:60]}")
        print(f"    Reasoning: {sd.reasoning[:100]}")

    # Sort by score descending
    scored.sort(key=lambda s: s.score, reverse=True)

    # Print ranked summary
    high_scoring = [s for s in scored if s.score >= config.SCORE_THRESHOLD]
    print(f"\n  SUMMARY:")
    print(f"    Deals scored:      {len(scored)}")
    print(f"    Strong (>={config.SCORE_THRESHOLD}):  {len(high_scoring)}")
    print(f"    Moderate:          {len([s for s in scored if 0.50 <= s.score < config.SCORE_THRESHOLD])}")
    print(f"    Weak (<0.50):      {len([s for s in scored if s.score < 0.50])}")

    print(f"\n  RANKED DEALS:")
    for i, sd in enumerate(scored, 1):
        marker = " **" if sd.score >= config.SCORE_THRESHOLD else ""
        print(f"    {i}. [{sd.score:.2f}] {sd.verdict:8s} | {sd.deal.acquirer_company} -> {sd.deal.target_company}{marker}")

    if high_scoring:
        print(f"\n  -> {len(high_scoring)} deal(s) qualify for deep-dive research + brief generation")
    else:
        print(f"\n  -> No deals scored above {config.SCORE_THRESHOLD}. Skipping researcher + brief writer.")

    return {"scored_deals": scored}
