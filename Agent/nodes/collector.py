"""Collector Node: searches the web for M&A news using Tavily, enriches with TinyFish."""

import json
import requests
from tavily import TavilyClient

from config import (
    TAVILY_API_KEY,
    TAVILY_SEARCH_QUERIES,
    TINYFISH_API_KEY,
    TINYFISH_API_URL,
    TINYFISH_ENRICH_GOAL,
    TINYFISH_MAX_ENRICH,
)
from state import Article, InvestmentRadarState


def _search_tavily() -> list[Article]:
    """Run up to 3 Tavily searches and return articles."""
    client = TavilyClient(api_key=TAVILY_API_KEY)
    articles: list[Article] = []

    for i, search_cfg in enumerate(TAVILY_SEARCH_QUERIES, 1):
        print(f"  [Tavily] Search {i}/{len(TAVILY_SEARCH_QUERIES)}: \"{search_cfg['query']}\"")
        try:
            response = client.search(**search_cfg)
            results = response.get("results", [])
            print(f"    -> Found {len(results)} results")
            for r in results:
                url = r.get("url", "")
                source = ""
                if url:
                    from urllib.parse import urlparse
                    parsed = urlparse(url)
                    source = parsed.netloc.replace("www.", "")

                articles.append(Article(
                    title=r.get("title", ""),
                    url=url,
                    content=r.get("content", ""),
                    source=source,
                    published_date=r.get("published_date", ""),
                ))
        except Exception as e:
            print(f"    -> ERROR: {e}")

    return articles


def _enrich_with_tinyfish(articles: list[Article]) -> list[Article]:
    """Enrich articles by scraping their URLs with TinyFish for full content."""
    if not TINYFISH_API_KEY:
        print("  [TinyFish] Skipped — no API key configured")
        return articles

    # Only enrich articles with short content (Tavily snippets are often truncated)
    candidates = [a for a in articles if len(a.content) < 500]
    to_enrich = candidates[:TINYFISH_MAX_ENRICH]

    if not to_enrich:
        print("  [TinyFish] No articles need enrichment (all have sufficient content)")
        return articles

    print(f"  [TinyFish] Enriching {len(to_enrich)} articles with full content...")

    for article in to_enrich:
        print(f"    -> Enriching: {article.title[:60]}...")
        try:
            enriched = _tinyfish_scrape_url(article.url)
            if enriched:
                # Update article with richer content
                if enriched.get("full_text") and len(enriched["full_text"]) > len(article.content):
                    article.content = enriched["full_text"]
                if enriched.get("headline") and not article.title:
                    article.title = enriched["headline"]
                if enriched.get("date") and not article.published_date:
                    article.published_date = str(enriched["date"])

                # Append company/deal info to content for the extractor
                companies = enriched.get("companies", [])
                deal_value = enriched.get("deal_value")
                if companies:
                    article.content += f"\nCompanies mentioned: {', '.join(companies)}"
                if deal_value:
                    article.content += f"\nDeal value: {deal_value}"

                print(f"       Enriched ({len(article.content)} chars)")
            else:
                print(f"       No data returned")
        except Exception as e:
            print(f"       ERROR: {e}")

    return articles


def _tinyfish_scrape_url(url: str) -> dict | None:
    """Use TinyFish API to scrape a single URL and extract structured content."""
    try:
        response = requests.post(
            TINYFISH_API_URL,
            headers={
                "X-API-Key": TINYFISH_API_KEY,
                "Content-Type": "application/json",
            },
            json={"url": url, "goal": TINYFISH_ENRICH_GOAL},
            stream=True,
            timeout=60,
        )
        response.raise_for_status()

        result_data = None
        for line in response.iter_lines():
            if not line:
                continue
            decoded = line.decode("utf-8")
            if not decoded.startswith("data: "):
                continue
            try:
                data = json.loads(decoded[6:])
                status = (data.get("type", "") or data.get("status", "")).upper()
                if status in ("COMPLETE", "COMPLETED", "RESULT", "DONE"):
                    candidate = (
                        data.get("resultJson")
                        or data.get("result")
                        or data.get("data")
                    )
                    if candidate:
                        result_data = candidate
            except json.JSONDecodeError:
                continue

        if result_data:
            if isinstance(result_data, str):
                try:
                    result_data = json.loads(result_data)
                except json.JSONDecodeError:
                    return None
            if isinstance(result_data, dict):
                return result_data
            if isinstance(result_data, list) and result_data:
                return result_data[0]

    except Exception as e:
        print(f"       TinyFish request error: {e}")

    return None


def _deduplicate(articles: list[Article]) -> list[Article]:
    """Remove duplicate articles by URL."""
    seen_urls: set[str] = set()
    unique: list[Article] = []
    for article in articles:
        if article.url not in seen_urls:
            seen_urls.add(article.url)
            unique.append(article)
    return unique


def collector_node(state: InvestmentRadarState) -> dict:
    """Collect M&A news articles from Tavily, optionally enrich with TinyFish."""
    print("\n" + "=" * 70)
    print("NODE: COLLECTOR — Searching for M&A news (last 24h)")
    print("=" * 70)

    # Run Tavily searches
    tavily_articles = _search_tavily()

    # Deduplicate
    unique_articles = _deduplicate(tavily_articles)

    # Enrich short articles with TinyFish
    enriched_articles = _enrich_with_tinyfish(unique_articles)

    # Print summary
    print(f"\n  SUMMARY:")
    print(f"    Tavily articles:   {len(tavily_articles)}")
    print(f"    After dedup:       {len(unique_articles)}")
    print(f"    After enrichment:  {len(enriched_articles)}")

    # Source breakdown
    sources: dict[str, int] = {}
    for a in enriched_articles:
        sources[a.source] = sources.get(a.source, 0) + 1
    print(f"    Sources: {dict(sources)}")

    # Print titles
    print(f"\n  ARTICLES FOUND:")
    for i, a in enumerate(enriched_articles, 1):
        print(f"    {i}. [{a.source}] {a.title[:80]}")

    return {"raw_articles": enriched_articles}
