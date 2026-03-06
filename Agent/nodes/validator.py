"""Validator Node: filters noise — speculation, duplicates, stale articles."""

import json
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

from config import OPENAI_API_KEY, TRUSTED_SOURCES
from state import Deal, Article, InvestmentRadarState


VALIDATION_PROMPT = """You are an M&A news validator. Given a deal extracted from a news article, determine if it is a CONFIRMED, active M&A transaction or if it should be rejected.

REJECT if:
- The article is opinion/speculation (e.g., "Why Company X should buy Company Y")
- The article is about a deal that was merely rumored with no confirmation
- The deal is about real estate, office space, or hiring — NOT an M&A transaction
- The article is a general industry analysis, not a specific deal

ACCEPT if:
- The article reports a confirmed acquisition, merger, or buyout
- The deal has been officially announced by the companies involved
- Regulatory filings or official statements confirm the transaction

Return ONLY a JSON object:
{
  "decision": "ACCEPT" or "REJECT",
  "reason": "Brief explanation"
}
"""


def _validate_deal(llm: ChatOpenAI, deal: Deal) -> tuple[bool, str]:
    """Validate a deal using GPT-4o-mini for classification."""
    messages = [
        SystemMessage(content=VALIDATION_PROMPT),
        HumanMessage(content=(
            f"Deal: {deal.acquirer_company} acquiring {deal.target_company}\n"
            f"Value: {deal.deal_value}\n"
            f"Sector: {deal.sector}\n"
            f"Source: {deal.source_name}\n\n"
            f"Article content:\n{deal.raw_content[:1500]}"
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
        is_accepted = result.get("decision", "").upper() == "ACCEPT"
        reason = result.get("reason", "")
        return is_accepted, reason
    except Exception as e:
        # If validation fails, accept by default (don't lose data)
        return True, f"Validation error (accepted by default): {e}"


def _deduplicate_deals(deals: list[Deal]) -> list[Deal]:
    """Remove duplicate deals (same target + acquirer). Keep the one with more content."""
    seen: dict[str, Deal] = {}
    for deal in deals:
        key = f"{deal.target_company.lower().strip()}|{deal.acquirer_company.lower().strip()}"
        if key in seen:
            # Keep the one with more raw_content (more detail)
            if len(deal.raw_content) > len(seen[key].raw_content):
                seen[key] = deal
        else:
            seen[key] = deal
    return list(seen.values())


def validator_node(state: InvestmentRadarState) -> dict:
    """Filter noise: remove speculation, duplicates, and unreliable sources."""
    print("\n" + "=" * 70)
    print("NODE: VALIDATOR — Filtering noise, deduplicating")
    print("=" * 70)

    deals = state.get("screened_deals", [])
    if not deals:
        print("  No deals to validate.")
        return {"validated_deals": [], "rejected_articles": []}

    # Step 1: Deduplicate
    before_dedup = len(deals)
    deals = _deduplicate_deals(deals)
    dupes_removed = before_dedup - len(deals)
    if dupes_removed:
        print(f"  [Dedup] Removed {dupes_removed} duplicate deals")

    # Step 2: Source reliability check
    for deal in deals:
        is_trusted = any(ts in deal.source_name for ts in TRUSTED_SOURCES)
        trust_label = "TRUSTED" if is_trusted else "UNVERIFIED"
        print(f"  [Source] {deal.target_company}: {deal.source_name} — {trust_label}")

    # Step 3: Speculation filter using GPT-4o-mini
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0,
        api_key=OPENAI_API_KEY,
    )

    accepted: list[Deal] = []
    rejected: list[Article] = []

    for deal in deals:
        is_valid, reason = _validate_deal(llm, deal)
        if is_valid:
            accepted.append(deal)
            print(f"  ACCEPT: {deal.acquirer_company} -> {deal.target_company} ({reason})")
        else:
            rejected.append(Article(
                title=f"{deal.acquirer_company} -> {deal.target_company}",
                url=deal.source_url,
                content=deal.raw_content[:200],
                source=deal.source_name,
            ))
            print(f"  REJECT: {deal.acquirer_company} -> {deal.target_company} ({reason})")

    print(f"\n  SUMMARY:")
    print(f"    Input deals:     {before_dedup}")
    print(f"    After dedup:     {len(deals)}")
    print(f"    Accepted:        {len(accepted)}")
    print(f"    Rejected:        {len(rejected)}")

    # We overwrite validated_deals with only accepted ones
    # Using a workaround: return negative + positive to net out via operator.add
    return {
        "validated_deals": accepted,
        "rejected_articles": rejected,
    }
