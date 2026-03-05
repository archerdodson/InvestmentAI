"""Collector Node: searches the web for M&A news using Tavily + TinyFish."""

import json
import requests
from tavily import TavilyClient

from config import (
    TAVILY_API_KEY,
    TAVILY_SEARCH_QUERIES,
    TINYFISH_API_KEY,
    TINYFISH_API_URL,
    TINYFISH_TARGETS,
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
                # Extract source domain from URL
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


def _scrape_tinyfish() -> list[Article]:
    """Scrape specific financial news sites using TinyFish (1-2 calls)."""
    if not TINYFISH_API_KEY:
        print("  [TinyFish] Skipped — no API key configured")
        return []

    articles: list[Article] = []

    for target in TINYFISH_TARGETS:
        print(f"  [TinyFish] Scraping: {target['url']}")
        try:
            response = requests.post(
                TINYFISH_API_URL,
                headers={"X-API-Key": TINYFISH_API_KEY},
                json={"url": target["url"], "goal": target["goal"]},
                stream=True,
                timeout=60,
            )
            response.raise_for_status()

            result_data = None
            for line in response.iter_lines():
                if line:
                    decoded = line.decode("utf-8")
                    if decoded.startswith("data: "):
                        try:
                            data = json.loads(decoded[6:])
                            if data.get("type") == "COMPLETE" or data.get("status") == "COMPLETED":
                                result_data = data.get("resultJson") or data.get("result")
                        except json.JSONDecodeError:
                            continue

            if result_data:
                # result_data may be a string or dict/list
                if isinstance(result_data, str):
                    try:
                        result_data = json.loads(result_data)
                    except json.JSONDecodeError:
                        pass

                items = result_data if isinstance(result_data, list) else [result_data]
                print(f"    -> Extracted {len(items)} items")

                from urllib.parse import urlparse
                source = urlparse(target["url"]).netloc.replace("www.", "")

                for item in items:
                    if isinstance(item, dict):
                        headline = item.get("headline", item.get("title", ""))
                        summary = item.get("summary", item.get("content", ""))
                        companies = item.get("companies", "")
                        deal_value = item.get("deal_value", "")
                        date = item.get("date", "")

                        content = f"{headline}. {summary}"
                        if companies:
                            content += f" Companies: {companies}"
                        if deal_value:
                            content += f" Deal value: {deal_value}"

                        articles.append(Article(
                            title=headline,
                            url=target["url"],
                            content=content,
                            source=source,
                            published_date=str(date),
                        ))
            else:
                print("    -> No structured data returned")

        except Exception as e:
            print(f"    -> ERROR: {e}")

    return articles


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
    """Collect M&A news articles from Tavily and TinyFish."""
    print("\n" + "=" * 70)
    print("NODE: COLLECTOR — Searching for M&A news (last 24h)")
    print("=" * 70)

    # Run searches
    tavily_articles = _search_tavily()
    tinyfish_articles = _scrape_tinyfish()

    # Merge and deduplicate
    all_articles = tavily_articles + tinyfish_articles
    unique_articles = _deduplicate(all_articles)

    # Print summary
    print(f"\n  SUMMARY:")
    print(f"    Tavily articles:   {len(tavily_articles)}")
    print(f"    TinyFish articles: {len(tinyfish_articles)}")
    print(f"    After dedup:       {len(unique_articles)}")

    # Source breakdown
    sources: dict[str, int] = {}
    for a in unique_articles:
        sources[a.source] = sources.get(a.source, 0) + 1
    print(f"    Sources: {dict(sources)}")

    # Print titles
    print(f"\n  ARTICLES FOUND:")
    for i, a in enumerate(unique_articles, 1):
        print(f"    {i}. [{a.source}] {a.title[:80]}")

    return {"raw_articles": unique_articles}
