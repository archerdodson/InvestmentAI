Capstone Scratchpad: AI-Powered Investment Radar
Team Name: AI- Powered Investment Radar

Members: Hima Thaker, Archer Dodson, Ayush Kumar, Gladson baby, Jasmeet Samra, Siddarth siddarth, Vivek Sinha
Decision Tracker:
We will only be developing a skeletal solution.
The user is an analyst/researcher at a bank or any firm.
Sources of Data? 
ICP
Large investment firms like Tiger Global, SoftBank Vision Fund (Why? why not smaller ones?)
Customer Journey
Collecting information (structured, unstructured) (example, techcrunch, news articles....)
Input: User inputs company name/sources
Output: -- Potentially skips step
Input: User does not have sources - asks to find information on sector A + Investment firm’s website + thesis
Output: LLM performs query (example Tavily Search): Returns links of documents + content
Synthesising information (removing duplicates, removing junk info, unstructured → structured, trust on the source?)
Company name
Deal size
….
Scoring deals
SWOT analysis 
			B&C Input: Gathered list of documents
 B&C Output: (AI reads documents) Performs analysis of information, returns thoughts - backed with evidence from documents (relatively unstructured)
Summarization & Recommendation (should have guardrails)
Likelihood / probability of buy / sell
			D Input: Unstructured set of “refined” thoughts
			D Output: Enforced brief template or other structures with defined sections

What are the 3 iterations of your system? Start by outlining them.
Iteration 1 (1-2 lines):
Iteration 2 (1-2 lines):
Iteration 3 (1-2 lines):










The solutions, how would it look like: https://deal-spark-57.lovable.app
A sector maybe Healthcare, Chips, features internal to that tab:
Inside Healthcare three tabs  (Movers, News ->Fresh Deals + M&A, Top 20 companies)
Movers -> Set of companies and their data with graphs
News about fresh deals + M&A
Top 20 companies with new deals




1. Collaboration & Roles
Your final deliverable is a presentation showcasing your design, iterations, and (optionally) your build. Collaboration is key. Use this shared scratchpad as your workspace.
During the first 5 minutes of brainstorming, decide who takes on which rolesthough you're free to contribute across areas as needed:
Role
Desc
Team member name(s)
Writer/Designer
Documents ideas and designs the solution.
Jasmeet, Siddarth, Vivek, Hima
Brainstormers/Strategy Heads
Shape the approach and plan iterations.
Gladson, Hima
Researcher: 
Gather best practices and optimization strategies + Evals + Guardrails
Siddarth (everyone support)
Builder/Engineers (Optional):
Implements and tests the system + Evals
Archer, Hima, Siddarth
Presenters
Deliver the final demo.
Hima, One of the builders

2. Scoping Your Project
One team member can jot down 1-2 lines summarizing the team's decisions for each question below. Aim to complete this in 10-15 minutes.
What real-world problem does your AI system aim to solve?
Analysts and associates at investment firms spend hours every day scanning market news and startup databases to find relevant deal activity. The sources are fragmented, the volume keeps growing, and important signals get buried. An AI-powered investment radar could aggregate deal activity across sources, identify emerging sectors aligned with a firm's investment thesis, and auto-generate investment briefs highlighting potential opportunities.


Why is this problem important and relevant today?


In 2025, there were over 50,000 M&A transactions globally (PitchBook), and VC deal activity added another 35,000+ deals in 2024 alone (KPMG). Analysts and associates are expected to track this deal flow across market news and startup databases like Crunchbase and PitchBook. The volume is too high to scan manually, and filtering it against a firm's specific investment thesis still requires human judgment and time. According to IDC, data analysts spend over 80% of their time searching for, preparing, and gathering data rather than analyzing it. This matters because deal sourcing is time-sensitive. A delayed read on an emerging sector means competing against firms that got there first. Recent advances in generative AI now make it feasible to automate the scanning and synthesis of unstructured content like deal announcements, market news, and startup profiles.

Why is generative AI a good fit for this problem?

Aggregating deal activity requires extracting structured information (company name, deal size, investors, sector, stage) from unstructured sources with no consistent format. A Series B announcement in a TechCrunch article looks nothing like the same deal on Crunchbase. LLMs can parse varied formats and extract consistent structured fields without per-source engineering.
Identifying emerging sectors aligned with a firm's thesis is a reasoning task, meaning it requires interpreting information, making inferences, and connecting dots across multiple pieces of evidence to reach a conclusion. A firm's thesis is typically described in natural language, and the data it needs to be matched against (startup profiles, deal announcements, news articles) is also unstructured. Matching the two requires interpreting language, inferring context, and chaining multiple judgments together. A keyword filter cannot do that. LLMs can.
Auto-generating investment briefs is a synthesis task, meaning it requires combining information from multiple separate sources into a single coherent output. The brief needs to pull from deal announcements, startup profiles, and market news into a structured, professional format ready for a partner or investment committee. This is the core strength of generative models: producing coherent written output from disparate inputs.
Generative AI handles all three in one pipeline: reading unstructured inputs, reasoning over them against defined criteria, and producing a written output.

Which models are you considering, and why? (Consider cost, latency, performance)
Do you have any other business constraints (cost, compute, security, etc.)?





Model Selection Pillars:
Primary Pillars: Cost (input/output token pricing), Latency (output speed), Performance (benchmark scores). Cost and performance are typically proportional. Use latency as a tie-breaker for real-time use cases.
Secondary Pillars: Security and guardrails, long context support, integration overhead, customization capabilities, global language support.
Notes:
Is Tinyfish integration for navigating websites useful?
Stocks vs VC investments
We need to choose scale/purpose as that determines the relevant/available input sources
Large-scale investment firms targeting mergers and acquisitions

Potential data input sources: 
General News (Infer financial position)
Financial News (Directly aggregate) 
Purpose:
	Solve problems for an analyst at a large-scale investment firm
Lots of noisy data needs to be found/distilled into useful insight
Gathering is 80% vs analyzing


Capabilities:
Filtering sources into reliable/useful ones
C

3. Iterative Solution Design
Build your system in stages, starting simple and adding features and complexity with each iteration. In production, this maps to the CC/CD (Continuous Calibration / Continuous Development) principle: start with high control and low agency, and increase agency slowly.
3.0 Iterations Overview
What are the 3 iterations of your system? Start by outlining them.
Iteration 1 (1-2 lines):
Iteration 2 (1-2 lines):
Iteration 3 (1-2 lines):
Guidance: Start with a simple workflow agent and improve iteratively. The three main paradigms: Workflow Agents (with retrieval or tools) → Autonomous Agents → Multi-Agent Systems. If your first iteration is an autonomous agent, go back and make it a simpler workflow first.
-Copy the structure below for each iteration.-----

3.1 Architecture & Design
New features: What new features or capabilities are you adding in this iteration?
Usage paradigm: Workflow Agent / Autonomous Agent / Multi-Agent System?
Architecture diagram: Sketch a rough block diagram to visualize your design flow.
Context engineering: Think about what your model needs to do its job:
What instructions does it need? (system prompts, behavioral guidelines, formatting rules)
What external knowledge does it need? (documents, databases, APIs)
What tools does it need access to? (search, code execution, external APIs)
Sample inputs: What inputs will your system take? 
Expected outputs: What should the outputs look like?
Intermediate steps: Any intermediate logic or decisions (classification gates, routing)?
Additional components: For retrieval, consider vector database, chunking strategy, and embedding model. See the RAG Design and Optimization reference for options and tradeoffs.
Tool usage: If your system needs external tools or APIs, list them. Consider MCP as the integration layer. See the Autonomous Agents and Tools reference for tool patterns.
3.2 Autonomous Agents (if applicable)
Skip this section if your iteration uses workflow agents only.
Why autonomous over workflow? What can't the workflow handle?
Memory needs: Working memory (current conversation), Episodic (past sessions), Semantic (user facts), Procedural (preferences)?
Multi-agent coordination: Can a single agent handle this first? If multiple agents needed, what's the coordination pattern?
Context per agent: Not all agents need access to all information. What does each agent need to see?
See the  Autonomous Agents and Tools reference  for more detail.
3.3 Evaluation & Optimization
Evaluation metrics: For each major component, think about how you'd evaluate it:
Code-based evals for objective metrics (exact match, regex, fuzzy match)
LLM judge evals for subjective metrics (tone, completeness, helpfulness)
Retrieval evals (if using RAG): Are you retrieving the right chunks?
Tool calling evals (if using tools): Is the agent calling the right tool with the right arguments?
See the Evaluation Metrics reference for examples across different application types.
Eval rubrics: What does "good," "partial," and "bad" mean for your key metrics?
Intermediate metrics: Any metrics to track progress within the pipeline?
Optimization proposals: If you can anticipate issues, what would you try?
3.4 Cost, Latency & Effort
Cost and latency drivers: Number of LLM calls, token usage, retrieval overhead, tool calls, agent reasoning loops.
Optimization cost hierarchy (cheapest to most expensive): Adding tokens → Adding LLM calls → Adding retrieval → Autonomous loops → Changing the model.
3.5 Business & Compliance
Compliance requirements specific to your use case or industry?
Input guardrails and output guardrails needed?

4. Poster Design
Your final deliverable is a poster that summarizes your design. Use your scratchpad notes to fill in each section. The poster should tell a clear story: what problem you're solving, how your system evolves across iterations, and what tradeoffs you made along the way.
Poster Structure
1. Use Case Summary: 2-3 sentences on the problem, who experiences it, why Gen AI fits.
2. Architecture Diagrams: For each iteration, a block diagram showing inputs → processing → outputs.
3. System Design Text: For each iteration, 3-5 bullets on paradigm, context engineering, what's new.
4. Summary Table: One row per iteration with Cost/Latency Drivers, Optimizations, Guardrails, Key Eval Metrics.
Summary Table Template
Iteration
Cost/Latency Drivers
Optimizations
Guardrails
Key Eval Metrics
1
e.g., 2 LLM calls per query
e.g., prompt caching
e.g., PII detection
e.g., classification accuracy
2
e.g., + retrieval overhead
e.g., hybrid search
e.g., + output safety
e.g., + retrieval precision
3
e.g., + agent loops
e.g., stateless subagents
e.g., + rate limiting
e.g., + task completion





