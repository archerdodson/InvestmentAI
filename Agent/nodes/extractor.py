"""Extractor Node: uses GPT-4o to extract structured deal data from articles."""

import json
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

from config import OPENAI_API_KEY
from state import Article, Deal, InvestmentRadarState


EXTRACTION_PROMPT = """You are an M&A deal extraction specialist. Given a news article, extract structured deal information.

RULES:
- Extract ONLY confirmed M&A deals (acquisitions, mergers, buyouts, carve-outs, JVs with control change).
- If no M&A deal is described, return an empty list.
- If multiple deals are mentioned, extract each one separately.
- Normalize deal values to USD. If not in USD, convert approximately.
- If deal value is not mentioned, use "Undisclosed".
- For deal_type, use one of: "Acquisition", "Merger of Equals", "Leveraged Buyout", "Carve-Out / Spin-Off", "Joint Venture", "Other"
- For strategic_rationale, use one of: "Horizontal Integration", "Vertical Integration", "Market Extension", "Product Extension", "Conglomerate Diversification", "Transformative / Platform", "Unknown"
- Be precise. Do not hallucinate information not in the article.

Return a JSON array of deal objects. Each object must have these fields:
{
  "target_company": "string",
  "acquirer_company": "string",
  "deal_value": "string (e.g., '$2.5B' or 'Undisclosed')",
  "sector": "MUST be one of: healthcare, semiconductors, clean-energy, industrials, fintech, consumer, aerospace, cybersecurity, agritech — pick the closest match, never use 'other'",
  "deal_type": "string",
  "strategic_rationale": "string",
  "published_date": "string (YYYY-MM-DD). Use the article's actual publication date. If not clearly stated in the article, use the search_date provided below."
}

If no deals found, return: []
"""


def _extract_deals_from_article(llm: ChatOpenAI, article: Article, search_date: str = "") -> list[Deal]:
    """Use GPT-4o to extract deals from a single article."""
    date_hint = ""
    if search_date:
        date_hint = f"\nSearch Date (use as published_date if no date is visible in the article): {search_date}\n"

    messages = [
        SystemMessage(content=EXTRACTION_PROMPT),
        HumanMessage(content=f"Article Title: {article.title}\nSource: {article.source}\n{date_hint}\nArticle Content:\n{article.content}"),
    ]

    try:
        response = llm.invoke(messages)
        content = response.content.strip()

        # Strip markdown code fences if present
        if content.startswith("```"):
            content = content.split("\n", 1)[1] if "\n" in content else content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        if content.startswith("json"):
            content = content[4:].strip()

        deals_data = json.loads(content)
        if not isinstance(deals_data, list):
            deals_data = [deals_data]

        deals: list[Deal] = []
        for d in deals_data:
            deals.append(Deal(
                target_company=d.get("target_company", "Unknown"),
                acquirer_company=d.get("acquirer_company", "Unknown"),
                deal_value=d.get("deal_value", "Undisclosed"),
                sector=d.get("sector", ""),
                deal_type=d.get("deal_type", ""),
                strategic_rationale=d.get("strategic_rationale", "Unknown"),
                source_url=article.url,
                source_name=article.source,
                published_date=d.get("published_date", article.published_date),
                raw_content=article.content[:2000],  # keep first 2k chars
            ))
        return deals
    except (json.JSONDecodeError, Exception) as e:
        print(f"    -> Extraction failed for '{article.title[:50]}': {e}")
        return []


def extractor_node(state: InvestmentRadarState) -> dict:
    """Extract structured deal data from all collected articles."""
    print("\n" + "=" * 70)
    print("NODE: EXTRACTOR — Extracting structured deal data")
    print("=" * 70)

    articles = state.get("raw_articles", [])
    if not articles:
        print("  No articles to process.")
        return {"extracted_deals": []}

    llm = ChatOpenAI(
        model="gpt-5",
        temperature=0,
        api_key=OPENAI_API_KEY,
    )

    all_deals: list[Deal] = []

    search_date = state.get("run_date_start", "")

    for i, article in enumerate(articles, 1):
        print(f"  [{i}/{len(articles)}] Extracting from: {article.title[:60]}...")
        deals = _extract_deals_from_article(llm, article, search_date)
        if deals:
            for d in deals:
                print(f"    -> DEAL: {d.acquirer_company} acquiring {d.target_company} ({d.deal_value}) [{d.sector}]")
            all_deals.extend(deals)
        else:
            print(f"    -> No M&A deals found in this article")

    print(f"\n  SUMMARY:")
    print(f"    Articles processed: {len(articles)}")
    print(f"    Deals extracted:    {len(all_deals)}")

    if all_deals:
        print(f"\n  EXTRACTED DEALS:")
        for i, d in enumerate(all_deals, 1):
            print(f"    {i}. {d.acquirer_company} -> {d.target_company}")
            print(f"       Value: {d.deal_value} | Sector: {d.sector} | Type: {d.deal_type}")

    return {"extracted_deals": all_deals}
