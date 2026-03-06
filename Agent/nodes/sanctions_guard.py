"""Sanctions Guard Node: hard-stop check for restricted jurisdictions."""

from config import SANCTIONED_COUNTRIES, ENHANCED_REVIEW_COUNTRIES, SANCTIONS_KEYWORDS
from state import Deal, InvestmentRadarState


def _check_sanctions(deal: Deal) -> tuple[bool, str]:
    """Check if a deal has nexus to a sanctioned jurisdiction.

    Returns (is_flagged, reason).
    """
    # Combine all text fields for keyword search
    text = " ".join([
        deal.target_company,
        deal.acquirer_company,
        deal.sector,
        deal.raw_content,
        deal.strategic_rationale,
    ]).lower()

    # Check for comprehensively sanctioned countries (HARD STOP)
    for keyword in SANCTIONS_KEYWORDS:
        if keyword in text:
            return True, f"HARD STOP: Detected nexus to sanctioned jurisdiction — keyword '{keyword}' found"

    # Check for enhanced review countries (warning, not hard stop)
    for country in ENHANCED_REVIEW_COUNTRIES:
        if country in text:
            return False, f"WARNING: Enhanced review needed — '{country}' reference detected"

    return False, ""


def sanctions_guard_node(state: InvestmentRadarState) -> dict:
    """Screen deals against sanctioned jurisdictions. Flagged deals are removed."""
    print("\n" + "=" * 70)
    print("NODE: SANCTIONS GUARD — Screening for restricted jurisdictions")
    print("=" * 70)

    deals = state.get("extracted_deals", [])
    if not deals:
        print("  No deals to screen.")
        return {"validated_deals": [], "flagged_deals": []}

    clean_deals: list[Deal] = []
    flagged: list[Deal] = []
    warnings: list[tuple[Deal, str]] = []

    for deal in deals:
        is_flagged, reason = _check_sanctions(deal)
        if is_flagged:
            flagged.append(deal)
            print(f"  !! FLAGGED: {deal.target_company}")
            print(f"     Reason: {reason}")
            print(f"     Action: Deal REMOVED from pipeline. Compliance Alert triggered.")
        elif reason:  # enhanced review warning
            clean_deals.append(deal)
            warnings.append((deal, reason))
            print(f"  ** WARNING: {deal.target_company}")
            print(f"     {reason}")
        else:
            clean_deals.append(deal)
            print(f"  OK: {deal.target_company} — no sanctions flags")

    print(f"\n  SUMMARY:")
    print(f"    Deals screened:  {len(deals)}")
    print(f"    Clean:           {len(clean_deals)}")
    print(f"    Flagged (removed): {len(flagged)}")
    print(f"    Warnings:        {len(warnings)}")

    if flagged:
        print(f"\n  !! COMPLIANCE ALERTS:")
        for d in flagged:
            print(f"    - {d.acquirer_company} -> {d.target_company}: Restricted Jurisdiction Nexus detected. Deal Terminated.")

    # Pass clean deals to screened_deals (validator reads from this)
    return {
        "screened_deals": clean_deals,
        "flagged_deals": flagged,
    }
