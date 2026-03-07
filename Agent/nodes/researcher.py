"""Researcher Node: targeted deep-dive on high-scoring deals."""

import json
from tavily import TavilyClient
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

import config
from config import OPENAI_API_KEY, TAVILY_API_KEY
from state import ScoredDeal, ResearchPackage, InvestmentRadarState


RESEARCH_SYNTHESIS_PROMPT = """You are a research analyst. Given raw search results about a company involved in an M&A deal, synthesize the information into a structured research package.

Extract:
1. COMPETITORS — List the target company's top 3-5 direct competitors in their market segment.
2. MARKET SIZE — What is the total addressable market (TAM) for the target's industry? Include market size estimates and growth rates (CAGR).
3. KEY CUSTOMERS — Who are the target company's notable customers or clients?
4. FUNDING HISTORY — What is the target company's funding history (rounds, amounts, investors)?
5. ADDITIONAL CONTEXT — Any other relevant information (partnerships, regulatory status, technology differentiation).

Return a JSON object:
{
  "competitors": ["Company A", "Company B", "Company C"],
  "market_size": "e.g., $45B by 2028, 17% CAGR",
  "key_customers": ["Customer A", "Customer B"],
  "funding_history": "e.g., Series C, $50M from Insight Partners (2024)",
  "additional_context": "Any other relevant findings"
}

If you cannot find information for a field, use an empty string or empty list.
"""


def _research_deal(tavily_client: TavilyClient, llm: ChatOpenAI, deal: ScoredDeal) -> ResearchPackage:
    """Perform targeted research on a high-scoring deal."""
    target = deal.deal.target_company
    sector = deal.deal.sector

    # Collect raw search results (3-4 targeted queries)
    raw_results: list[str] = []

    search_queries = [
        f"{target} competitors in {sector}",
        f"{target} market size TAM revenue",
        f"{target} customers clients case studies",
    ]

    for query in search_queries:
        print(f"    [Research] Searching: \"{query}\"")
        try:
            response = tavily_client.search(
                query=query,
                max_results=3,
                search_depth="basic",
            )
            for r in response.get("results", []):
                raw_results.append(f"Source: {r.get('url', '')}\n{r.get('content', '')}")
        except Exception as e:
            print(f"      -> Search error: {e}")

    if not raw_results:
        print(f"    -> No research results found for {target}")
        return ResearchPackage()

    # Synthesize with GPT-4o
    print(f"    [Research] Synthesizing {len(raw_results)} search results...")
    combined_results = "\n\n---\n\n".join(raw_results[:10])  # limit context

    messages = [
        SystemMessage(content=RESEARCH_SYNTHESIS_PROMPT),
        HumanMessage(content=(
            f"TARGET COMPANY: {target}\n"
            f"ACQUIRER: {deal.deal.acquirer_company}\n"
            f"SECTOR: {sector}\n"
            f"DEAL VALUE: {deal.deal.deal_value}\n\n"
            f"RAW SEARCH RESULTS:\n{combined_results[:4000]}"
        )),
    ]

    try:
        response = llm.invoke(messages)
        content = response.content.strip()

        # Strip code fences
        if content.startswith("```"):
            content = content.split("\n", 1)[1] if "\n" in content else content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        if content.startswith("json"):
            content = content[4:].strip()

        data = json.loads(content)
        return ResearchPackage(
            competitors=data.get("competitors", []),
            market_size=data.get("market_size", ""),
            key_customers=data.get("key_customers", []),
            funding_history=data.get("funding_history", ""),
            additional_context=data.get("additional_context", ""),
        )
    except Exception as e:
        print(f"    -> Synthesis error: {e}")
        return ResearchPackage()


def researcher_node(state: InvestmentRadarState) -> dict:
    """Perform targeted deep-dive research on high-scoring deals."""
    print("\n" + "=" * 70)
    print("NODE: RESEARCHER — Deep-dive on high-scoring deals")
    print("=" * 70)

    scored_deals = state.get("scored_deals", [])
    high_scoring = [sd for sd in scored_deals if sd.score >= config.SCORE_THRESHOLD]

    if not high_scoring:
        print("  No high-scoring deals to research.")
        return {"research_packages": {}}

    tavily_client = TavilyClient(api_key=TAVILY_API_KEY)
    llm = ChatOpenAI(
        model="gpt-5",
        temperature=0,
        api_key=OPENAI_API_KEY,
    )

    packages: dict[int, ResearchPackage] = {}

    for i, sd in enumerate(high_scoring):
        # Find index in the full scored_deals list
        deal_idx = scored_deals.index(sd)
        print(f"\n  [{i + 1}/{len(high_scoring)}] Researching: {sd.deal.target_company} (score: {sd.score:.2f})")

        package = _research_deal(tavily_client, llm, sd)
        packages[deal_idx] = package

        # Print findings
        print(f"    RESEARCH FINDINGS:")
        if package.competitors:
            print(f"      Competitors: {', '.join(package.competitors)}")
        if package.market_size:
            print(f"      Market Size: {package.market_size}")
        if package.key_customers:
            print(f"      Key Customers: {', '.join(package.key_customers)}")
        if package.funding_history:
            print(f"      Funding: {package.funding_history}")
        if package.additional_context:
            print(f"      Context: {package.additional_context[:100]}")

    print(f"\n  SUMMARY: Researched {len(packages)} deal(s)")

    return {"research_packages": packages}
