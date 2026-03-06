Hey, let me run through each of these.

1. Is the brief just a summary or does it include a recommendation?

The output evolves across iterations.

In Iteration 1, there's no brief. The Matcher gives a confidence score (0 to 1), reasoning for each of the 4 thesis criteria, and a verdict (Strong / Moderate / Weak). The analyst's thesis is already an input here. The analyst gets: "Featurespace scored 0.93, here's why. Wiz scored 0.42, here's why." A ranked list with scores and reasoning. The analyst still writes their own analysis from there.

In Iteration 2, the Brief Writer adds a written brief on top of that score. It covers: Deal Overview, Thesis Alignment, basic Risk Factors (only what's inferrable from the article), and a Recommended Action. Four sections. Based only on the original article. Thinner, but saves the analyst from writing it themselves.

In Iteration 3, the Researcher goes out first and finds supplementary data that wasn't in the original article: competitors, market size, and customer traction. That research package gets passed to the Brief Writer before it writes. Now the same Brief Writer produces the full brief.

Same Brief Writer agent in Iterations 2 and 3. The Researcher upgrades the input, which upgrades the output. Starting from Iteration 2, the brief always ends with an explicit Recommended Action the analyst can agree with, push back on, or modify.

One thing to note: research does not change the confidence score. The score measures thesis fit Finding out it has 5 competitors or that the market is $45B doesn't change.

2. Does the Collector narrow based on our investment thesis? And when does news get pulled?

The Collector already runs in Iteration 1. It pulls M&A news articles from financial sources (Reuters, Bloomberg, TechCrunch, Crunchbase) on a daily schedule. There's an implicit financial services / tech filter baked into the source selection. The thesis-specific narrowing happens later at the Matcher, when the analyst submits their parameters. The analyst's thesis drives the scoring from Iteration 1 onwards.

Important distinction: there are two different agents that go out and find information, and they do different jobs at different points in the pipeline.

The Collector (Iteration 1) finds M&A news articles. "Visa acquired Featurespace." That's the deal announcement. It runs automatically on schedule. It asks "what deals happened?"

The Researcher (Iteration 3) is a separate agent that only kicks in after a deal scores above 0.80. It finds supplementary data that wasn't in the original article: who are Featurespace's competitors (Darktrace, ComplyAdvantage, Sardine, Hawk AI), how big is the fraud detection market ($45B by 2028), who else uses their product (400+ financial institutions including Worldpay, TSYS). This automates the 30 minutes an analyst would otherwise spend looking this up themselves.

Collector = deal news. Researcher = deal research. Different agents, different jobs, different points in the pipeline.

3. Is 20 articles enough for sector analysis? Do we need memory?

You're right to flag this. 20 articles in a single batch is thin for real sector trend analysis. The idea is that the system collects daily (9am + 2pm ET) and stores everything in a persistent deal database over time. Day 1 you have 20 deals. Day 30 you have 600. Day 90 you have 1,800. The Trend Agent queries the rolling history, not just today's batch. The database is the memory layer that accumulates and gets richer over time.

4. Iteration 3 routing: can we make the connections clearer?

Agreed, we're updating the diagram. The short version:

Orchestrator splits into two parallel paths after the Matcher scores deals. Path A: deals above 0.80 go to Researcher then Brief Writer, producing individual investment briefs. Path B: ALL deals go to Trend Agent, producing a sector-wide pattern report. Both run simultaneously. Orchestrator packages everything at the end into three deliverables: ranked list + briefs + trend report.

The Researcher handles its own data cleanup. It searches, evaluates source quality, resolves conflicting numbers, and returns a clean structured research package to the Brief Writer. No separate validation step needed.

For our 4-day timeline, I'd suggest we build Iterations 1 and 2 as the working demo and present Iteration 3 as the roadmap. We already have all the documentation, agent tables, and diagrams for Iteration 3. The demo shows a complete pipeline: raw article goes in, scored investment brief with a Recommended Action comes out. Iteration 3 adds depth (research, trends, orchestration) but the core product works at Iteration 2.