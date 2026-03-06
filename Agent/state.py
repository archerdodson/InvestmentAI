"""State schema and data models for the Investment Radar pipeline."""

from __future__ import annotations

import operator
from typing import Annotated, Optional
from typing_extensions import TypedDict
from pydantic import BaseModel, Field


# ── Pydantic Data Models ───────────────────────────────────────────────────

class Article(BaseModel):
    """A raw news article collected from web search."""
    title: str
    url: str
    content: str
    source: str = ""           # e.g. "reuters.com"
    published_date: str = ""   # ISO or free-text date


class Deal(BaseModel):
    """Structured deal data extracted from an article."""
    target_company: str
    acquirer_company: str
    deal_value: str = "Undisclosed"        # normalized to USD or "Undisclosed"
    sector: str = ""
    deal_type: str = ""                     # e.g. "Acquisition", "Merger of Equals"
    strategic_rationale: str = ""
    source_url: str = ""
    source_name: str = ""
    published_date: str = ""
    raw_content: str = ""                   # original article text


class ScoredDeal(BaseModel):
    """A deal scored against the firm's investment thesis."""
    deal: Deal
    score: float = Field(ge=0.0, le=1.0)
    reasoning: str = ""
    criteria_scores: dict = Field(default_factory=dict)
    # e.g. {"sector_alignment": 0.9, "deal_type_fit": 0.7, ...}
    verdict: str = ""  # "Strong" | "Moderate" | "Weak"


class ResearchPackage(BaseModel):
    """Supplementary research gathered for a high-scoring deal."""
    competitors: list[str] = Field(default_factory=list)
    market_size: str = ""
    key_customers: list[str] = Field(default_factory=list)
    funding_history: str = ""
    additional_context: str = ""


class Brief(BaseModel):
    """An investment brief generated for a high-scoring deal."""
    scored_deal: ScoredDeal
    research: Optional[ResearchPackage] = None
    deal_overview: str = ""
    thesis_alignment: str = ""
    risk_factors: str = ""
    recommended_action: str = ""
    disclaimer: str = (
        "DISCLAIMER: This is AI-generated analysis for informational purposes only. "
        "It does not constitute investment advice, a recommendation, or an offer to buy "
        "or sell any securities. All information should be independently verified by a "
        "qualified analyst before any investment decision is made."
    )


# ── LangGraph State ────────────────────────────────────────────────────────

class InvestmentRadarState(TypedDict):
    """The shared state flowing through the LangGraph pipeline."""
    raw_articles: Annotated[list[Article], operator.add]
    extracted_deals: Annotated[list[Deal], operator.add]
    screened_deals: Annotated[list[Deal], operator.add]   # after sanctions check
    validated_deals: Annotated[list[Deal], operator.add]   # after validator
    scored_deals: Annotated[list[ScoredDeal], operator.add]
    briefs: Annotated[list[Brief], operator.add]
    flagged_deals: Annotated[list[Deal], operator.add]
    rejected_articles: Annotated[list[Article], operator.add]
    research_packages: dict  # {index: ResearchPackage} — not appended, overwritten
    errors: Annotated[list[str], operator.add]
    investment_thesis: str
    # Run metadata for file output
    run_date_start: str
    run_date_end: str
