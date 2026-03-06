

## "Present to My Director" Tab

A new 4th tab in the sector detail page that synthesizes all sector data into a director-ready briefing. The key constraint: **no buy/sell language** -- instead use neutral terms like "Worth Exploring", "Monitor Closely", or "On Our Radar".

### What gets built

**1. New data in `src/data/sectors.ts`**
- Add a `DirectorBriefing` interface and `healthcareDirectorBriefing` mock data containing:
  - **Sector Thesis**: 2-3 sentence macro narrative (why this sector matters now)
  - **Key Metrics Summary**: sector-level stats (total M&A volume, avg growth, top performer, sector P/E range)
  - **Spotlight Companies** (3-4 picks): each with a `signal` rating ("Worth Exploring" | "Monitor Closely" | "On Our Radar"), a rationale paragraph covering catalysts/momentum/valuation context, recent deal activity, and risk factors
  - **Sector Tailwinds & Headwinds**: bullet-point lists of macro factors

**2. New component `src/components/DirectorBriefing.tsx`**
- Clean, presentation-grade layout designed to feel like a polished pitch memo:
  - **Sector Thesis** card at top with the macro narrative
  - **At a Glance** row of 4-5 metric cards (total deal volume, avg revenue growth, P/E range, top mover this week, number of active deals)
  - **Spotlight Companies** section: card per company showing signal badge (color-coded -- amber for "Worth Exploring", blue for "Monitor Closely", gray for "On Our Radar"), the rationale text, key financials (market cap, growth, P/E), and recent deal if any
  - **Tailwinds & Headwinds** two-column layout with green/red accent indicators
  - A subtle disclaimer footer: *"This briefing is for informational purposes only and does not constitute investment advice."*

**3. Wire into `SectorDetail.tsx`**
- Add 4th tab: `{ id: "director", label: "Present to Director", icon: Presentation }` (using `lucide-react` Presentation icon)
- Render `<DirectorBriefing>` when active
- Update the `TabId` type accordingly

### Tone & language principles
- Signals are framed as attention levels, not actions: "Worth Exploring", "Monitor Closely", "On Our Radar"
- Rationale explains the *why* (catalysts, positioning, deal activity) and *what* (what makes this interesting) without telling the director *what to do*
- Risk factors included for balance

