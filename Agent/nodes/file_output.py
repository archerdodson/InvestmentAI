"""File Output Node: persists pipeline results to JSON files for UI consumption."""

import json
import os
import re
from datetime import datetime, timezone, timedelta

from state import InvestmentRadarState, ScoredDeal, Brief


# Output directory — writes into the React app's public folder
DATA_DIR = os.path.join(
    os.path.dirname(__file__), "..", "..", "deal-spark-57", "public", "data"
)


def _read_json(filepath: str) -> list:
    """Read existing JSON file or return empty list."""
    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    return []


def _write_json(filepath: str, data: list) -> None:
    """Write data to JSON file with pretty formatting."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False, default=str)


def _validate_date(date_str: str, max_age_days: int = 90) -> str:
    """Return date_str if it's a valid recent date, otherwise return today's date."""
    today = datetime.now(timezone.utc).date()
    try:
        parsed = datetime.strptime(date_str.strip()[:10], "%Y-%m-%d").date()
        # Reject dates more than max_age_days old or in the future
        if parsed > today + timedelta(days=1):
            return today.strftime("%Y-%m-%d")
        if (today - parsed).days > max_age_days:
            return today.strftime("%Y-%m-%d")
        return parsed.strftime("%Y-%m-%d")
    except (ValueError, AttributeError):
        return today.strftime("%Y-%m-%d")


def _deal_type_to_news_type(deal_type: str) -> str:
    """Map agent deal_type to UI NewsItem type."""
    dt = deal_type.lower()
    if any(kw in dt for kw in ("acqui", "merger", "takeover", "buyout")):
        return "ma"
    if any(kw in dt for kw in ("fund", "series", "raise", "round")):
        return "funding"
    if "ipo" in dt:
        return "ipo"
    return "deal"


def _build_summary(deal) -> str:
    """Build a one-line deal summary, avoiding 'Unknown' or empty values."""
    rationale = deal.strategic_rationale or ""
    if rationale and rationale.lower() != "unknown":
        return rationale
    if deal.raw_content and len(deal.raw_content) > 20:
        # Take first sentence or first 200 chars
        first = deal.raw_content.split(". ")[0]
        return (first[:200] + "...") if len(first) > 200 else first + "."
    # Construct from deal fields
    parts = [f"{deal.acquirer_company} acquires {deal.target_company}"]
    if deal.deal_value and deal.deal_value != "Undisclosed":
        parts[0] += f" for {deal.deal_value}"
    if deal.sector:
        parts.append(f"Deal in the {deal.sector} sector.")
    return " ".join(parts)


def _scored_deal_to_news_item(sd: ScoredDeal, run_id: str, index: int) -> dict:
    """Transform a ScoredDeal into a NewsItem-shaped dict for the UI."""
    deal = sd.deal
    deal_id = f"{run_id}-deal-{index}"

    title = f"{deal.acquirer_company} {deal.deal_type or 'Acquires'} {deal.target_company}"
    if deal.deal_value and deal.deal_value != "Undisclosed":
        title += f" in {deal.deal_value} Deal"

    return {
        "id": deal_id,
        "run_id": run_id,
        "title": title,
        "source": deal.source_name or "Unknown",
        "time": _validate_date(deal.published_date) if deal.published_date else datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "type": _deal_type_to_news_type(deal.deal_type),
        "amount": deal.deal_value if deal.deal_value != "Undisclosed" else None,
        "companies": [c for c in [deal.acquirer_company, deal.target_company] if c],
        "summary": _build_summary(deal),
        "sector_id": deal.sector or "",
        "score": sd.score,
        "verdict": sd.verdict,
        "source_url": deal.source_url,
        "has_brief": False,  # updated below if brief exists
        "brief_id": None,
    }


def _brief_to_dict(brief: Brief, run_id: str, index: int, deal_id: str) -> dict:
    """Transform a Brief into a dict for briefs.json."""
    sd = brief.scored_deal
    brief_id = f"{run_id}-brief-{index}"

    research_data = None
    if brief.research:
        research_data = {
            "competitors": brief.research.competitors,
            "market_size": brief.research.market_size,
            "key_customers": brief.research.key_customers,
            "funding_history": brief.research.funding_history,
            "additional_context": brief.research.additional_context,
        }

    return {
        "brief_id": brief_id,
        "run_id": run_id,
        "deal_id": deal_id,
        "target_company": sd.deal.target_company,
        "acquirer_company": sd.deal.acquirer_company,
        "deal_value": sd.deal.deal_value,
        "sector": sd.deal.sector,
        "score": sd.score,
        "verdict": sd.verdict,
        "deal_overview": brief.deal_overview,
        "thesis_alignment": brief.thesis_alignment,
        "risk_factors": brief.risk_factors,
        "recommended_action": brief.recommended_action,
        "research": research_data,
        "disclaimer": brief.disclaimer,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


def _dedup_by_key(existing: list[dict], new_items: list[dict], key: str) -> list[dict]:
    """Append new items, deduplicating by a key field."""
    seen = {item[key] for item in existing}
    for item in new_items:
        if item[key] not in seen:
            existing.append(item)
            seen.add(item[key])
    return existing


def file_output_node(state: InvestmentRadarState) -> dict:
    """Write pipeline results to shared JSON files for UI consumption."""
    print("\n  FILE OUTPUT: Writing results to JSON files...")

    run_id = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H-%M-%S")
    date_start = state.get("run_date_start", "")
    date_end = state.get("run_date_end", "")

    scored_deals = state.get("scored_deals", [])
    briefs = state.get("briefs", [])

    # --- Build deal items ---
    new_deals = []
    for i, sd in enumerate(scored_deals):
        item = _scored_deal_to_news_item(sd, run_id, i)
        new_deals.append(item)

    # --- Build brief items and link to deals ---
    new_briefs = []
    # Map briefs to their deals by matching target+acquirer
    brief_map = {}
    for j, brief in enumerate(briefs):
        sd = brief.scored_deal
        key = f"{sd.deal.acquirer_company}|{sd.deal.target_company}"
        brief_map[key] = j

    for deal_item in new_deals:
        companies = deal_item["companies"]
        if len(companies) >= 2:
            key = f"{companies[0]}|{companies[1]}"
            if key in brief_map:
                brief_idx = brief_map[key]
                brief_dict = _brief_to_dict(
                    briefs[brief_idx], run_id, brief_idx, deal_item["id"]
                )
                new_briefs.append(brief_dict)
                deal_item["has_brief"] = True
                deal_item["brief_id"] = brief_dict["brief_id"]

    # --- Read existing data and append ---
    deals_path = os.path.join(DATA_DIR, "deals.json")
    briefs_path = os.path.join(DATA_DIR, "briefs.json")
    runs_path = os.path.join(DATA_DIR, "runs.json")

    existing_deals = _read_json(deals_path)
    existing_briefs = _read_json(briefs_path)
    existing_runs = _read_json(runs_path)

    updated_deals = _dedup_by_key(existing_deals, new_deals, "source_url")
    updated_briefs = _dedup_by_key(existing_briefs, new_briefs, "brief_id")

    # --- Build run entry ---
    run_entry = {
        "run_id": run_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "date_range_start": date_start,
        "date_range_end": date_end,
        "deals_found": len(new_deals),
        "briefs_generated": len(new_briefs),
        "status": "completed",
    }
    existing_runs.append(run_entry)

    # --- Write files ---
    _write_json(deals_path, updated_deals)
    _write_json(briefs_path, updated_briefs)
    _write_json(runs_path, existing_runs)

    print(f"    Deals written:  {len(new_deals)} new ({len(updated_deals)} total)")
    print(f"    Briefs written: {len(new_briefs)} new ({len(updated_briefs)} total)")
    print(f"    Run logged:     {run_id}")
    print(f"    Output dir:     {DATA_DIR}")

    return {}
