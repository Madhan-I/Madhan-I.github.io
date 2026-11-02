"""Beginner guides for every Tuesday (technical) post. Usage: python3 gen_guides.py <drill.json> <out.md>"""
import sys, os, json, re
JSON, OUT = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here)
sys.argv = [sys.argv[0], os.devnull]
import build_sql as S

PRIMER = [
 "**Tables and filters.** A table is a spreadsheet. `SELECT` picks columns, `FROM` names the table, `WHERE` keeps only rows that pass a test. `AND` needs both tests true, `OR` needs one, `NOT` flips. SQL does AND before OR, like × before + in maths, so use brackets. NULL means unknown: comparisons with it are never true, so those rows drop out.",
 "**Shortcuts for WHERE.** `IN ('a','b')` means 'equals any of these'. `BETWEEN 700 AND 2500` includes both ends. `LIKE '2026-01-0%'` matches patterns: `%` is 'anything after'. `<>` means 'not equal', but NULL rows still drop out. `COALESCE(x, 'fallback')` swaps a NULL for a value you choose.",
 "**Sorting and labels.** `ORDER BY price DESC` sorts high to low; add a second column to break ties. `LIMIT 1 OFFSET 1` skips one row, then takes one. `DISTINCT` removes duplicate rows, judging the whole row. `CASE WHEN … THEN … ELSE … END` is SQL's IF: it stops at the first true branch.",
 "**Grouping.** `GROUP BY provider` makes one row per provider. `COUNT`, `SUM` and `AVG` then work per group, and they ignore NULLs. `HAVING` filters groups after grouping; `WHERE` filters rows before. NULLs form their own group. `SUM(CASE WHEN … THEN 1 ELSE 0 END)` counts rows that meet a condition.",
 "**Joining two tables.** `JOIN … ON a.x = b.y` keeps only rows that match on both sides (INNER JOIN). `LEFT JOIN` keeps every row from the left table and fills blanks with NULL when nothing matches. A condition on the right table in `WHERE` quietly turns a LEFT JOIN back into an INNER JOIN. `CROSS JOIN` pairs every row with every row.",
 "**Self joins and delivery metrics.** A self join reads one table twice under two names, for example employees and managers. Chained joins (stories → epics → people) follow IDs across tables. `NOT EXISTS (…)` keeps rows where the inner query finds nothing. Predictability = done points ÷ planned points.",
 "**Subqueries.** A query inside brackets runs first and feeds the outer query. `IN (subquery)` checks membership. A correlated subquery reruns for each outer row (e.g. 'this branch's average'). **Trap:** `NOT IN` returns nothing if the list contains a NULL. `NOT EXISTS` is the safe version.",
 "**CTEs for funnels.** `WITH name AS (…)` names a subquery so the main query reads clearly. It exists only for that one statement. Funnels count distinct users at each step, but only users who did the earlier step; otherwise later steps look inflated.",
 "**Ranking with window functions.** `… OVER (PARTITION BY store ORDER BY revenue DESC)` calculates per group without collapsing rows. `ROW_NUMBER` gives 1, 2, 3. `RANK` gives ties the same number then skips (1, 1, 3); `DENSE_RANK` doesn't skip (1, 1, 2). `SUM(...) OVER (PARTITION BY ...)` adds a group total on every row.",
 "**Running totals, LAG and LEAD.** `SUM(amount) OVER (ORDER BY day)` is a running balance. `LAG(x)` reads the previous row's value; `LEAD(x)` reads the next row's. The first row has no previous one, so LAG gives NULL. `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` makes a moving window of 3 rows.",
 "**Messy text and dates.** 'MA', 'MA ' and 'ma' are three different values until you clean them with `UPPER(TRIM(x))`. `SUBSTR(text, start, length)` cuts out part of a string. Dates stored as text sort as text, so keep them as real dates or as 'YYYY-MM-DD'. `BETWEEN … AND '2026-12-31'` misses times later on the 31st. `NULLIF(x, 0)` turns 0 into NULL to avoid divide-by-zero errors.",
 "**Stacking result sets.** `UNION` stacks two results and removes duplicates; `UNION ALL` keeps them. `INTERSECT` keeps rows in both; `EXCEPT` keeps rows in the first but not the second. SQL runs a query in this order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. That's why a SELECT alias can't be used in WHERE.",
 "**Portfolio maths with SQL.** Realised profit = (sell − buy) × shares, only for sold positions. Market value = shares × today's price, only for positions still held. A weighted average weights each price by its size: `SUM(shares × price) ÷ SUM(shares)`. A plain `AVG` treats a 1-share buy like a 1,000-share buy.",
 "**A job tracker as data.** Count by stage, find the top offer with `ORDER BY … DESC LIMIT 1` (filter out NULLs first), count distinct companies, and keep each company's latest row with `ROW_NUMBER() OVER (PARTITION BY company ORDER BY applied DESC) = 1`. The same pattern finds the latest record per customer in any system.",
]
assert len(PRIMER) == len(S.DAYS)

def lit(v):
    return "NULL" if v is None else (str(v) if isinstance(v, (int, float)) else "'" + str(v).replace("'", "''") + "'")
def create_sql(t):
    info = list(S.db.execute(f"PRAGMA table_info({t})"))
    rows = S.q(f"SELECT * FROM {t}")
    return (f"CREATE TABLE {t}(" + ", ".join(f"{c[1]} {c[2]}" for c in info) + ");\nINSERT INTO " + t + " VALUES\n" +
            ",\n".join("(" + ",".join(lit(v) for v in r) + ")" for r in rows) + ";")

dates = {d["id"]: d["date"] for d in json.load(open(JSON))["days"]}
out = ["# Skill Check: beginner guides for Technical Tuesdays\n\nRead the guide the evening before you post. ",
       "Run the Colab code to see each answer yourself, then try one small change of your own.\n"]
for n, (title, tables, qs) in enumerate(S.DAYS, 1):
    topic = title.split("·", 1)[1].strip()
    tl = [t.strip() for t in tables.split(",")]
    extra = ["transactions"] if any("transactions" in (x[4] or "") for x in qs) and "transactions" not in tl else []
    extra += ["text_dates"] if any("text_dates" in (x[4] or "") for x in qs) else []
    out.append(f"\n---\n\n## Skill Check Technical #{n} · {dates[f'tech-{n}']} · {topic}\n\n### The idea in plain words\n\n{PRIMER[n-1]}\n\n### The five answers\n\n| Q | Answer | Say it in one line |\n|---|---|---|\n")
    for i, (qq, opts, ans, why, sql, exp) in enumerate(qs, 1):
        out.append(f"| {i} | {ans}) {opts['ABCD'.index(ans)]} | {why.replace('|', '/')} |\n")
    code = "import sqlite3\ndb = sqlite3.connect(\":memory:\")\ndb.executescript(\"\"\"\n" + "\n".join(create_sql(t) for t in tl + extra) + "\n\"\"\")\nquestions = {\n"
    code += "".join(f' "Q{i}": "{sql.replace(chr(34), chr(39)*0 + chr(92) + chr(34))}",\n' for i, (_, _, _, _, sql, _) in enumerate(qs, 1) if sql)
    code += "}\nfor q, sql in questions.items():\n    print(q, db.execute(sql).fetchall())\n"
    expect = " · ".join(f"Q{i} {exp}" for i, (_, _, _, _, sql, exp) in enumerate(qs, 1) if sql)
    # prove the snippet runs and prints the expected answers
    ns = {}; import io, contextlib
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf): exec(code, ns)
    for i, (_, _, _, _, sql, exp) in enumerate(qs, 1):
        if sql: assert f"Q{i} {exp}" in buf.getvalue(), (n, i, buf.getvalue())
    out.append(f"\n### Check it yourself in Google Colab\n\nNew notebook → paste → Shift + Enter.\n\n```python\n{code}```\n\nExpected output: {expect}\n")
open(OUT, "w").write("".join(out))
print("guides:", len(S.DAYS), "| every snippet ran and matched")
