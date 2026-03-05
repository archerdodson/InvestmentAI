Analysts at Goldman/JP Morgan spend hours manually scanning for deals, reading articles, pulling data together. The system automates that grunt work.


Iteration 1: Establish basic data ingestion and preprocessing pipeline at a specific time 9am ET and 2pm ET (financial data, news). Develop a simple sentiment analysis model for initial testing.



Field
Detail
Agent
Deal Collector
What it does
Goes to news sites, grabs M&A articles
Goal
System automatically collects M&A deal articles, extracts key fields, and scores them against the firm’s thesis.
Purpose
Automatically goes to news sources and pulls articles about M&A transactions.
How it works
The system connects to sources like TechCrunch, Reuters, Bloomberg, Crunchbase News, and financial news RSS feeds. It searches for keywords like “acquisition,” “merger,” “acquires,” “deal closes,” “takeover.” It pulls every article that mentions an M&A transaction within the specified time window.



Field
Detail
Sample output
The Collector grabs this article: “Alphabet announced on Monday that it has agreed to acquire cybersecurity startup Wiz for $32 billion in cash, marking the largest acquisition in Google’s history. The deal, which is expected to close in 2025, will bolster Google Cloud’s security offerings. Wiz, founded in 2020 in Tel Aviv, generates over $500M in annual recurring revenue and was valued at $12 billion in its last funding round.”
What gets passed forward
The raw article text plus the source URL and date.
What does NOT happen here
No filtering, no scoring, no extraction. The Collector just grabs everything that looks like an M&A article. Junk gets filtered in the next iteration when we add the Validator.


Deal Extractor (Agent - @Archer to decide on the Models and also call out the reason) - reads articles, pulls out structured fields
Field
Detail
Purpose
Reads the raw article from the Collector and pulls out the key M&A fields into a structured format.
Input
Raw article text from the Collector (see above).
What the Extractor does
Reads the paragraph and fills in these fields:
Field
Extracted Value
Acquirer
Alphabet (Google)
Target
Wiz
Deal Value
$32B
Deal Type
Acquisition (cash)
Sector
Cybersecurity
Target Revenue
$500M ARR
Rationale
Bolster Google Cloud’s security offerings
Source
TechCrunch
Date
Article date



Why structured output matters
The next agent (Thesis Matcher) needs clean, consistent fields to score against. It cannot reason over a raw paragraph and reliably compare to thesis criteria. Every deal must have the same fields filled in so the Matcher can process them consistently.

Agent: Thesis Matcher
Purpose: Takes the structured deal from the Extractor and scores it against the firm's investment thesis. <Please refer to the Investment Thesis> Outputs a confidence score (0 to 1) and criteria suggested as per the Investment thesis, and state reasoning for each criterion.
​​Input 1: Structured deal from Extractor (see above)
Input 2: Firm's thesis  "We invest in AI-native companies automating high-volume, regulated financial workflows  compliance, audit, accounting, and payments  where durable competitive advantage comes from workflow depth, regulatory trust, and becoming the system of record, not the underlying model."
What the Matcher does: Evaluates the deal on four criteria.
<<see the criteria>>
Based on the defined criteria- give the confidence score (Example)
Example 1: 
Overall confidence: 0.42 Verdict: Moderate: Action:  Requires further Analysis by the Analyst on the deal.
Now take a different deal that does match. Say the Collector also grabbed this article:
"Visa announced the acquisition of Featurespace, a leading AI-powered fraud and financial crime detection company, for an undisclosed amount. Featurespace's Adaptive Behavioral Analytics technology is used by major banks including HSBC and NatWest to detect fraud and money laundering in real time across billions of transactions."

Extractor output:
Acquirer: Visa Target: Featurespace Deal Value: Undisclosed Deal Type: Acquisition Sector: Financial Crime / Fraud Detection Target Revenue: Not disclosed Rationale: Strengthen Visa's AI-powered fraud and financial crime capabilities Source: Reuters Date: Article date
Matcher scores:
<based on the defined criteria>
Overall confidence: 0.93 Verdict: Strong : advances to brief generation in Iteration 2.
Iteration 1 Summary
What happens: Collector grabs M&A articles automatically. Extractor turns each article into a structured row. Matcher scores each deal against the thesis.
What the analyst gets: A ranked list of M&A deals with confidence scores and reasoning. "Featurespace acquisition scored 0.93, here is why. Wiz acquisition scored 0.42, here is why."
What is still missing: No deduplication (Validator comes in Iteration 2). No research on competitors or market size (Researcher comes in Iteration 3). No written brief (Brief Writer comes in Iteration 2). The analyst sees scores but still has to write their own analysis.
ITERATION 2: AUTO-VALIDATE + BRIEF GENERATION
Goal: System filters out junk and duplicates before extraction, and automatically writes investment briefs for top-scoring deals. Analyst goes from reading a ranked list to reading a finished brief.

What we're adding to the pipeline:
Agent : Deal Validator (sits between Collector and Extractor) Agent : Brief Writer (sits after Thesis Matcher) - @Archer to decide on the Model and the reasoning for selecting
Purpose: Catches junk, duplicates, and unreliable articles before they reach the Extractor. Without this, the Extractor wastes time parsing opinion pieces, rumor articles, or the same deal reported by five different sources.
Input: Raw articles from the Collector.
What it checks:
Check 1  Is this actually about an M&A deal? The Collector grabs anything with keywords like "acquisition" or "merger." But sometimes those words appear in opinion pieces, analyst predictions, or historical references. Example: an article titled "Why Alphabet Should Acquire Stripe" is speculation, not a real deal. The Validator rejects it.
Check 2  Have we already seen this deal? The Collector pulls from four sources. Reuters, TechCrunch, Crunchbase News, and Bloomberg might all cover the Visa-Featurespace deal. The Validator recognizes these are the same deal and keeps only the most detailed article, discards the rest.
Check 3  Is this recent? The Collector might pull an article from six months ago that matches the keywords. The Validator checks the publication date and rejects anything outside the specified time window.
Check 4  Is this source reliable? An article from Reuters or Bloomberg gets passed through. A post from an unverified blog or forum gets flagged or rejected.
Example: The Collector grabs 20 articles in a 3-day window. The Validator processes them:
Article 1: "Visa acquires Featurespace" (Reuters)  Passed. Real deal, reliable source, recent. Article 2: "Visa acquires Featurespace" (TechCrunch)  Rejected. Duplicate of Article 1. 
Article 3: "Visa acquires Featurespace" (Bloomberg)  Rejected. Duplicate of Article 1. 
Article 4: "Alphabet acquires Wiz for $32B" (TechCrunch)  Passed. Real deal, different from Article 1. 
Article 5: "Why Apple should buy Plaid" (Medium blog)  Rejected. Opinion piece, not a real deal. 
Article 6: "Top 10 fintech acquisitions of 2024" (Forbes)  Rejected. Historical, outside time window. 
Article 7: "Stripe reportedly in talks to acquire Bridge" (unnamed source)  Flagged. Rumor, not confirmed.
Result: 20 articles reduced to 8 verified deals. These 8 clean articles get passed to the Extractor.
Output: Clean, verified, deduplicated M&A articles.
Agent : Brief Writer
Purpose: Takes a top-scoring deal from the Thesis Matcher and writes a one-page investment brief that an analyst can read and act on. This is the agent that saves the analyst the most time  instead of writing the brief themselves, they review one that is already drafted.
Input: Structured deal data from Extractor + confidence score and reasoning from Thesis Matcher.
<look at the investment thesis sample>
That is what the analyst reads instead of writing it themselves.
Iteration 2 Summary
What changed from Iteration 1: The Validator now filters junk and duplicates before extraction, so the Extractor only processes real deals. The Brief Writer now turns top-scoring deals into one-page briefs, so the analyst reads finished analysis instead of raw scores.
Full pipeline so far: Collector grabs articles → Validator filters and deduplicates → Extractor structures the data → Matcher scores against thesis → Brief Writer drafts the brief for top matches.
What the analyst gets: Investment briefs for every deal that scores above 0.80. Plus the ranked list of all other deals with scores and reasoning.
What is still missing: The briefs are based only on the original article. No competitive research, no market sizing, no additional news. The Brief Writer works with what it has : the article and the thesis. Richer briefs require the Deal Researcher, which comes in Iteration 3. There is also no orchestration the agents run in sequence but nothing manages errors or retries. The Orchestrator comes in Iteration 3.















ITERATION 3: FULL INTELLIGENCE PLATFORM
Goal: The system researches top deals in depth, spots trends across all deals, and an orchestrator manages the entire pipeline end to end. The analyst gets research-backed briefs and a market trends report - all from one click.
Agent : Deal Researcher (sits between Thesis Matcher and Brief Writer) Agent : Orchestrator (manages the entire flow) Agent : Sector Trend Agent (analyzes all deals for patterns)

Deal Researcher
Purpose: In Iteration 2, the Brief Writer only had the original article to work with. That means the brief had no competitive landscape, no market sizing, no additional news. The Researcher fixes that  it takes the top-scoring deal and goes out to find more information before the brief gets written.

Input: A deal that scored above 0.80 from the Thesis Matcher. For example, the Visa-Featurespace deal (confidence 0.93).
What the Researcher does:
Search 1  Competitors. Who else does what Featurespace does? It finds Darktrace (AI cybersecurity), ComplyAdvantage (AML/fraud), Sardine (fraud prevention), Hawk AI (AML monitoring). Now the Brief Writer can position Featurespace in a competitive landscape.
Search 2  Market size. How big is the AI fraud detection market? It finds industry reports estimating the global fraud detection and prevention market at $45B by 2028, growing at 17% CAGR.
Search 3  Customer traction. Who uses Featurespace beyond what the article mentioned? It finds that Featurespace also serves Worldpay, TSYS, and several mid-tier banks across Europe and Asia. Over 400 financial institutions globally.
Search 4  Recent news. Any other context? It finds that Visa had been a Featurespace customer before the acquisition  they bought a product they already used internally. It also finds that Mastercard acquired a competing fraud detection company six months earlier, signaling an industry trend.
Output: A research package containing competitors, market size, customer traction, and recent context. This gets passed to the Brief Writer, which now produces a much richer brief than in Iteration 2.
Agent : Orchestrator
Purpose: In Iterations 1 and 2, the agents run in a fixed sequence and nothing manages them. What happens if the Collector finds zero articles? What if the Extractor fails on one article but succeeds on others? What if the Researcher's web search returns nothing? The Orchestrator handles all of this.
What it manages:
Job 1  Triggers the pipeline. Analyst clicks "run" and the Orchestrator kicks off the Collector.
Job 2  Passes data between agents. Collector output goes to Validator. Validator output goes to Extractor. And so on. The Orchestrator is the traffic controller.
Job 3  Applies the gate logic. After the Matcher scores each deal, the Orchestrator checks: is the confidence above 0.80? If yes, route to Researcher then Brief Writer. If no, log it and move on.
Job 4  Error handling. If the Extractor fails on one article (bad formatting, paywall, garbled text), the Orchestrator skips that article, logs the error, and continues with the rest. The pipeline does not crash because of one bad input.
Job 5  Parallel routing. The Orchestrator sends top deals to the Researcher and Brief Writer, while simultaneously sending all deals to the Sector Trend Agent. These can run in parallel  the trend report does not depend on the briefs, and the briefs do not depend on the trend report.
Job 6  Packages the final output. Once all agents finish, the Orchestrator assembles the deliverable for the analyst: ranked deal list + investment briefs for top matches + sector trend report. One clean package.

Iteration 3  Full Pipeline
Collector grabs articles → Validator filters and deduplicates → Extractor structures the data → Matcher scores against thesis → Orchestrator routes: top deals go to Researcher then Brief Writer, all deals go to Trend Agent → Orchestrator packages everything → Analyst receives ranked deals + research-backed briefs + trend report.

What changed from Iteration 2:
Briefs are now richer; the Researcher adds competitive landscape, market sizing, and customer traction before the Brief Writer drafts the analysis.
The analyst gets market context  the Trend Agent surfaces patterns across all deals, not just individual matches.
The system is resilient  the Orchestrator catches errors, retries failed steps, and ensures the pipeline runs end to end without manual intervention.

What the analyst gets:
One click produces three deliverables: a ranked deal list with scores and reasoning, research-backed investment briefs for every deal above 0.80, and a sector trend report highlighting emerging M&A patterns.














----------
 

Created Initial architectural patterns (aligning with option 1 and option 3)
(I believe non-llm NLP is largely obsolete with modern llms)
Please give comments or changes - I’m not set on any 

