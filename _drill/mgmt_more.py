"""Weeks 3-9 of the management series. Correct option is written FIRST; build_all shuffles positions deterministically."""
AGILE_MORE = [
("RTE · Inspect & Adapt", [
 ("In the I&A problem-solving workshop, what comes before brainstorming solutions?", ["Root-cause analysis","Voting on fixes","Assigning owners","Updating the roadmap"], "Fishbone or 5 Whys first; otherwise you fix symptoms."),
 ("At the PI system demo, a feature works on one team's laptop but isn't integrated in staging. How is it counted?", ["Not done","Done","Half done","Ask the Product Owner"], "Only integrated, working increments count toward the PI."),
 ("Three teams raise the same impediment at I&A. Best RTE move?", ["Treat it as an ART-level problem and own the fix","Let each team fix it alone","Escalate it to HR","Wait one more PI to confirm"], "A repeated impediment across teams is systemic. That's the RTE's to drive."),
 ("The quantitative part of I&A mostly reviews:", ["Predictability and flow metrics","Individual performance","Team salaries","Number of meetings held"], "I&A looks at the system's results, never at individuals."),
 ("Where should I&A improvement items go?", ["Into the next PI Planning backlog","Into a slide deck","Onto a wiki page","The RTE's personal to-do list"], "If it isn't planned with capacity, it won't happen."),
]),
("Agile coaching · Coaching leaders", [
 ("A VP asks for each team's velocity to compare teams. Best response?", ["Explain velocity isn't comparable; offer outcome metrics","Send the numbers","Refuse to share any data","Normalise points across teams"], "Each team's points are a private scale. Comparing them invites inflation."),
 ("A manager keeps assigning tasks to individuals in a self-organising team. First coaching step?", ["Ask what outcome they're worried about","Report the manager","Ignore it","Make the board private"], "Control usually comes from fear of a specific risk. Address the worry, not the behaviour."),
 ("Leadership wants 'agile' but keeps annual fixed-scope contracts. Main risk?", ["Fixed scope blocks learning from feedback","Teams move too fast","Too many demos","Morale gets too high"], "If scope can't change, feedback has nowhere to go."),
 ("Best sign a leader has adopted Lean-Agile thinking:", ["They attend system demos and act on what they see","They use Jira","They read the framework website","They ask for daily status reports"], "Going to see the real work, then removing obstacles, is the behaviour that matters."),
 ("Servant leadership, in one phrase:", ["Remove blockers for teams","Do the team's work","Approve every decision","Avoid all conflict"], "The leader's job is to make the team's work easier, not to do it or gate it."),
]),
("RTE · Dependencies and ART sync", [
 ("What is the ART sync for?", ["Tracking progress and dependencies across teams","Daily status for executives","Replacing team stand-ups","Planning the next PI"], "Coach sync and PO sync keep the train's plan and dependencies honest between PI Plannings."),
 ("A cross-team dependency slips two sprints and threatens a PI objective. First move?", ["Tell Business Owners now, with options","Wait for the system demo","Ask for overtime","Quietly drop the objective"], "Early bad news with options keeps trust; late surprises destroy it."),
 ("Best long-term way to reduce dependencies:", ["Organise teams around value streams","Add coordination meetings","Use a bigger Jira board","Make PIs longer"], "Fewer hand-offs beat better hand-off management."),
 ("A shared DBA team is a bottleneck for five teams. Smallest effective fix?", ["Plan their capacity in PI Planning","Hire five DBAs","Let teams queue","Skip database changes"], "Make the bottleneck visible and planned before buying more of it."),
 ("On the ART planning board, strings between cards show:", ["Dependencies","Team capacity","Resolved risks","Story points"], "Each string links a feature to work another team must deliver first."),
]),
("Agile coaching · Flow metrics", [
 ("Flow time measures:", ["Start to done for one item","Hours worked per week","Sprint length","Time spent in meetings"], "It's the customer's wait, not the team's effort."),
 ("WIP is 20 items and throughput is 5 items a week. Average flow time (Little's Law)?", ["4 weeks","25 weeks","0.25 weeks","100 weeks"], "Flow time = WIP ÷ throughput = 20 ÷ 5."),
 ("An item had 2 days of active work and 8 days waiting. Flow efficiency?", ["20%","25%","80%","10%"], "Active ÷ total = 2 ÷ 10. Most waste is waiting, not working."),
 ("Fastest lever to cut flow time:", ["Reduce work in progress","Ask people to work faster","Add more meetings","Make sprints longer"], "Little's Law again: less WIP, shorter wait, same people."),
 ("A dashboard shows 98% of stories delivered 'on time' every sprint. What should make you curious?", ["Scope may be trimmed quietly to hit dates","Nothing, it's great","The colours","The tool"], "Near-perfect numbers often mean the target is being managed, not the work."),
]),
("RTE · Release governance", [
 ("'Release on demand' means:", ["Deploy anytime, release when business wants","Release only at PI end","Release when testers approve","Release every night"], "Separating deploy from release lets the business choose timing."),
 ("Feature toggles let you:", ["Deploy code without exposing it to users","Skip testing","Avoid code review","Merge less often"], "Code goes live dark, then is switched on deliberately."),
 ("4 of 50 deployments caused incidents. Change failure rate?", ["8%","4%","12.5%","92%"], "4 ÷ 50. One of the four DORA metrics."),
 ("Moving from monthly to weekly releases usually needs first:", ["Automated tests and a pipeline","More approval meetings","Bigger releases","A new tool licence"], "Frequency follows automation; approvals can't scale to weekly."),
 ("Who decides when a feature goes live to customers?", ["Product Management / the business","The RTE","The tester","The developer"], "Release is a business decision; the RTE makes sure it's possible."),
]),
("Agile coaching · Conflict and safety", [
 ("In retros, people only say positive things. Likely signal?", ["Low psychological safety","A great team","Retros are too short","Wrong retro tool"], "Silence about problems usually means it doesn't feel safe to raise them."),
 ("Two senior engineers clash over architecture in every refinement. Best move?", ["Facilitate a session with agreed decision criteria","Pick a winner","Split them into teams","Wait it out"], "Agree how to decide before arguing what to decide."),
 ("A team member admits a mistake that caused an outage. Best first response?", ["Thank them and run a blameless review","Name them in the incident report","Remove their access","Say nothing"], "Punish honesty once and you'll never hear about problems early again."),
 ("Tuckman's 'storming' stage is:", ["Normal, and needs facilitation","A sign to break up the team","The final stage","Avoidable with good hiring"], "Every team passes through it; the coach helps it pass quickly."),
 ("Remote team, cameras off, little discussion. First step?", ["Ask the team what would help","Make cameras mandatory","Add more meetings","Report it to HR"], "Start with their view of the problem before imposing a fix."),
]),
("RTE · AI in delivery", [
 ("A team wants an AI assistant to draft user stories. Key control?", ["Human review against acceptance criteria","None needed","Ban it","Use it only on Fridays"], "AI can draft; people stay accountable for what's committed."),
 ("An AI screening step cut false positives from 30% to 15%. Relative reduction?", ["50%","15%","30%","45%"], "(30 − 15) ÷ 30. Absolute drop is 15 points; relative drop is half."),
 ("Before scaling an AI feature across the ART, the RTE should ensure:", ["Clear success metrics and a governance owner","A bigger budget","More features","A new ART"], "Without a metric and an owner, nobody can say if it works or stop it if it doesn't."),
 ("Retrieval-augmented generation (RAG) mainly helps by:", ["Grounding answers in your own documents","Training a new model","Making models smaller","Removing the need for data"], "It fetches relevant content first, so answers cite your sources."),
 ("Biggest testing challenge with AI features:", ["Outputs vary for the same input","Too much documentation","Slow typing","Too few meetings"], "Non-deterministic output needs evaluation sets, not just pass/fail tests."),
]),
]

MGMT_MORE = [
("Product · Discovery and prioritisation", [
 ("RICE: reach 2,000, impact 2, confidence 50%, effort 4. Score?", ["500","1,000","2,000","250"], "2,000 × 2 × 0.5 ÷ 4."),
 ("In the Kano model, a feature customers only notice when it's missing is a:", ["Basic need","Delighter","Performance need","Indifferent feature"], "Basics don't win customers, but missing them loses customers."),
 ("Cheapest way to test demand before building:", ["A fake-door or landing-page test","Build the full feature","Ask the sales team","A large survey"], "Measure behaviour, not opinions, before spending engineering time."),
 ("Best customer-interview question:", ["Tell me about the last time you did this","Would you use this feature?","How much would you pay?","Do you like our product?"], "Past behaviour predicts; hypothetical answers flatter."),
 ("An opportunity solution tree starts from:", ["A desired outcome","A feature list","A competitor","A deadline"], "Outcome first, then opportunities, then solutions, then experiments."),
]),
("Program · Risk and RAID", [
 ("RAID stands for:", ["Risks, Assumptions, Issues, Dependencies","Roles, Actions, Ideas, Decisions","Risks, Actions, Incidents, Deadlines","Reviews, Audits, Issues, Delays"], "One log for everything that can derail the program."),
 ("A risk has a 40% chance and a ₹50 lakh impact. Expected monetary value?", ["₹20 lakh","₹50 lakh","₹90 lakh","₹10 lakh"], "0.4 × 50. Use EMV to compare risks and size contingency."),
 ("Difference between a risk and an issue:", ["A risk may happen; an issue already has","No difference","Issues are smaller","Risks are only financial"], "Issues need action now; risks need a plan."),
 ("Best response to a likely, high-impact risk you can't avoid:", ["Mitigate it and name an owner","Accept it silently","Wait until it happens","Pass it to the team"], "Reduce the probability or the impact, and make one person answerable."),
 ("A (5 days) comes before B (3 days) and C (6 days); D (2 days) needs both B and C. Shortest project length?", ["13 days","10 days","16 days","11 days"], "Critical path A → C → D = 5 + 6 + 2."),
]),
("Portfolio · Lean budgets", [
 ("Lean budgets fund:", ["Value streams, not projects","Each project separately","Only IT","Individual tool purchases"], "Stable funding for long-lived teams removes constant re-approval."),
 ("Lean budget guardrails are:", ["Rules keeping spend aligned with strategy","Hard project limits","Audit penalties","Fixed headcount caps"], "They give freedom inside clear boundaries."),
 ("ART capacity is 100 points and 20% is reserved for tech debt. Points left for new features?", ["80","20","100","120"], "Capacity allocation makes the trade-off explicit before planning."),
 ("Moving from project to value-stream funding mainly reduces:", ["Start-stop delays from re-approvals","Team size","Number of features","The need for metrics"], "Teams stop waiting for each project's business case to clear."),
 ("An epic's MVP disproves its hypothesis. Lean response?", ["Pivot or stop, and move the money","Fund the full epic anyway","Blame the team","Extend it by a year"], "Stopping early is the point of an MVP, not a failure."),
]),
("Product · Metrics that matter", [
 ("Best North Star metric for an insurance self-service portal:", ["Requests completed without a call","Page views","Number of features","Logins"], "It captures customer value and business value at once."),
 ("1,000 users joined in January; 600 are still active in March. Three-month retention?", ["60%","40%","6%","160%"], "Active ÷ starting cohort."),
 ("Survey: 50% promoters, 30% passives, 20% detractors. NPS?", ["30","50","20","70"], "Promoters − detractors. Passives don't count."),
 ("A vanity metric is one that:", ["Looks good but doesn't guide decisions","Is hard to measure","Is always wrong","Only executives see"], "If it can't change what you do next, it's decoration."),
 ("Conversion fell after a redesign, but only on mobile. Next step?", ["Segment and check the mobile flow","Roll back everything","Ignore it","Redesign again"], "Narrow the problem before reacting to it."),
]),
("Program · Stakeholders and communication", [
 ("In RACI, how many people are Accountable for one task?", ["Exactly one","At least two","Everyone involved","None"], "Shared accountability means no accountability."),
 ("A stakeholder with high power but low interest should be:", ["Kept satisfied","Managed closely","Kept informed","Only monitored"], "Low effort, but never surprise them."),
 ("You learn of a two-week slip. When do you tell the sponsor?", ["Now, with recovery options","At the monthly review","After you try to recover","Only if asked"], "Early bad news with options is a planning input; late bad news is a crisis."),
 ("Status was green for six months, then suddenly red. What failed?", ["Early, honest reporting","The colour scheme","The reporting tool","The sponsor"], "Watermelon status: green outside, red inside."),
 ("How many communication channels in a team of 10?", ["45","10","90","100"], "n(n − 1) ÷ 2 = 10 × 9 ÷ 2. Why big teams struggle."),
]),
("Portfolio · OKRs and strategic themes", [
 ("Which is a good key result?", ["Cut onboarding from 10 days to 3","Launch the new portal","Work harder on quality","Hold 5 workshops"], "Measurable outcome, not an activity or a wish."),
 ("Key result: cut onboarding from 10 days to 3. You reached 5. Progress?", ["71%","50%","60%","29%"], "(10 − 5) ÷ (10 − 3) = 5 ÷ 7."),
 ("Portfolio strategic themes are:", ["Business objectives that steer the portfolio","Colour schemes","Team names","Sprint goals"], "They connect strategy to what gets funded."),
 ("Should OKRs be tied directly to pay?", ["No, it discourages stretch goals","Yes, always","Only for managers","Only for sales"], "When pay depends on hitting them, people set safe targets."),
 ("Typical number of objectives per team per quarter:", ["3 to 5","10 to 15","Exactly 1","20 or more"], "Few enough to say no to everything else."),
]),
("Program · Estimation and vendors", [
 ("Function points measure:", ["Functionality delivered to users","Lines of code","Team hours","Server load"], "Size from the user's view, independent of language."),
 ("400 function points at 8 hours each. Effort?", ["3,200 hours","408 hours","50 hours","4,000 hours"], "400 × 8. Calibrate the rate with your own past data."),
 ("A fixed-price vendor contract fits best when:", ["Scope is clear and stable","Requirements will change a lot","You want to learn fast","The technology is new"], "Fixed price punishes change; use it where change is unlikely."),
 ("The cone of uncertainty says early estimates are:", ["The least accurate","The most accurate","Always 10% optimistic","Useless"], "Ranges should narrow as you learn; give ranges early."),
 ("What most improves estimate accuracy quickly?", ["Calibrating with past actuals","Padding by 50%","Asking the vendor","Estimating low"], "Your own history beats expert guesses."),
]),
]

# arithmetic checks for the calculation questions
assert 20/5 == 4 and round(2/10*100) == 20 and 4/50*100 == 8 and (30-15)/30 == .5
assert 2000*2*0.5/4 == 500 and 0.4*50 == 20 and 5+6+2 == 13 and 100*0.8 == 80
assert 600/1000 == .6 and 50-20 == 30 and 10*9//2 == 45 and round((10-5)/(10-3)*100) == 71 and 400*8 == 3200
