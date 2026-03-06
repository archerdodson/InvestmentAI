"""Configuration: environment variables, constants, and sanctioned entities."""

import os
from dotenv import load_dotenv

load_dotenv()

# ── API Keys ────────────────────────────────────────────────────────────────
OPENAI_API_KEY = os.getenv("OPENAIKEY", "").strip().strip('"')
TAVILY_API_KEY = os.getenv("Tavily", "").strip().strip('"')
TINYFISH_API_KEY = os.getenv("Tinyfish", "").strip().strip('"')

# ── Thresholds ──────────────────────────────────────────────────────────────
SCORE_THRESHOLD = 0.70  # minimum score to trigger researcher + brief writer

# ── Tavily Settings (conservative — max 3 calls) ───────────────────────────
TAVILY_MAX_RESULTS = 5
TAVILY_SEARCH_QUERIES = [
    {
        "query": "mergers acquisitions announced today",
        "topic": "news",
        "time_range": "day",
        "max_results": 5,
    },
    {
        "query": "startup acquisition deal",
        "topic": "news",
        "time_range": "day",
        "include_domains": ["techcrunch.com", "crunchbase.com"],
        "max_results": 5,
    },
    {
        "query": "M&A deal closed",
        "topic": "news",
        "time_range": "day",
        "include_domains": ["reuters.com", "bloomberg.com"],
        "max_results": 5,
    },
]

# ── TinyFish Settings ──────────────────────────────────────────────────────
# TinyFish is used as an article enrichment tool — given an article URL,
# it extracts full structured content (companies, deal values, details).
TINYFISH_API_URL = "https://agent.tinyfish.ai/v1/automation/run-sse"
TINYFISH_ENRICH_GOAL = (
    "Extract the full article text from this page. Return a JSON object with keys: "
    "headline (string), full_text (string - the complete article body), "
    "companies (array of company names mentioned), "
    "deal_value (string - any transaction amounts mentioned, or null), "
    "date (string - publication date if visible). "
    "Return only the JSON, no other text."
)
TINYFISH_MAX_ENRICH = 5  # max articles to enrich per run (to limit API calls)

# ── Sanctioned Jurisdictions (from investmentthesis.md Section 6) ──────────
SANCTIONED_COUNTRIES = {
    "russia", "iran", "north korea", "dprk", "syria", "cuba",
}
ENHANCED_REVIEW_COUNTRIES = {
    "belarus", "myanmar", "venezuela", "sudan", "south sudan",
    "china",  # select sectors only
}
SANCTIONS_KEYWORDS = (
    SANCTIONED_COUNTRIES
    | {"russian", "iranian", "north korean", "syrian", "cuban"}
    | {"moscow", "tehran", "pyongyang", "damascus", "havana"}
)

# ── Trusted Sources ────────────────────────────────────────────────────────
TRUSTED_SOURCES = {
    "reuters.com", "bloomberg.com", "techcrunch.com", "crunchbase.com",
    "ft.com", "wsj.com", "cnbc.com", "pitchbook.com",
}
