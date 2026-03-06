"""LangGraph definition: wires all nodes into the Investment Radar pipeline."""

from typing import Literal
from langgraph.graph import StateGraph, START, END

from state import InvestmentRadarState
import config
from nodes.collector import collector_node
from nodes.extractor import extractor_node
from nodes.sanctions_guard import sanctions_guard_node
from nodes.validator import validator_node
from nodes.matcher import matcher_node
from nodes.researcher import researcher_node
from nodes.brief_writer import brief_writer_node
from nodes.file_output import file_output_node


def output_node(state: InvestmentRadarState) -> dict:
    """Final output node — prints the complete results summary."""
    print("\n" + "=" * 70)
    print("NODE: OUTPUT — Final Results")
    print("=" * 70)

    # Sanctions alerts
    flagged = state.get("flagged_deals", [])
    if flagged:
        print("\n  !! COMPLIANCE ALERTS !!")
        print("  " + "-" * 40)
        for d in flagged:
            print(f"  BLOCKED: {d.acquirer_company} -> {d.target_company}")
            print(f"           Restricted Jurisdiction Nexus. Deal Terminated.")
        print()

    # Ranked deals table
    scored = state.get("scored_deals", [])
    if scored:
        print("\n  RANKED DEALS TABLE")
        print("  " + "-" * 70)
        print(f"  {'#':<3} {'Score':<7} {'Verdict':<10} {'Acquirer':<20} {'Target':<20} {'Value':<12}")
        print("  " + "-" * 70)
        for i, sd in enumerate(scored, 1):
            print(f"  {i:<3} {sd.score:<7.2f} {sd.verdict:<10} {sd.deal.acquirer_company:<20.20} {sd.deal.target_company:<20.20} {sd.deal.deal_value:<12.12}")
        print("  " + "-" * 70)

    # Investment briefs
    briefs = state.get("briefs", [])
    if briefs:
        print(f"\n  INVESTMENT BRIEFS ({len(briefs)})")
        for i, brief in enumerate(briefs, 1):
            sd = brief.scored_deal
            print(f"\n  {'=' * 60}")
            print(f"  BRIEF #{i}: {sd.deal.acquirer_company} -> {sd.deal.target_company}")
            print(f"  Score: {sd.score:.2f} ({sd.verdict}) | Value: {sd.deal.deal_value} | Sector: {sd.deal.sector}")
            print(f"  {'=' * 60}")

            print(f"\n  {brief.disclaimer}\n")

            if brief.deal_overview:
                print(f"  ## Deal Overview")
                for line in brief.deal_overview.split("\n"):
                    print(f"  {line}")
                print()

            if brief.thesis_alignment:
                print(f"  ## Thesis Alignment")
                for line in brief.thesis_alignment.split("\n"):
                    print(f"  {line}")
                print()

            # Print research data if available
            if brief.research:
                r = brief.research
                print(f"  ## Supplementary Research")
                if r.competitors:
                    print(f"  Competitors: {', '.join(r.competitors)}")
                if r.market_size:
                    print(f"  Market Size: {r.market_size}")
                if r.key_customers:
                    print(f"  Key Customers: {', '.join(r.key_customers)}")
                if r.funding_history:
                    print(f"  Funding: {r.funding_history}")
                print()

            if brief.risk_factors:
                print(f"  ## Risk Factors")
                for line in brief.risk_factors.split("\n"):
                    print(f"  {line}")
                print()

            if brief.recommended_action:
                print(f"  ## Recommended Action")
                for line in brief.recommended_action.split("\n"):
                    print(f"  {line}")
                print()
    else:
        print("\n  No investment briefs generated (no deals scored above threshold).")

    # Rejected articles
    rejected = state.get("rejected_articles", [])
    if rejected:
        print(f"\n  REJECTED ({len(rejected)}):")
        for r in rejected:
            print(f"    - {r.title[:60]} [{r.source}]")

    # Errors
    errors = state.get("errors", [])
    if errors:
        print(f"\n  ERRORS ({len(errors)}):")
        for e in errors:
            print(f"    - {e}")

    print("\n" + "=" * 70)
    print("  Pipeline complete.")
    print("=" * 70)

    return {}


def route_by_score(state: InvestmentRadarState) -> Literal["research", "output_only"]:
    """Route deals based on thesis score: high scorers go to researcher, others to output."""
    scored = state.get("scored_deals", [])
    has_high_scoring = any(sd.score >= config.SCORE_THRESHOLD for sd in scored)

    if has_high_scoring:
        return "research"
    return "output_only"


def build_graph() -> StateGraph:
    """Build and compile the Investment Radar LangGraph pipeline."""
    builder = StateGraph(InvestmentRadarState)

    # Add all nodes
    builder.add_node("collector", collector_node)
    builder.add_node("extractor", extractor_node)
    builder.add_node("sanctions_guard", sanctions_guard_node)
    builder.add_node("validator", validator_node)
    builder.add_node("matcher", matcher_node)
    builder.add_node("researcher", researcher_node)
    builder.add_node("brief_writer", brief_writer_node)
    builder.add_node("output", output_node)
    builder.add_node("file_output", file_output_node)

    # Linear pipeline: collect → extract → screen → validate → score
    builder.add_edge(START, "collector")
    builder.add_edge("collector", "extractor")
    builder.add_edge("extractor", "sanctions_guard")
    builder.add_edge("sanctions_guard", "validator")
    builder.add_edge("validator", "matcher")

    # Conditional routing after scoring
    # score ≥ 0.70 → researcher (deep-dive) → brief_writer → output
    # score < 0.70 → output (log only)
    builder.add_conditional_edges(
        "matcher",
        route_by_score,
        {"research": "researcher", "output_only": "output"},
    )
    builder.add_edge("researcher", "brief_writer")
    builder.add_edge("brief_writer", "output")
    builder.add_edge("output", "file_output")
    builder.add_edge("file_output", END)

    return builder.compile()
