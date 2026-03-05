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

# ── TinyFish Settings (1-2 calls max) ──────────────────────────────────────
TINYFISH_API_URL = "https://agent.tinyfish.ai/v1/automation/run-sse"
TINYFISH_TARGETS = [
    {
        "url": "https://www.reuters.com/business/",
        "goal": (
            "Extract all M&A (mergers and acquisitions) news items visible on this page. "
            "For each item extract: headline, date, companies involved, deal value if mentioned, "
            "and a brief summary. Return as a JSON array of objects with keys: "
            "headline, date, companies, deal_value, summary."
        ),
    },
]

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
