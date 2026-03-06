"""Investment Radar — CLI entry point.

Usage:
    python main.py                    # Run full pipeline with live search
    python main.py --threshold 0.70   # Custom score threshold
    python main.py --query "fintech"  # Add custom search terms
"""

import argparse
import os
import sys

import config
from config import OPENAI_API_KEY, TAVILY_API_KEY
from graph import build_graph


def load_thesis() -> str:
    """Load the investment thesis from investmentthesis.md."""
    thesis_path = os.path.join(os.path.dirname(__file__), "investmentthesis.md")
    if os.path.exists(thesis_path):
        with open(thesis_path, "r", encoding="utf-8") as f:
            # Load first 5000 chars to keep context manageable
            content = f.read()[:5000]
        return content
    else:
        print("WARNING: investmentthesis.md not found. Using default thesis.")
        return (
            "The firm focuses on M&A deals involving companies that automate "
            "high-volume, regulated financial workflows in sectors including "
            "fintech, payments, banking technology, insurance technology, "
            "regulatory technology, and adjacent regulated industries."
        )


def print_banner():
    """Print the application banner."""
    print()
    print("=" * 70)
    print("  AI-POWERED INVESTMENT RADAR")
    print("  M&A Deal Scanner | Thesis Matcher | Brief Generator")
    print("=" * 70)
    print()
    print("  Pipeline: Collector -> Extractor -> Sanctions Guard -> Validator")
    print("           -> Matcher -> Researcher -> Brief Writer -> Output")
    print()
    print(f"  Score threshold: {config.SCORE_THRESHOLD}")
    print(f"  LLM: GPT-4o (OpenAI)")
    print(f"  Search: Tavily + TinyFish")
    print()


def validate_keys():
    """Check that required API keys are configured."""
    missing = []
    if not OPENAI_API_KEY:
        missing.append("OPENAIKEY")
    if not TAVILY_API_KEY:
        missing.append("Tavily")

    if missing:
        print(f"ERROR: Missing API keys in .env: {', '.join(missing)}")
        print("Please add them to your .env file and try again.")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="AI-Powered Investment Radar")
    parser.add_argument("--threshold", type=float, default=None,
                        help=f"Score threshold for brief generation (default: {config.SCORE_THRESHOLD})")
    parser.add_argument("--query", type=str, default=None,
                        help="Additional custom search query to include")
    parser.add_argument("--date-start", type=str, default="",
                        help="Search date range start (YYYY-MM-DD)")
    parser.add_argument("--date-end", type=str, default="",
                        help="Search date range end (YYYY-MM-DD)")
    parser.add_argument("--thesis", type=str, default=None,
                        help="Custom thesis text (overrides investmentthesis.md)")
    args = parser.parse_args()

    # Update threshold if provided
    if args.threshold is not None:
        config.SCORE_THRESHOLD = args.threshold

    # Validate
    validate_keys()

    # Print banner
    print_banner()

    # Load thesis — custom text or file
    if args.thesis:
        thesis = args.thesis
        print(f"  Using custom thesis ({len(thesis)} chars)")
    else:
        thesis = load_thesis()
        print(f"  Thesis loaded ({len(thesis)} chars)")

    if args.date_start or args.date_end:
        print(f"  Date range: {args.date_start or 'any'} to {args.date_end or 'any'}")

    # Build graph
    graph = build_graph()

    # Initialize state
    initial_state = {
        "raw_articles": [],
        "extracted_deals": [],
        "screened_deals": [],
        "validated_deals": [],
        "scored_deals": [],
        "briefs": [],
        "flagged_deals": [],
        "rejected_articles": [],
        "research_packages": {},
        "errors": [],
        "investment_thesis": thesis,
        "run_date_start": args.date_start,
        "run_date_end": args.date_end,
    }

    # Add custom query if provided
    if args.query:
        from config import TAVILY_SEARCH_QUERIES
        TAVILY_SEARCH_QUERIES.append({
            "query": args.query,
            "topic": "news",
            "time_range": "day",
            "max_results": 5,
        })
        print(f"  Added custom query: \"{args.query}\"")

    # Adjust search queries for date range
    if args.date_start or args.date_end:
        from config import TAVILY_SEARCH_QUERIES
        date_suffix = ""
        if args.date_start and args.date_end:
            date_suffix = f" {args.date_start} to {args.date_end}"
        elif args.date_start:
            date_suffix = f" after {args.date_start}"
        elif args.date_end:
            date_suffix = f" before {args.date_end}"
        for q in TAVILY_SEARCH_QUERIES:
            q["query"] = q["query"] + date_suffix

    print("\n  Starting pipeline...\n")

    # Run the graph
    try:
        result = graph.invoke(initial_state)
    except KeyboardInterrupt:
        print("\n\n  Pipeline interrupted by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n  PIPELINE ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
