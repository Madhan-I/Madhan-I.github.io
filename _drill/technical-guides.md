# Skill Check: beginner guides for Technical Tuesdays

Read the guide the evening before you post. Run the Colab code to see each answer yourself, then try one small change of your own.

---

## Skill Check Technical #1 · 2026-12-01 · Insurance · Filtering rows

### The idea in plain words

**Tables and filters.** A table is a spreadsheet. `SELECT` picks columns, `FROM` names the table, `WHERE` keeps only rows that pass a test. `AND` needs both tests true, `OR` needs one, `NOT` flips. SQL does AND before OR, like × before + in maths, so use brackets. NULL means unknown: comparisons with it are never true, so those rows drop out.

### The five answers

| Q | Answer | Say it in one line |
|---|---|---|
| 1 | B) C. Iyer | Only C. Iyer is both Active and in NY. |
| 2 | C) 4 | Two Term Life policies plus Whole Life (3400) and Auto (1500). |
| 3 | C) 3 | AND runs before OR, so this means MA rows OR (NY and Lapsed): 2 + 1. Use brackets to be safe. |
| 4 | A) 3 | 1200, 3400 and 1500. The NULL premium is neither bigger nor smaller, so it drops out. |
| 5 | B) 2 | Lapsed and Pending. |

### Check it yourself in Google Colab

New notebook → paste → Shift + Enter.

```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE policies(policy_id INT, holder TEXT, product TEXT, premium INT, status TEXT, state TEXT);
INSERT INTO policies VALUES
(101,'A. Rao','Term Life',1200,'Active','MA'),
(102,'B. Shah','Whole Life',3400,'Lapsed','NY'),
(103,'C. Iyer','Term Life',900,'Active','NY'),
(104,'D. Khan','Auto',1500,'Active','MA'),
(105,'E. Paul','Auto',NULL,'Pending','IL');
""")
questions = {
 "Q1": "SELECT holder FROM policies WHERE status='Active' AND state='NY'",
 "Q2": "SELECT COUNT(*) FROM policies WHERE product='Term Life' OR premium>1400",
 "Q3": "SELECT COUNT(*) FROM policies WHERE state='MA' OR state='NY' AND status='Lapsed'",
 "Q4": "SELECT COUNT(*) FROM policies WHERE premium>1000",
 "Q5": "SELECT COUNT(*) FROM policies WHERE NOT status='Active'",
}
for q, sql in questions.items():
    print(q, db.execute(sql).fetchall())
```

Expected output: Q1 [('C. Iyer',)] · Q2 [(4,)] · Q3 [(3,)] · Q4 [(3,)] · Q5 [(2,)]

---

## Skill Check Technical #2 · 2026-12-08 · Banking · IN, BETWEEN, LIKE, NULL

### The idea in plain words

**Shortcuts for WHERE.** `IN ('a','b')` means 'equals any of these'. `BETWEEN 700 AND 2500` includes both ends. `LIKE '2026-01-0%'` matches patterns: `%` is 'anything after'. `<>` means 'not equal', but NULL rows still drop out. `COALESCE(x, 'fallback')` swaps a NULL for a value you choose.

### The five answers

| Q | Answer | Say it in one line |
|---|---|---|
| 1 | B) 4 | Three UPI and one ATM. |
| 2 | C) 3 | BETWEEN includes both ends: 2500, 700 and 1500. |
| 3 | A) 2 | NEFT and ATM. The NULL channel is not 'not UPI' to SQL. It is unknown, so it is excluded. |
| 4 | C) 4 | Dates 03, 05, 07 and 07. `%` matches any characters after. |
| 5 | B) BRANCH | COALESCE returns the first non-NULL value. Use it to label missing data in reports. |

### Check it yourself in Google Colab

New notebook → paste → Shift + Enter.

```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE transactions(txn_id INT, account TEXT, type TEXT, amount INT, channel TEXT, txn_date TEXT);
INSERT INTO transactions VALUES
(1,'ACC1','DEBIT',2500,'UPI','2026-01-03'),
(2,'ACC2','CREDIT',10000,'NEFT','2026-01-05'),
(3,'ACC1','DEBIT',NULL,'ATM','2026-01-07'),
(4,'ACC3','DEBIT',700,'UPI','2026-01-07'),
(5,'ACC2','DEBIT',4000,NULL,'2026-01-10'),
(6,'ACC1','CREDIT',1500,'UPI','2026-01-12');
""")
questions = {
 "Q1": "SELECT COUNT(*) FROM transactions WHERE channel IN ('UPI','ATM')",
 "Q2": "SELECT COUNT(*) FROM transactions WHERE amount BETWEEN 700 AND 2500",
 "Q3": "SELECT COUNT(*) FROM transactions WHERE channel <> 'UPI'",
 "Q4": "SELECT COUNT(*) FROM transactions WHERE txn_date LIKE '2026-01-0%'",
 "Q5": "SELECT COALESCE(channel,'BRANCH') FROM transactions WHERE txn_id=5",
}
for q, sql in questions.items():
    print(q, db.execute(sql).fetchall())
```

Expected output: Q1 [(4,)] · Q2 [(3,)] · Q3 [(2,)] · Q4 [(4,)] · Q5 [('BRANCH',)]

---

## Skill Check Technical #3 · 2026-12-15 · Retail · Sorting, DISTINCT, CASE

### The idea in plain words

**Sorting and labels.** `ORDER BY price DESC` sorts high to low; add a second column to break ties. `LIMIT 1 OFFSET 1` skips one row, then takes one. `DISTINCT` removes duplicate rows, judging the whole row. `CASE WHEN … THEN … ELSE … END` is SQL's IF: it stops at the first true branch.

### The five answers

| Q | Answer | Say it in one line |
|---|---|---|
| 1 | B) Kettle | OFFSET 1 skips the top row (Jeans), leaving the 2nd most expensive. |
| 2 | C) 5 | DISTINCT works on the whole row (dept and supplier together). Grocery appears with S1, S2 and NULL. |
| 3 | B) 2 | Rice (450) and Kettle (899). T-Shirt at 399 just misses. CASE stops at the first true branch. |
| 4 | C) Jeans | Sorts by dept A→Z first (Apparel), then by price high→low within it. |
| 5 | A) 3 | S1, S2, S3. NULL is not counted. |

### Check it yourself in Google Colab

New notebook → paste → Shift + Enter.

```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE items(item_id INT, name TEXT, dept TEXT, price INT, supplier TEXT);
INSERT INTO items VALUES
(1,'Rice 5kg','Grocery',450,'S1'),
(2,'Oil 1L','Grocery',180,'S2'),
(3,'T-Shirt','Apparel',399,'S3'),
(4,'Jeans','Apparel',1299,'S3'),
(5,'Kettle','Home',899,'S1'),
(6,'Soap','Grocery',45,NULL);
""")
questions = {
 "Q1": "SELECT name FROM items ORDER BY price DESC LIMIT 1 OFFSET 1",
 "Q2": "SELECT COUNT(*) FROM (SELECT DISTINCT dept, supplier FROM items)",
 "Q3": "SELECT COUNT(*) FROM items WHERE CASE WHEN price>=1000 THEN 'Premium' WHEN price>=400 THEN 'Mid' ELSE 'Value' END='Mid'",
 "Q4": "SELECT name FROM items ORDER BY dept, price DESC LIMIT 1",
 "Q5": "SELECT COUNT(DISTINCT supplier) FROM items",
}
for q, sql in questions.items():
    print(q, db.execute(sql).fetchall())
```

Expected output: Q1 [('Kettle',)] · Q2 [(5,)] · Q3 [(2,)] · Q4 [('Jeans',)] · Q5 [(3,)]

---

## Skill Check Technical #4 · 2026-12-22 · Health insurance claims · GROUP BY, HAVING

### The idea in plain words

**Grouping.** `GROUP BY provider` makes one row per provider. `COUNT`, `SUM` and `AVG` then work per group, and they ignore NULLs. `HAVING` filters groups after grouping; `WHERE` filters rows before. NULLs form their own group. `SUM(CASE WHEN … THEN 1 ELSE 0 END)` counts rows that meet a condition.

### The five answers

| Q | Answer | Say it in one line |
|---|---|---|
| 1 | C) NULL | NULLs form their own group, and 3 claims have no reason. Add `WHERE denial_reason IS NOT NULL` for the real top reason. |
| 2 | A) City Hospital | City Hospital 10000, Care Clinic 2000, Lab One 600. |
| 3 | B) 1040 | 5200 ÷ 5. The Pending claim's NULL is skipped, but the zero-paid denials are counted. |
| 4 | B) 50.0 | 3 denied out of 6 claims. SUM(CASE…) is the standard way to count a condition. |
| 5 | B) Avoids integer division returning 0 | In many databases 3/6 with whole numbers is 0. A decimal forces decimal maths. |

### Check it yourself in Google Colab

New notebook → paste → Shift + Enter.

```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE claims(claim_id INT, provider TEXT, status TEXT, billed INT, paid INT, denial_reason TEXT);
INSERT INTO claims VALUES
(1,'City Hospital','Paid',5000,4000,NULL),
(2,'City Hospital','Denied',3000,0,'Missing Auth'),
(3,'Care Clinic','Paid',1200,1200,NULL),
(4,'Care Clinic','Denied',800,0,'Duplicate'),
(5,'City Hospital','Denied',2000,0,'Missing Auth'),
(6,'Lab One','Pending',600,NULL,NULL);
""")
questions = {
 "Q1": "SELECT denial_reason FROM claims GROUP BY denial_reason ORDER BY COUNT(*) DESC LIMIT 1",
 "Q2": "SELECT provider FROM claims GROUP BY provider HAVING SUM(billed)>2500",
 "Q3": "SELECT AVG(paid) FROM claims",
 "Q4": "SELECT ROUND(100.0*SUM(CASE WHEN status='Denied' THEN 1 ELSE 0 END)/COUNT(*),1) FROM claims",
}
for q, sql in questions.items():
    print(q, db.execute(sql).fetchall())
```

Expected output: Q1 [(None,)] · Q2 [('City Hospital',)] · Q3 [(1040.0,)] · Q4 [(50.0,)]

---

## Skill Check Technical #5 · 2026-12-29 · Retail suppliers · INNER and LEFT JOIN

### The idea in plain words

**Joining two tables.** `JOIN … ON a.x = b.y` keeps only rows that match on both sides (INNER JOIN). `LEFT JOIN` keeps every row from the left table and fills blanks with NULL when nothing matches. A condition on the right table in `WHERE` quietly turns a LEFT JOIN back into an INNER JOIN. `CROSS JOIN` pairs every row with every row.

### The five answers

| Q | Answer | Say it in one line |
|---|---|---|
| 1 | B) 5 | Soap has no supplier, so INNER JOIN drops it. |
| 2 | C) 6 | S1→2 items, S2→1, S3→2, and HomeCo is kept once with NULLs. |
| 3 | C) HomeCo | The anti-join pattern: suppliers with zero items listed. |
| 4 | A) 3 | Filtering the right table in WHERE throws away the NULL rows, so your LEFT JOIN behaves like an INNER JOIN. Put the condition in ON to keep all 6 items. |
| 5 | C) 24 | Every item with every supplier: 6 × 4. |

### Check it yourself in Google Colab

New notebook → paste → Shift + Enter.

```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE items(item_id INT, name TEXT, dept TEXT, price INT, supplier TEXT);
INSERT INTO items VALUES
(1,'Rice 5kg','Grocery',450,'S1'),
(2,'Oil 1L','Grocery',180,'S2'),
(3,'T-Shirt','Apparel',399,'S3'),
(4,'Jeans','Apparel',1299,'S3'),
(5,'Kettle','Home',899,'S1'),
(6,'Soap','Grocery',45,NULL);
CREATE TABLE suppliers(supplier_id TEXT, sname TEXT, country TEXT);
INSERT INTO suppliers VALUES
('S1','Agro Foods','IN'),
('S2','PureOil','IN'),
('S3','Fabrico','BD'),
('S4','HomeCo','CN');
""")
questions = {
 "Q1": "SELECT COUNT(*) FROM items i JOIN suppliers s ON i.supplier=s.supplier_id",
 "Q2": "SELECT COUNT(*) FROM suppliers s LEFT JOIN items i ON i.supplier=s.supplier_id",
 "Q3": "SELECT s.sname FROM suppliers s LEFT JOIN items i ON i.supplier=s.supplier_id WHERE i.item_id IS NULL",
 "Q4": "SELECT COUNT(*) FROM items i LEFT JOIN suppliers s ON i.supplier=s.supplier_id WHERE s.country='IN'",
 "Q5": "SELECT COUNT(*) FROM items CROSS JOIN suppliers",
}
for q, sql in questions.items():
    print(q, db.execute(sql).fetchall())
```

Expected output: Q1 [(5,)] · Q2 [(6,)] · Q3 [('HomeCo',)] · Q4 [(3,)] · Q5 [(24,)]

---

## Skill Check Technical #6 · 2027-01-05 · Agile delivery · Self joins and metrics

### The idea in plain words

**Self joins and delivery metrics.** A self join reads one table twice under two names, for example employees and managers. Chained joins (stories → epics → people) follow IDs across tables. `NOT EXISTS (…)` keeps rows where the inner query finds nothing. Predictability = done points ÷ planned points.

### The five answers

| Q | Answer | Say it in one line |
|---|---|---|
| 1 | B) Arun | A self join reads one table twice: once as employees, once as managers. |
| 2 | B) 2 | Arun and Neha. Vik reports to Arun, not Priya. |
| 3 | B) 70.0 | Beta finished 7 of its 10 points. |
| 4 | C) 16 | Neha owns Policy Docs (8 + 5) and Claims API (3). |
| 5 | C) Claims API | Claims API has only a carried-over story. |

### Check it yourself in Google Colab

New notebook → paste → Shift + Enter.

```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE people(id INT, name TEXT, manager_id INT);
INSERT INTO people VALUES
(1,'Priya',NULL),
(2,'Arun',1),
(3,'Neha',1),
(4,'Vik',2);
CREATE TABLE stories(story_id INT, team TEXT, sprint TEXT, points INT, status TEXT, epic_id INT);
INSERT INTO stories VALUES
(1,'Alpha','S1',5,'Done',10),
(2,'Alpha','S1',3,'Done',10),
(3,'Alpha','S2',8,'Carried',11),
(4,'Beta','S1',5,'Done',11),
(5,'Beta','S2',2,'Done',NULL),
(6,'Beta','S2',3,'Carried',12);
CREATE TABLE epics(epic_id INT, title TEXT, owner_id INT);
INSERT INTO epics VALUES
(10,'Onboarding AI',2),
(11,'Policy Docs',3),
(12,'Claims API',3);
""")
questions = {
 "Q1": "SELECT m.name FROM people e LEFT JOIN people m ON e.manager_id=m.id WHERE e.name='Vik'",
 "Q2": "SELECT COUNT(*) FROM people e JOIN people m ON e.manager_id=m.id WHERE m.name='Priya'",
 "Q3": "SELECT ROUND(100.0*SUM(CASE WHEN status='Done' THEN points ELSE 0 END)/SUM(points),1) FROM stories WHERE team='Beta'",
 "Q4": "SELECT SUM(s.points) FROM stories s JOIN epics e ON s.epic_id=e.epic_id JOIN people p ON e.owner_id=p.id WHERE p.name='Neha'",
 "Q5": "SELECT title FROM epics e WHERE NOT EXISTS (SELECT 1 FROM stories s WHERE s.epic_id=e.epic_id AND s.status='Done')",
}
for q, sql in questions.items():
    print(q, db.execute(sql).fetchall())
```

Expected output: Q1 [('Arun',)] · Q2 [(2,)] · Q3 [(70.0,)] · Q4 [(16,)] · Q5 [('Claims API',)]

---

## Skill Check Technical #7 · 2027-01-12 · Banking · Subqueries

### The idea in plain words

**Subqueries.** A query inside brackets runs first and feeds the outer query. `IN (subquery)` checks membership. A correlated subquery reruns for each outer row (e.g. 'this branch's average'). **Trap:** `NOT IN` returns nothing if the list contains a NULL. `NOT EXISTS` is the safe version.

### The five answers

| Q | Answer | Say it in one line |
|---|---|---|
| 1 | B) 2 | Average is 92,000. ACC2 and ACC4 are above it. |
| 2 | B) 2 | ACC1 beats Chennai's 30,000 and ACC2 beats Mumbai's 140,000. ACC4 equals Delhi's average, which isn't above it. |
| 3 | B) 2 | ACC1 and ACC2. |
| 4 | C) 0 | One NULL in a NOT IN list makes every comparison unknown, so the result is zero. A real production bug. |
| 5 | A) 4 | NOT EXISTS ignores the NULL safely. Prefer it over NOT IN. |

### Check it yourself in Google Colab

New notebook → paste → Shift + Enter.

```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE accounts(acc TEXT, branch TEXT, balance INT, segment TEXT);
INSERT INTO accounts VALUES
('ACC1','Chennai',52000,'Retail'),
('ACC2','Mumbai',250000,'Premier'),
('ACC3','Chennai',8000,'Retail'),
('ACC4','Delhi',120000,'Premier'),
('ACC5','Mumbai',30000,'Retail');
CREATE TABLE watchlist(acc TEXT);
INSERT INTO watchlist VALUES
('ACC3'),
(NULL);
CREATE TABLE transactions(txn_id INT, account TEXT, type TEXT, amount INT, channel TEXT, txn_date TEXT);
INSERT INTO transactions VALUES
(1,'ACC1','DEBIT',2500,'UPI','2026-01-03'),
(2,'ACC2','CREDIT',10000,'NEFT','2026-01-05'),
(3,'ACC1','DEBIT',NULL,'ATM','2026-01-07'),
(4,'ACC3','DEBIT',700,'UPI','2026-01-07'),
(5,'ACC2','DEBIT',4000,NULL,'2026-01-10'),
(6,'ACC1','CREDIT',1500,'UPI','2026-01-12');
""")
questions = {
 "Q1": "SELECT COUNT(*) FROM accounts WHERE balance>(SELECT AVG(balance) FROM accounts)",
 "Q2": "SELECT COUNT(*) FROM accounts a WHERE balance>(SELECT AVG(balance) FROM accounts b WHERE b.branch=a.branch)",
 "Q3": "SELECT COUNT(*) FROM accounts WHERE acc IN (SELECT account FROM transactions WHERE type='CREDIT')",
 "Q4": "SELECT COUNT(*) FROM accounts WHERE acc NOT IN (SELECT acc FROM watchlist)",
 "Q5": "SELECT COUNT(*) FROM accounts a WHERE NOT EXISTS (SELECT 1 FROM watchlist w WHERE w.acc=a.acc)",
}
for q, sql in questions.items():
    print(q, db.execute(sql).fetchall())
```

Expected output: Q1 [(2,)] · Q2 [(2,)] · Q3 [(2,)] · Q4 [(0,)] · Q5 [(4,)]

---

## Skill Check Technical #8 · 2027-01-19 · Product analytics · Funnels with CTEs

### The idea in plain words

**CTEs for funnels.** `WITH name AS (…)` names a subquery so the main query reads clearly. It exists only for that one statement. Funnels count distinct users at each step, but only users who did the earlier step; otherwise later steps look inflated.

### The five answers

| Q | Answer | Say it in one line |
|---|---|---|
| 1 | C) 4 | Includes user 5, who did KYC without signing up. Raw counts can overstate a funnel step. |
| 2 | B) 3 | Users 1, 2 and 4. The CTE keeps the funnel honest. |
| 3 | C) 50% | 2 of 4 signed-up users activated. |
| 4 | B) 1 | Only user 4, on day 2. |
| 5 | C) Only for the one statement it belongs to | A CTE is a named subquery for a single statement. For reuse across queries, create a view. |

### Check it yourself in Google Colab

New notebook → paste → Shift + Enter.

```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE events(user_id INT, event TEXT, day INT);
INSERT INTO events VALUES
(1,'signup',1),
(1,'kyc',1),
(1,'activate',2),
(2,'signup',1),
(2,'kyc',3),
(3,'signup',2),
(4,'signup',2),
(4,'kyc',2),
(4,'activate',2),
(5,'kyc',3);
""")
questions = {
 "Q1": "SELECT COUNT(DISTINCT user_id) FROM events WHERE event='kyc'",
 "Q2": "WITH signed AS (SELECT DISTINCT user_id FROM events WHERE event='signup') SELECT COUNT(DISTINCT e.user_id) FROM events e JOIN signed s ON e.user_id=s.user_id WHERE e.event='kyc'",
 "Q3": "SELECT 100.0*COUNT(DISTINCT CASE WHEN event='activate' THEN user_id END)/COUNT(DISTINCT CASE WHEN event='signup' THEN user_id END) FROM events",
 "Q4": "SELECT COUNT(*) FROM events a JOIN events b ON a.user_id=b.user_id AND a.day=b.day WHERE a.event='signup' AND b.event='activate'",
}
for q, sql in questions.items():
    print(q, db.execute(sql).fetchall())
```

Expected output: Q1 [(4,)] · Q2 [(3,)] · Q3 [(50.0,)] · Q4 [(1,)]

---

## Skill Check Technical #9 · 2027-01-26 · Retail stores · Ranking with window functions

### The idea in plain words

**Ranking with window functions.** `… OVER (PARTITION BY store ORDER BY revenue DESC)` calculates per group without collapsing rows. `ROW_NUMBER` gives 1, 2, 3. `RANK` gives ties the same number then skips (1, 1, 3); `DENSE_RANK` doesn't skip (1, 1, 2). `SUM(...) OVER (PARTITION BY ...)` adds a group total on every row.

### The five answers

| Q | Answer | Say it in one line |
|---|---|---|
| 1 | B) 3 | One per store: Chennai, Mumbai and Delhi. |
| 2 | C) 3 and 2 | RANK leaves a gap after a tie; DENSE_RANK doesn't. |
| 3 | B) Mumbai | Mumbai 600, Chennai 340, Delhi 90. |
| 4 | B) 7 | A window function adds a column without collapsing rows. GROUP BY would give 3. |
| 5 | B) 41.7 | 250 ÷ 600. |

### Check it yourself in Google Colab

New notebook → paste → Shift + Enter.

```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE store_sales(store TEXT, month INT, revenue INT);
INSERT INTO store_sales VALUES
('Chennai',1,100),
('Chennai',2,120),
('Chennai',3,120),
('Mumbai',1,200),
('Mumbai',2,150),
('Mumbai',3,250),
('Delhi',1,90);
""")
questions = {
 "Q1": "SELECT COUNT(*) FROM (SELECT ROW_NUMBER() OVER (PARTITION BY store ORDER BY revenue DESC) rn FROM store_sales) WHERE rn=1",
 "Q2": "SELECT RANK() OVER (ORDER BY revenue DESC), DENSE_RANK() OVER (ORDER BY revenue DESC) FROM store_sales WHERE store='Chennai' ORDER BY revenue LIMIT 1",
 "Q3": "SELECT store FROM store_sales GROUP BY store ORDER BY SUM(revenue) DESC LIMIT 1",
 "Q4": "SELECT COUNT(*) FROM (SELECT store, SUM(revenue) OVER (PARTITION BY store) FROM store_sales)",
 "Q5": "SELECT ROUND(100.0*revenue/SUM(revenue) OVER (PARTITION BY store),1) FROM store_sales WHERE store='Mumbai' ORDER BY month DESC LIMIT 1",
}
for q, sql in questions.items():
    print(q, db.execute(sql).fetchall())
```

Expected output: Q1 [(3,)] · Q2 [(3, 2)] · Q3 [('Mumbai',)] · Q4 [(7,)] · Q5 [(41.7,)]

---

## Skill Check Technical #10 · 2027-02-02 · Banking ledger · Running totals, LAG, LEAD

### The idea in plain words

**Running totals, LAG and LEAD.** `SUM(amount) OVER (ORDER BY day)` is a running balance. `LAG(x)` reads the previous row's value; `LEAD(x)` reads the next row's. The first row has no previous one, so LAG gives NULL. `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` makes a moving window of 3 rows.

### The five answers

| Q | Answer | Say it in one line |
|---|---|---|
| 1 | C) 2000 | 5000 − 2000 − 1000. |
| 2 | C) NULL | Day 1 has no previous row, so the result is NULL. |
| 3 | B) 5000 | 4000 − (−1000). |
| 4 | B) 3 | ACC2's next entry is on day 3. |
| 5 | A) 1000 | −2000 − 1000 + 4000. |

### Check it yourself in Google Colab

New notebook → paste → Shift + Enter.

```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE ledger(acc TEXT, d INT, amount INT);
INSERT INTO ledger VALUES
('ACC1',1,5000),
('ACC1',2,-2000),
('ACC1',3,-1000),
('ACC1',4,4000),
('ACC2',1,1000),
('ACC2',3,500);
""")
questions = {
 "Q1": "SELECT bal FROM (SELECT d, SUM(amount) OVER (PARTITION BY acc ORDER BY d) bal FROM ledger WHERE acc='ACC1') WHERE d=3",
 "Q2": "SELECT LAG(amount) OVER (PARTITION BY acc ORDER BY d) FROM ledger WHERE acc='ACC1' ORDER BY d LIMIT 1",
 "Q3": "SELECT x FROM (SELECT d, amount-LAG(amount) OVER (PARTITION BY acc ORDER BY d) x FROM ledger WHERE acc='ACC1') WHERE d=4",
 "Q4": "SELECT LEAD(d) OVER (PARTITION BY acc ORDER BY d) FROM ledger WHERE acc='ACC2' ORDER BY d LIMIT 1",
 "Q5": "SELECT x FROM (SELECT d, SUM(amount) OVER (PARTITION BY acc ORDER BY d ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) x FROM ledger WHERE acc='ACC1') WHERE d=4",
}
for q, sql in questions.items():
    print(q, db.execute(sql).fetchall())
```

Expected output: Q1 [(2000,)] · Q2 [(None,)] · Q3 [(5000,)] · Q4 [(3,)] · Q5 [(1000,)]

---

## Skill Check Technical #11 · 2027-02-09 · Insurance renewals · Messy text and dates

### The idea in plain words

**Messy text and dates.** 'MA', 'MA ' and 'ma' are three different values until you clean them with `UPPER(TRIM(x))`. `SUBSTR(text, start, length)` cuts out part of a string. Dates stored as text sort as text, so keep them as real dates or as 'YYYY-MM-DD'. `BETWEEN … AND '2026-12-31'` misses times later on the 31st. `NULLIF(x, 0)` turns 0 into NULL to avoid divide-by-zero errors.

### The five answers

| Q | Answer | Say it in one line |
|---|---|---|
| 1 | C) 3 | Trailing spaces and case make them different values. `GROUP BY UPPER(TRIM(state))` gives 1. |
| 2 | A) LIF | Start at position 1 and take 3 characters. Handy for product codes. |
| 3 | B) 05-01-2027 | Text sorts character by character, so '05' beats '20'. That's wrong, because Dec 2026 is earliest. Store dates as DATE or as ISO 'YYYY-MM-DD'. |
| 4 | B) 2 | '2026-12-31 10:00' is later than '2026-12-31', so it's missed. Use `due < '2027-01-01'` for timestamps. |
| 5 | B) NULL, to avoid divide-by-zero errors | NULLIF turns 0 into NULL, and dividing by NULL gives NULL instead of crashing. |

### Check it yourself in Google Colab

New notebook → paste → Shift + Enter.

```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE renewals(policy_no TEXT, state TEXT, due TEXT);
INSERT INTO renewals VALUES
('LIF-2031','MA','2026-12-05'),
('LIF-2032','MA ','2026-12-31'),
('HLT-1090','ma','2026-12-31 10:00'),
('AUT-7781','NY','2027-01-02');
CREATE TABLE text_dates(due TEXT);
INSERT INTO text_dates VALUES
('05-01-2027'),
('20-12-2026'),
('10-02-2027');
""")
questions = {
 "Q1": "SELECT COUNT(DISTINCT state) FROM renewals WHERE UPPER(TRIM(state))='MA'",
 "Q2": "SELECT SUBSTR('LIF-2031',1,3)",
 "Q3": "SELECT due FROM text_dates ORDER BY due LIMIT 1",
 "Q4": "SELECT COUNT(*) FROM renewals WHERE due BETWEEN '2026-12-01' AND '2026-12-31'",
 "Q5": "SELECT NULLIF(0,0)",
}
for q, sql in questions.items():
    print(q, db.execute(sql).fetchall())
```

Expected output: Q1 [(3,)] · Q2 [('LIF',)] · Q3 [('05-01-2027',)] · Q4 [(2,)] · Q5 [(None,)]

---

## Skill Check Technical #12 · 2027-02-16 · Release planning · Set operations and query order

### The idea in plain words

**Stacking result sets.** `UNION` stacks two results and removes duplicates; `UNION ALL` keeps them. `INTERSECT` keeps rows in both; `EXCEPT` keeps rows in the first but not the second. SQL runs a query in this order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. That's why a SELECT alias can't be used in WHERE.

### The five answers

| Q | Answer | Say it in one line |
|---|---|---|
| 1 | A) 4 | UNION removes duplicates: Login, Docs, Search, Chat. |
| 2 | C) 7 | UNION ALL keeps everything: 3 + 4. It's also faster, because it skips de-duplication. |
| 3 | B) 2 | Docs and Search are in both. These are features carried across PIs. |
| 4 | B) Login | In PI-1 but dropped from PI-2. (Oracle calls this MINUS.) |
| 5 | B) FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY | This explains why a SELECT alias can't be used in WHERE but can be used in ORDER BY. |

### Check it yourself in Google Colab

New notebook → paste → Shift + Enter.

```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE pi1(feature TEXT);
INSERT INTO pi1 VALUES
('Login'),
('Docs'),
('Search');
CREATE TABLE pi2(feature TEXT);
INSERT INTO pi2 VALUES
('Docs'),
('Search'),
('Chat'),
('Search');
""")
questions = {
 "Q1": "SELECT COUNT(*) FROM (SELECT feature FROM pi1 UNION SELECT feature FROM pi2)",
 "Q2": "SELECT COUNT(*) FROM (SELECT feature FROM pi1 UNION ALL SELECT feature FROM pi2)",
 "Q3": "SELECT COUNT(*) FROM (SELECT feature FROM pi1 INTERSECT SELECT feature FROM pi2)",
 "Q4": "SELECT feature FROM pi1 EXCEPT SELECT feature FROM pi2",
}
for q, sql in questions.items():
    print(q, db.execute(sql).fetchall())
```

Expected output: Q1 [(4,)] · Q2 [(7,)] · Q3 [(2,)] · Q4 [('Login',)]

---

## Skill Check Technical #13 · 2027-02-23 · Investing · A personal stock portfolio

### The idea in plain words

**Portfolio maths with SQL.** Realised profit = (sell − buy) × shares, only for sold positions. Market value = shares × today's price, only for positions still held. A weighted average weights each price by its size: `SUM(shares × price) ÷ SUM(shares)`. A plain `AVG` treats a 1-share buy like a 1,000-share buy.

### The five answers

| Q | Answer | Say it in one line |
|---|---|---|
| 1 | B) 400 | BLK: 120 × 2 = 240, plus MS: 20 × 8 = 160. |
| 2 | B) 6540 | JPM 2100 + GS 2000 + V 1560 + BLK 880. |
| 3 | B) BLK | BLK was bought twice, at different prices. |
| 4 | B) 766.67 | (2 × 700 + 1 × 900) ÷ 3. Plain AVG(buy_price) gives 800 and ignores position size, a common reporting mistake. |
| 5 | B) 40.0 | (210 − 150) ÷ 150. |

### Check it yourself in Google Colab

New notebook → paste → Shift + Enter.

```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE portfolio(ticker TEXT, sector TEXT, shares INT, buy_price INT, sell_price INT);
INSERT INTO portfolio VALUES
('JPM','Banking',10,150,NULL),
('BLK','Asset Mgmt',2,700,820),
('GS','Banking',5,350,NULL),
('MS','Banking',8,90,110),
('V','Payments',6,230,NULL),
('BLK','Asset Mgmt',1,900,NULL);
CREATE TABLE prices(ticker TEXT, close INT);
INSERT INTO prices VALUES
('JPM',210),
('BLK',880),
('GS',400),
('MS',100),
('V',260);
""")
questions = {
 "Q1": "SELECT SUM((sell_price-buy_price)*shares) FROM portfolio WHERE sell_price IS NOT NULL",
 "Q2": "SELECT SUM(p.shares*c.close) FROM portfolio p JOIN prices c ON p.ticker=c.ticker WHERE p.sell_price IS NULL",
 "Q3": "SELECT ticker FROM portfolio GROUP BY ticker HAVING COUNT(*)>1",
 "Q4": "SELECT ROUND(1.0*SUM(shares*buy_price)/SUM(shares),2) FROM portfolio WHERE ticker='BLK'",
 "Q5": "SELECT ROUND(100.0*(c.close-p.buy_price)/p.buy_price,1) FROM portfolio p JOIN prices c ON p.ticker=c.ticker WHERE p.ticker='JPM'",
}
for q, sql in questions.items():
    print(q, db.execute(sql).fetchall())
```

Expected output: Q1 [(400,)] · Q2 [(6540,)] · Q3 [('BLK',)] · Q4 [(766.67,)] · Q5 [(40.0,)]

---

## Skill Check Technical #14 · 2027-03-02 · Career moves · A job-application tracker

### The idea in plain words

**A job tracker as data.** Count by stage, find the top offer with `ORDER BY … DESC LIMIT 1` (filter out NULLs first), count distinct companies, and keep each company's latest row with `ROW_NUMBER() OVER (PARTITION BY company ORDER BY applied DESC) = 1`. The same pattern finds the latest record per customer in any system.

### The five answers

| Q | Answer | Say it in one line |
|---|---|---|
| 1 | B) 2 | BlackRock and BCG. |
| 2 | B) JPMorgan, Program Manager | 105,000 beats 95,000. Careful: in some databases (PostgreSQL, Oracle) NULLs sort first in DESC, so add `WHERE offer_eur IS NOT NULL`. |
| 3 | B) 5 | JPMorgan appears twice. |
| 4 | B) 33.3 | 2 offers from 6 applications. |
| 5 | B) 5 | One row per company. For JPMorgan, the 22 Oct Program Manager application wins. |

### Check it yourself in Google Colab

New notebook → paste → Shift + Enter.

```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE applications(company TEXT, role TEXT, city TEXT, stage TEXT, offer_eur INT, applied TEXT);
INSERT INTO applications VALUES
('BlackRock','Program Manager','London','Interview',NULL,'2026-11-03'),
('Vanguard','Agile Coach','Dublin','Applied',NULL,'2026-11-04'),
('JPMorgan','Release Train Engineer','Glasgow','Offer',95000,'2026-10-20'),
('Deloitte','Delivery Manager','Amsterdam','Rejected',NULL,'2026-10-15'),
('BCG','Product Manager','Berlin','Interview',NULL,'2026-10-28'),
('JPMorgan','Program Manager','London','Offer',105000,'2026-10-22');
""")
questions = {
 "Q1": "SELECT COUNT(*) FROM applications WHERE stage='Interview'",
 "Q2": "SELECT company, role FROM applications WHERE offer_eur IS NOT NULL ORDER BY offer_eur DESC LIMIT 1",
 "Q3": "SELECT COUNT(DISTINCT company) FROM applications",
 "Q4": "SELECT ROUND(100.0*SUM(CASE WHEN stage='Offer' THEN 1 ELSE 0 END)/COUNT(*),1) FROM applications",
 "Q5": "SELECT COUNT(*) FROM (SELECT ROW_NUMBER() OVER (PARTITION BY company ORDER BY applied DESC) rn FROM applications) WHERE rn=1",
}
for q, sql in questions.items():
    print(q, db.execute(sql).fetchall())
```

Expected output: Q1 [(2,)] · Q2 [('JPMorgan', 'Program Manager')] · Q3 [(5,)] · Q4 [(33.3,)] · Q5 [(5,)]
