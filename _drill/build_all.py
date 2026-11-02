"""Builds the full Daily Data Drill schedule: Tue technical, Wed RTE & Agile coaching, Thu product/program/portfolio.
Usage: python3 build_all.py <site_json_out> <linkedin_kit_out>"""
import sys, json, datetime, re, os
OUT_JSON, OUT_KIT = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__))
sys.argv = [sys.argv[0], os.path.join(here, "daily-data-drill-sql.md")]
sys.path.insert(0, here)
import build_sql as S  # verifies every SQL answer on import

AGILE = [
("RTE · PI Planning under pressure", [
 ("End of PI Planning day 1: Team A's draft plan needs 140% of its capacity. What should the RTE do first?",
  ["Ask the team to plan overtime","Take it to the management review so scope or priorities change","Cut the team's lowest-value features yourself","Accept it and watch the system demos"],"B",
  "Day-1 management review exists for exactly this trade-off. The RTE surfaces it; Business Owners and Product Management decide what moves."),
 ("The confidence vote ends with an average of 2 out of 5. What happens next?",
  ["Proceed, the vote is advisory","Address the concerns and replan until confidence is acceptable","The RTE overrides the vote","Postpone the whole PI"],"B",
  "Low confidence means the plan isn't believable. Hear the concerns, adjust, and vote again before committing."),
 ("On the ART planning board, Team X's feature depends on Team Y, but Team Y has nothing planned for it. Best move?",
  ["Leave it, the teams will sort it out","Get both teams together now to agree a date or log it as a risk","Escalate straight to Business Owners","Drop the feature from the PI"],"B",
  "An unplanned dependency is a hidden risk. Resolve it face to face during planning, when it's cheapest to fix."),
 ("In ROAM, a risk the ART can't remove but everyone agrees to live with is:",
  ["Resolved","Owned","Accepted","Mitigated"],"C",
  "Accepted means the risk stays and the ART consciously carries it. Owned means a named person takes it away to deal with."),
 ("Who assigns business value to team PI objectives?",
  ["The team","Business Owners","The RTE","The Product Owner"],"B",
  "Business Owners score each objective, usually 1-10, while walking the room with each team."),
]),
("Agile coaching · Reading the signals", [
 ("A team's velocity jumps 40% in one sprint. Same people, same kind of work. What do you ask first?",
  ["How are points being estimated now?","Can we raise next PI's targets?","Who should be recognised?","Should this go in the exec report?"],"A",
  "A sudden jump with nothing else changing usually means estimates inflated, not output. Check before celebrating."),
 ("The daily stand-up runs 35 minutes and sounds like a status report to the manager. Best coaching move?",
  ["Cancel stand-ups","Refocus it on the sprint goal and take details offline","Cut people off at 15 minutes","Replace it with an email update"],"B",
  "The fix is purpose, not policy: the team talks to each other about the goal, and problem-solving happens after."),
 ("Retro actions repeat sprint after sprint. Most likely cause?",
  ["The team doesn't care","Actions have no owner and never enter the next sprint backlog","Retros are too short","The retro format is boring"],"B",
  "An improvement with no owner and no capacity is a wish. Put one or two actions in the next sprint with a name on each."),
 ("Planned business value across the ART is 40; achieved is 34. What is the ART's predictability?",
  ["85%","34%","118%","6%"],"A",
  "34 ÷ 40. SAFe treats roughly 80-100% as a reliable train."),
 ("A team keeps carrying stories over sprint after sprint. Where do you look first?",
  ["Add more people","Work in progress and story size","Make sprints longer","Lower the estimates"],"B",
  "Too many large stories started at once is the usual cause. Smaller slices and a WIP limit fix more than headcount."),
]),
]

MGMT = [
("Product management · Value over volume", [
 ("Your largest client asks for a feature that doesn't fit this quarter's roadmap theme. Best first move?",
  ["Build it, they're the biggest client","Understand the problem behind the request","Decline politely","Add it to the bottom of the backlog"],"B",
  "Requests arrive as solutions. Find the underlying problem first; it may fit the roadmap in a different form, or it may not matter."),
 ("Feature A: cost of delay 20, job size 5. Feature B: cost of delay 30, job size 15. Using WSJF, which goes first?",
  ["Feature A","Feature B","It's a tie","Whichever is bigger"],"A",
  "WSJF = cost of delay ÷ job size. A scores 4, B scores 2. Small, valuable work goes first."),
 ("Which metric best shows that a new onboarding flow works?",
  ["Number of features shipped","% of new users who finish onboarding in a day","Story points delivered","Lines of code changed"],"B",
  "Measure the outcome for users, not the output of the team."),
 ("What is an MVP for?",
  ["Testing a hypothesis with real users","Releasing all must-have features","A cheap demo prototype","Phase 1 of the project plan"],"A",
  "It's the smallest thing that tells you whether you're right, not a smaller version of the full plan."),
 ("In SAFe, who owns the ART backlog of features?",
  ["Product Management","The Product Owner","The RTE","The System Architect"],"A",
  "Product Management owns ART features; Product Owners own team backlogs and stories."),
]),
("Program & portfolio · Money, time, priority", [
 ("Two programs need the same scarce specialist in Q1. What should decide?",
  ["Who asked first","Portfolio priority by economic value","The specialist's preference","A 50/50 split"],"B",
  "Splitting a bottleneck usually slows both programs. Rank by value at portfolio level and commit."),
 ("Earned value is 30 and actual cost is 50. What is the cost performance index (CPI)?",
  ["0.6","1.67","0.3","0.5"],"A",
  "CPI = EV ÷ AC. Below 1 means over budget: every 1 spent earns 0.60 of planned work."),
 ("Earned value is 30 and planned value is 40. What is the schedule performance index (SPI)?",
  ["0.75","1.33","0.3","0.4"],"A",
  "SPI = EV ÷ PV. Below 1 means behind schedule."),
 ("In Lean Portfolio Management, a large epic is ready to move forward. What does it need?",
  ["A lean business case reviewed through the portfolio Kanban","Product Owner sign-off","Nothing, teams can start","RTE approval"],"A",
  "Big epics go through the portfolio Kanban with a lean business case, so spend decisions are visible and deliberate."),
 ("A senior stakeholder wants a 40-slide status deck every week. Best response?",
  ["Produce it every week","Agree the few decisions and metrics they need; send one page","Refuse","Have the team build it"],"B",
  "Reporting should serve decisions. A one-page view of risks, asks and trends gets read; 40 slides get skimmed."),
]),
]

import random
from mgmt_more import AGILE_MORE, MGMT_MORE
def shuffled(bank):
    out = []
    for topic, qs in bank:
        rows = []
        for qq, opts, why in qs:
            order = list(range(4)); random.Random(qq).shuffle(order)
            rows.append((qq, [opts[i] for i in order], "ABCD"[order.index(0)], why))
        out.append((topic, rows))
    return out
AGILE += shuffled(AGILE_MORE)
MGMT += shuffled(MGMT_MORE)

START = datetime.date(2026, 12, 1)  # a Tuesday
SITE = "https://madhanirulandi.com/drill/"
SERIES = {
  "tech":  ("Technical", "#SQL #DataAnalytics #LearningInPublic #SkillCheck"),
  "agile": ("RTE & Agile coaching", "#SAFe #ReleaseTrainEngineer #AgileCoaching #SkillCheck"),
  "mgmt":  ("Product, program & portfolio", "#ProductManagement #ProgramManagement #PortfolioManagement #SkillCheck"),
}
tbls = {}
def tdata(t):
    if t not in tbls:
        cols = [d[1] for d in S.db.execute(f"PRAGMA table_info({t})")]
        tbls[t] = {"cols": cols, "rows": [["NULL" if v is None else v for v in r] for r in S.q(f"SELECT * FROM {t}")]}
    return t

days = []
weeks = max(len(S.DAYS), len(AGILE), len(MGMT))
for w in range(weeks):
    for offset, key, bank in ((0, "tech", S.DAYS), (1, "agile", AGILE), (2, "mgmt", MGMT)):
        if w >= len(bank): continue
        item = bank[w]
        if key == "tech":
            title, tables, qs = item
            topic = title.split("·", 1)[1].strip()
            tl = [tdata(t.strip()) for t in tables.split(",")]
            qs = [(a, b, c, d) for a, b, c, d, _, _ in qs]
        else:
            topic, qs = item; tl = []
        date = START + datetime.timedelta(weeks=w, days=offset)
        for qq, opts, ans, _ in qs:
            assert ans in "ABCD" and len(opts) == 4, (topic, qq)
        days.append({"id": f"{key}-{w+1}", "series": SERIES[key][0], "topic": topic, "date": date.isoformat(), "tables": tl,
                     "questions": [{"q": a, "options": b, "answer": "ABCD".index(c), "why": d} for a, b, c, d in qs]})
days.sort(key=lambda d: d["date"])

kit = ["# Skill Check: LinkedIn kit\n\nTue technical · Wed RTE & Agile coaching · Thu product, program & portfolio.\n\n",
       "Poll limits: question ≤140 characters, 2-4 options ≤30 characters each, can't be edited after posting. ",
       "Put the link in the first comment. Comment last post's answer before publishing the next one.\n"]
for n, d in enumerate(days, 1):
    key = d["id"].split("-")[0]
    qs = d["questions"]
    pick = next((i for i, x in enumerate(qs) if max(len(o) for o in x["options"]) <= 30), None)
    assert pick is not None, ("no poll-friendly question", d["id"])
    x = qs[pick]
    plain = re.sub(r"`([^`]*)`", r"\1", x["q"])
    pollq = plain if len(plain) <= 140 else "Which option is correct? Answer before you look it up."
    body = f"Skill Check #{n} · {d['series']}: {d['topic']} 🧠\n\n{plain}\n\n"
    if d["tables"]:
        td = tbls[d["tables"][0]]
        body += f"Table: {d['tables'][0]}\n" + "\n".join([" | ".join(map(str, td["cols"]))] + [" | ".join(map(str, r)) for r in td["rows"][:6]]) + "\n\n"
    body += f"Vote below. Answer and reasoning in the comments next time.\n4 more questions: link in the first comment.\n\n{SERIES[key][1]}"
    letter = "ABCD"[x["answer"]]
    kit.append(f"\n---\n\n## #{n} · {datetime.date.fromisoformat(d['date']):%a %d %b} · {d['series']}: {d['topic']}\n\n**Post text**\n\n```\n{body}\n```\n\n"
               f"**Poll question:** {pollq}\n\n**Poll options:** " + " · ".join(f"{'ABCD'[k]}) {o}" for k, o in enumerate(x["options"])) +
               f"\n\n**Poll duration:** 1 week\n\n**First comment:** All 5 questions with instant answers: {SITE}?utm_source=linkedin#{d['id']}\n\n"
               f"**Answer comment (before the next post):** ✅ {letter}) {x['options'][x['answer']]}. {x['why']}\n")

json.dump({"start": START.isoformat(), "days": days, "tables": tbls}, open(OUT_JSON, "w"), ensure_ascii=False, separators=(",", ":"))
open(OUT_KIT, "w").write("".join(kit))
print("days:", len(days), "| first:", days[0]["date"], "| last:", days[-1]["date"])
for d in days[:8]: print(d["date"], d["id"], d["topic"])
