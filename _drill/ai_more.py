"""Tuesday series: AI delivery (replaces SQL from Dec 2026). Correct option is written FIRST; build_all shuffles positions deterministically.
Original questions. Facts on AI-Native SAFe from framework.scaledagile.com (PI Outcome Planning, ART Sense and Respond, released Jun 2026)."""
AI_DELIVERY = [
("RAG basics", [
 ("What does retrieval-augmented generation (RAG) add to a language model?", ["Relevant documents at answer time","More training data","A bigger model","Faster GPUs"], "RAG looks up your own documents for each question and gives them to the model, so answers rest on current, real sources."),
 ("A RAG assistant confidently cites a policy that doesn't exist. What is this called?", ["Hallucination","Overfitting","Data drift","Latency"], "The model produced something plausible but false. Grounding checks and citations are how you catch it."),
 ("Users say the assistant's answers are out of date. What do you check first?", ["Whether the document index is fresh","Retrain the model","Switch AI vendors","Add longer prompts"], "In RAG, stale answers usually mean stale documents. Re-indexing is cheap; retraining is not."),
 ("In RAG, 'chunking' means:", ["Splitting documents into passages","Compressing the model","Batching user requests","Encrypting the data"], "Documents are cut into small passages so the right piece can be found and passed to the model."),
 ("Which measure best shows that RAG answers are grounded?", ["Share of claims backed by sources","Average response time","Tokens per answer","Number of users"], "Grounding is about whether each claim traces to a retrieved source, not speed or volume."),
]),
("Testing AI before go-live", [
 ("Before go-live, the best evidence that an AI feature works is:", ["Results on a labelled test set","A convincing demo","The vendor's brochure","The team's confidence"], "Agree a test set that looks like real cases and measure against it. Demos show the happy path."),
 ("A model flags 100 cases and 60 turn out to be real. What is its precision?", ["60%","40%","100%","160%"], "Precision = true positives ÷ all flagged = 60 ÷ 100."),
 ("Cutting false positives hard usually risks:", ["Missing more real cases","Higher cloud cost only","Slower releases","Nothing at all"], "Precision and recall trade off. Tune the threshold with the business, not alone."),
 ("Offline accuracy is 92%, but users complain. What do you check first?", ["Does test data match real use?","Retrain right away","Add more GPUs","Ignore early feedback"], "A test set that doesn't look like production gives a number nobody should trust."),
 ("Who should sign off the acceptable error rate for an AI feature?", ["Business owner with risk and compliance","Data scientists alone","The RTE","The vendor"], "Error rates are a business and risk decision. The delivery team makes the trade-off visible."),
]),
("Human in the loop", [
 ("'Human in the loop' means:", ["A person reviews AI output","Humans label data once","AI replaces the team","Users chat with the AI"], "A person checks, corrects or approves what the AI produces before it counts."),
 ("For a high-impact decision such as declining a customer, the safest pattern is:", ["AI flags, a person decides","AI decides automatically","AI decides, no logging","Spot-check one in a thousand"], "Keep the decision with an accountable person when the impact on a customer is high."),
 ("Reviewers approve 99% of AI flags without changes. What should worry you?", ["Reviews became rubber stamps","Nothing, the model is perfect","Reviewers are too slow","There are too few flags"], "Automation bias: people stop checking. Sample reviews and track overrides."),
 ("How do you size the human review team for an AI feature?", ["Flags per day x minutes each","Number of models","Story points","Data volume in GB"], "Expected review volume times handling time gives the capacity you need to plan."),
 ("An AI agent can email customers. Minimum control before go-live?", ["Approval step and off switch","A longer prompt","More training data","A bigger model"], "Anything that acts on customers needs a human gate and a way to stop it fast."),
]),
("Governance and regulation", [
 ("The EU AI Act mainly groups AI systems by:", ["Level of risk","Model size","Vendor country","Price"], "Rules scale with risk: banned uses, high-risk, limited-risk and minimal-risk."),
 ("Under the EU AI Act, which group faces the strictest rules short of a ban?", ["High-risk systems","Limited-risk systems","Minimal-risk systems","Open-source tools"], "High-risk systems need risk management, data quality, logging, human oversight and documentation."),
 ("Scoring individuals' creditworthiness with AI is, under the EU AI Act, generally:", ["High-risk","Minimal risk","Banned","Out of scope"], "Credit scoring of people is listed as high-risk, which matters for banks and insurers."),
 ("A model card documents:", ["Purpose, testing and limits","Vendor pricing","Team roster","Sprint plan"], "It tells users what a model is for, how it was tested and where it shouldn't be used."),
 ("Why keep an audit trail of AI-assisted decisions?", ["To explain and review them later","To speed up the model","To cut storage costs","For marketing"], "Regulators, customers and your own team will ask why a decision was made."),
]),
("AI-Native SAFe", [
 ("In AI-Native SAFe, what replaces the two-day PI Planning?", ["One-day PI Outcome Planning","Daily planning","No planning at all","A yearly OKR review"], "PI Outcome Planning is a one-day event focused on PI and team outcomes, ending with a confidence vote."),
 ("ART Sense and Respond runs:", ["Every iteration, about 2 hours","Once per PI, half a day","Daily, 15 minutes","Once a year"], "It replaces the half-day Inspect and Adapt with a short, regular evidence review."),
 ("Who facilitates ART Sense and Respond?", ["The RTE","The AI Value Architect","Business Owners","Each Scrum Master"], "The RTE runs it: first sensing (metrics, feedback, demos), then responding (pivots, capacity)."),
 ("ART Sense and Respond also absorbs the activities of which Core SAFe event?", ["System Demo","Daily stand-up","Backlog refinement","Sprint planning"], "Demos of the integrated system now feed the sensing half of the event."),
 ("Which new role does AI-Native SAFe add to the ART?", ["AI Value Architect","AI Release Manager","Chief Prompt Officer","Model Owner"], "The AI Value Architect connects business goals to AI work while weighing cost, ethics, legal and risk."),
]),
("Running AI work on a train", [
 ("Model improvement work is hard to estimate. Best way to plan it?", ["Time-boxed experiments","Fixed scope and date","Skip planning","Estimate in lines of code"], "Time-box the experiment with clear exit criteria; decide to continue or stop on evidence."),
 ("An AI feature depends on a data team in another ART. When should this surface?", ["At PI Planning, on the board","After the system demo","When it slips","Never"], "AI work fails on data dependencies more than on models. Make them visible early."),
 ("What should 'done' mean for an AI story?", ["Meets agreed thresholds, monitored","Code merged","Demo given","Model trained once"], "Done means it hits the quality bar on agreed test data and someone watches it in production."),
 ("'Data drift' means:", ["Real inputs move away from training data","Code is merged late","The team changes","The cloud bill rises"], "When the world changes, model quality drops quietly. Monitor inputs, not just uptime."),
 ("Before teams can build a new AI feature, which enabler usually comes first?", ["Clean, accessible data","More testers","A press release","Extra GPUs"], "Without usable data there is nothing to retrieve, train on or test against."),
]),
("Cost and value", [
 ("A GenAI feature costs $0.02 per request and gets 50,000 requests a day. Daily cost?", ["$1,000","$100","$10,000","$2,500"], "0.02 x 50,000 = 1,000. Usage-based costs grow with adoption, so forecast them."),
 ("The best way to show an AI feature's value to leadership:", ["Business metric before vs after","Model accuracy alone","Number of prompts","GPU hours used"], "Leaders fund outcomes: time saved, errors avoided, revenue protected."),
 ("A simple, narrow task needs automation. Sensible first option?", ["A smaller model or rules","The largest model","Train a custom model","Build your own LLM"], "Use the cheapest approach that meets the quality bar; scale up only if it doesn't."),
 ("Which usually cuts GenAI cost most for repeated questions?", ["Caching common answers","Longer prompts","More users","Bigger context windows"], "If many people ask the same thing, don't pay to generate the same answer each time."),
 ("Why pilot an AI tool before scaling it?", ["Prove value on a small scope","Pilots are free","Leaders like demos","To skip governance"], "A pilot gives real numbers and surfaces risks while the cost of being wrong is small."),
]),
("Security and prompt risks", [
 ("Prompt injection is:", ["Hidden instructions hijacking AI","A faster prompt","A training method","A login bug"], "Text inside a document, email or web page tells the model to ignore its rules or leak data."),
 ("An AI agent reads customer emails and can take actions. Biggest new risk?", ["Emails that instruct the agent","A slower inbox","Spam filters","Large attachments"], "Anything the agent reads can carry instructions. Treat inputs as data, never as commands."),
 ("Safest default for an AI agent's access to tools and data:", ["Least privilege","Full admin rights","A shared password","No logging"], "Give the agent only what the task needs, and log what it does."),
 ("Before sending customer data to an external AI service, check:", ["Data agreements and privacy rules","The model's speed","The vendor's logo","Team size"], "Contracts, data residency and privacy law decide what may leave your systems."),
 ("'Red teaming' an AI feature means:", ["Trying to make it fail on purpose","Painting the UI red","A normal code review","Load testing only"], "Testers attack the system with misuse and tricky inputs before real users do."),
]),
("Adoption and change", [
 ("Teams ignore a new AI assistant. First move?", ["Ask what blocks them","Mandate usage","Track each person","Remove old tools"], "Low adoption usually means it doesn't fit the daily work yet. Find out why before pushing."),
 ("Best adoption metric for an internal AI tool:", ["Weekly users doing real tasks","Licences bought","Training hours","One-time logins"], "Count repeat use on real work, not purchases or attendance."),
 ("Leaders want AI 'everywhere' this quarter. Best advice from the RTE?", ["Start with 1-2 high-value cases","Launch everywhere at once","Wait a year","Let each team decide alone"], "Focus proves value and builds the patterns other teams can reuse."),
 ("Who should own the business outcome of an AI use case?", ["A named business owner","The model","IT only","The vendor"], "Someone accountable on the business side decides whether it is working and worth the cost."),
 ("Staff fear AI will replace them. Most effective response?", ["Show how roles change; train","Ignore it","Promise nothing changes","Ban AI tools"], "Honest communication plus skills support builds trust; empty promises break it."),
]),
]
assert 0.02 * 50000 == 1000 and 60 / 100 == 0.6
