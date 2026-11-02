import sqlite3, sys

db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE policies(policy_id INT, holder TEXT, product TEXT, premium INT, status TEXT, state TEXT);
INSERT INTO policies VALUES
(101,'A. Rao','Term Life',1200,'Active','MA'),(102,'B. Shah','Whole Life',3400,'Lapsed','NY'),
(103,'C. Iyer','Term Life',900,'Active','NY'),(104,'D. Khan','Auto',1500,'Active','MA'),
(105,'E. Paul','Auto',NULL,'Pending','IL');

CREATE TABLE transactions(txn_id INT, account TEXT, type TEXT, amount INT, channel TEXT, txn_date TEXT);
INSERT INTO transactions VALUES
(1,'ACC1','DEBIT',2500,'UPI','2026-01-03'),(2,'ACC2','CREDIT',10000,'NEFT','2026-01-05'),
(3,'ACC1','DEBIT',NULL,'ATM','2026-01-07'),(4,'ACC3','DEBIT',700,'UPI','2026-01-07'),
(5,'ACC2','DEBIT',4000,NULL,'2026-01-10'),(6,'ACC1','CREDIT',1500,'UPI','2026-01-12');

CREATE TABLE items(item_id INT, name TEXT, dept TEXT, price INT, supplier TEXT);
INSERT INTO items VALUES
(1,'Rice 5kg','Grocery',450,'S1'),(2,'Oil 1L','Grocery',180,'S2'),(3,'T-Shirt','Apparel',399,'S3'),
(4,'Jeans','Apparel',1299,'S3'),(5,'Kettle','Home',899,'S1'),(6,'Soap','Grocery',45,NULL);

CREATE TABLE claims(claim_id INT, provider TEXT, status TEXT, billed INT, paid INT, denial_reason TEXT);
INSERT INTO claims VALUES
(1,'City Hospital','Paid',5000,4000,NULL),(2,'City Hospital','Denied',3000,0,'Missing Auth'),
(3,'Care Clinic','Paid',1200,1200,NULL),(4,'Care Clinic','Denied',800,0,'Duplicate'),
(5,'City Hospital','Denied',2000,0,'Missing Auth'),(6,'Lab One','Pending',600,NULL,NULL);

CREATE TABLE suppliers(supplier_id TEXT, sname TEXT, country TEXT);
INSERT INTO suppliers VALUES ('S1','Agro Foods','IN'),('S2','PureOil','IN'),('S3','Fabrico','BD'),('S4','HomeCo','CN');

CREATE TABLE people(id INT, name TEXT, manager_id INT);
INSERT INTO people VALUES (1,'Priya',NULL),(2,'Arun',1),(3,'Neha',1),(4,'Vik',2);
CREATE TABLE stories(story_id INT, team TEXT, sprint TEXT, points INT, status TEXT, epic_id INT);
INSERT INTO stories VALUES
(1,'Alpha','S1',5,'Done',10),(2,'Alpha','S1',3,'Done',10),(3,'Alpha','S2',8,'Carried',11),
(4,'Beta','S1',5,'Done',11),(5,'Beta','S2',2,'Done',NULL),(6,'Beta','S2',3,'Carried',12);
CREATE TABLE epics(epic_id INT, title TEXT, owner_id INT);
INSERT INTO epics VALUES (10,'Onboarding AI',2),(11,'Policy Docs',3),(12,'Claims API',3);

CREATE TABLE accounts(acc TEXT, branch TEXT, balance INT, segment TEXT);
INSERT INTO accounts VALUES ('ACC1','Chennai',52000,'Retail'),('ACC2','Mumbai',250000,'Premier'),
('ACC3','Chennai',8000,'Retail'),('ACC4','Delhi',120000,'Premier'),('ACC5','Mumbai',30000,'Retail');
CREATE TABLE watchlist(acc TEXT);
INSERT INTO watchlist VALUES ('ACC3'),(NULL);

CREATE TABLE events(user_id INT, event TEXT, day INT);
INSERT INTO events VALUES (1,'signup',1),(1,'kyc',1),(1,'activate',2),(2,'signup',1),(2,'kyc',3),
(3,'signup',2),(4,'signup',2),(4,'kyc',2),(4,'activate',2),(5,'kyc',3);

CREATE TABLE store_sales(store TEXT, month INT, revenue INT);
INSERT INTO store_sales VALUES ('Chennai',1,100),('Chennai',2,120),('Chennai',3,120),
('Mumbai',1,200),('Mumbai',2,150),('Mumbai',3,250),('Delhi',1,90);

CREATE TABLE ledger(acc TEXT, d INT, amount INT);
INSERT INTO ledger VALUES ('ACC1',1,5000),('ACC1',2,-2000),('ACC1',3,-1000),('ACC1',4,4000),('ACC2',1,1000),('ACC2',3,500);

CREATE TABLE renewals(policy_no TEXT, state TEXT, due TEXT);
INSERT INTO renewals VALUES ('LIF-2031','MA','2026-12-05'),('LIF-2032','MA ','2026-12-31'),
('HLT-1090','ma','2026-12-31 10:00'),('AUT-7781','NY','2027-01-02');
CREATE TABLE text_dates(due TEXT);
INSERT INTO text_dates VALUES ('05-01-2027'),('20-12-2026'),('10-02-2027');

CREATE TABLE portfolio(ticker TEXT, sector TEXT, shares INT, buy_price INT, sell_price INT);
INSERT INTO portfolio VALUES ('JPM','Banking',10,150,NULL),('BLK','Asset Mgmt',2,700,820),('GS','Banking',5,350,NULL),
('MS','Banking',8,90,110),('V','Payments',6,230,NULL),('BLK','Asset Mgmt',1,900,NULL);
CREATE TABLE prices(ticker TEXT, close INT);
INSERT INTO prices VALUES ('JPM',210),('BLK',880),('GS',400),('MS',100),('V',260);
CREATE TABLE applications(company TEXT, role TEXT, city TEXT, stage TEXT, offer_eur INT, applied TEXT);
INSERT INTO applications VALUES
('BlackRock','Program Manager','London','Interview',NULL,'2026-11-03'),
('Vanguard','Agile Coach','Dublin','Applied',NULL,'2026-11-04'),
('JPMorgan','Release Train Engineer','Glasgow','Offer',95000,'2026-10-20'),
('Deloitte','Delivery Manager','Amsterdam','Rejected',NULL,'2026-10-15'),
('BCG','Product Manager','Berlin','Interview',NULL,'2026-10-28'),
('JPMorgan','Program Manager','London','Offer',105000,'2026-10-22');
CREATE TABLE pi1(feature TEXT); INSERT INTO pi1 VALUES ('Login'),('Docs'),('Search');
CREATE TABLE pi2(feature TEXT); INSERT INTO pi2 VALUES ('Docs'),('Search'),('Chat'),('Search');
""")
q = lambda s: db.execute(s).fetchall()

# (question, [options], answer_letter, explanation, check_sql or None, expected)
DAYS = [
("Day 1 · Insurance · Filtering rows", "policies", [
 ("Which holder is returned by `SELECT holder FROM policies WHERE status='Active' AND state='NY'`?",
  ["B. Shah","C. Iyer","A. Rao","No rows"],"B","Only C. Iyer is both Active and in NY.",
  "SELECT holder FROM policies WHERE status='Active' AND state='NY'",[('C. Iyer',)]),
 ("How many rows: `WHERE product='Term Life' OR premium > 1400`?",["2","3","4","5"],"C",
  "Two Term Life policies plus Whole Life (3400) and Auto (1500).",
  "SELECT COUNT(*) FROM policies WHERE product='Term Life' OR premium>1400",[(4,)]),
 ("How many rows: `WHERE state='MA' OR state='NY' AND status='Lapsed'`?",["1","2","3","4"],"C",
  "AND runs before OR, so this means MA rows OR (NY and Lapsed): 2 + 1. Use brackets to be safe.",
  "SELECT COUNT(*) FROM policies WHERE state='MA' OR state='NY' AND status='Lapsed'",[(3,)]),
 ("How many policies have `premium > 1000`?",["3","4","5","2"],"A",
  "1200, 3400 and 1500. The NULL premium is neither bigger nor smaller, so it drops out.",
  "SELECT COUNT(*) FROM policies WHERE premium>1000",[(3,)]),
 ("How many rows: `WHERE NOT status='Active'`?",["1","2","3","0"],"B","Lapsed and Pending.",
  "SELECT COUNT(*) FROM policies WHERE NOT status='Active'",[(2,)]),
]),
("Day 2 · Banking · IN, BETWEEN, LIKE, NULL", "transactions", [
 ("How many rows: `WHERE channel IN ('UPI','ATM')`?",["3","4","5","6"],"B","Three UPI and one ATM.",
  "SELECT COUNT(*) FROM transactions WHERE channel IN ('UPI','ATM')",[(4,)]),
 ("How many rows: `WHERE amount BETWEEN 700 AND 2500`?",["1","2","3","4"],"C","BETWEEN includes both ends: 2500, 700 and 1500.",
  "SELECT COUNT(*) FROM transactions WHERE amount BETWEEN 700 AND 2500",[(3,)]),
 ("How many rows: `WHERE channel <> 'UPI'`?",["2","3","4","6"],"A",
  "NEFT and ATM. The NULL channel is not 'not UPI' to SQL. It is unknown, so it is excluded.",
  "SELECT COUNT(*) FROM transactions WHERE channel <> 'UPI'",[(2,)]),
 ("How many rows: `WHERE txn_date LIKE '2026-01-0%'`?",["2","3","4","6"],"C","Dates 03, 05, 07 and 07. `%` matches any characters after.",
  "SELECT COUNT(*) FROM transactions WHERE txn_date LIKE '2026-01-0%'",[(4,)]),
 ("What does `COALESCE(channel,'BRANCH')` return for txn 5?",["NULL","BRANCH","Error","An empty string"],"B",
  "COALESCE returns the first non-NULL value. Use it to label missing data in reports.",
  "SELECT COALESCE(channel,'BRANCH') FROM transactions WHERE txn_id=5",[('BRANCH',)]),
]),
("Day 3 · Retail · Sorting, DISTINCT, CASE", "items", [
 ("`ORDER BY price DESC LIMIT 1 OFFSET 1` returns:",["Jeans","Kettle","Rice 5kg","T-Shirt"],"B",
  "OFFSET 1 skips the top row (Jeans), leaving the 2nd most expensive.",
  "SELECT name FROM items ORDER BY price DESC LIMIT 1 OFFSET 1",[('Kettle',)]),
 ("How many rows: `SELECT DISTINCT dept, supplier FROM items`?",["3","4","5","6"],"C",
  "DISTINCT works on the whole row (dept and supplier together). Grocery appears with S1, S2 and NULL.",
  "SELECT COUNT(*) FROM (SELECT DISTINCT dept, supplier FROM items)",[(5,)]),
 ("With `CASE WHEN price>=1000 THEN 'Premium' WHEN price>=400 THEN 'Mid' ELSE 'Value' END`, how many are 'Mid'?",["1","2","3","4"],"B",
  "Rice (450) and Kettle (899). T-Shirt at 399 just misses. CASE stops at the first true branch.",
  "SELECT COUNT(*) FROM items WHERE CASE WHEN price>=1000 THEN 'Premium' WHEN price>=400 THEN 'Mid' ELSE 'Value' END='Mid'",[(2,)]),
 ("First row of `ORDER BY dept, price DESC`?",["Rice 5kg","Kettle","Jeans","T-Shirt"],"C",
  "Sorts by dept A→Z first (Apparel), then by price high→low within it.",
  "SELECT name FROM items ORDER BY dept, price DESC LIMIT 1",[('Jeans',)]),
 ("`SELECT COUNT(DISTINCT supplier) FROM items` returns:",["3","4","5","6"],"A","S1, S2, S3. NULL is not counted.",
  "SELECT COUNT(DISTINCT supplier) FROM items",[(3,)]),
]),
("Day 4 · Health insurance claims · GROUP BY, HAVING", "claims", [
 ("`SELECT denial_reason, COUNT(*) FROM claims GROUP BY denial_reason ORDER BY 2 DESC LIMIT 1` returns which reason?",
  ["Missing Auth","Duplicate","NULL","Error"],"C",
  "NULLs form their own group, and 3 claims have no reason. Add `WHERE denial_reason IS NOT NULL` for the real top reason.",
  "SELECT denial_reason FROM claims GROUP BY denial_reason ORDER BY COUNT(*) DESC LIMIT 1",[(None,)]),
 ("Which providers survive `GROUP BY provider HAVING SUM(billed) > 2500`?",["City Hospital","City Hospital, Care Clinic","All three","None"],"A",
  "City Hospital 10000, Care Clinic 2000, Lab One 600.",
  "SELECT provider FROM claims GROUP BY provider HAVING SUM(billed)>2500",[('City Hospital',)]),
 ("`SELECT AVG(paid) FROM claims` returns:",["866.67","1040","5200","1300"],"B",
  "5200 ÷ 5. The Pending claim's NULL is skipped, but the zero-paid denials are counted.",
  "SELECT AVG(paid) FROM claims",[(1040.0,)]),
 ("Overall denial rate: `100.0 * SUM(CASE WHEN status='Denied' THEN 1 ELSE 0 END) / COUNT(*)`",["33.3","50.0","60.0","66.7"],"B",
  "3 denied out of 6 claims. SUM(CASE…) is the standard way to count a condition.",
  "SELECT ROUND(100.0*SUM(CASE WHEN status='Denied' THEN 1 ELSE 0 END)/COUNT(*),1) FROM claims",[(50.0,)]),
 ("Why write `100.0 *` instead of `100 *` in a rate?",["Faster","Avoids integer division returning 0","Rounds the result","Required by GROUP BY"],"B",
  "In many databases 3/6 with whole numbers is 0. A decimal forces decimal maths.",None,None),
]),
("Day 5 · Retail suppliers · INNER and LEFT JOIN", "items, suppliers", [
 ("How many rows: `items JOIN suppliers ON items.supplier = suppliers.supplier_id`?",["4","5","6","24"],"B",
  "Soap has no supplier, so INNER JOIN drops it.",
  "SELECT COUNT(*) FROM items i JOIN suppliers s ON i.supplier=s.supplier_id",[(5,)]),
 ("How many rows: `suppliers LEFT JOIN items ON ...`?",["4","5","6","7"],"C",
  "S1→2 items, S2→1, S3→2, and HomeCo is kept once with NULLs.",
  "SELECT COUNT(*) FROM suppliers s LEFT JOIN items i ON i.supplier=s.supplier_id",[(6,)]),
 ("Which supplier is returned by `suppliers LEFT JOIN items ... WHERE items.item_id IS NULL`?",["Agro Foods","PureOil","HomeCo","Fabrico"],"C",
  "The anti-join pattern: suppliers with zero items listed.",
  "SELECT s.sname FROM suppliers s LEFT JOIN items i ON i.supplier=s.supplier_id WHERE i.item_id IS NULL",[('HomeCo',)]),
 ("`items LEFT JOIN suppliers ON ... WHERE suppliers.country='IN'` returns how many rows?",["3","5","6","4"],"A",
  "Filtering the right table in WHERE throws away the NULL rows, so your LEFT JOIN behaves like an INNER JOIN. Put the condition in ON to keep all 6 items.",
  "SELECT COUNT(*) FROM items i LEFT JOIN suppliers s ON i.supplier=s.supplier_id WHERE s.country='IN'",[(3,)]),
 ("How many rows: `items CROSS JOIN suppliers`?",["6","10","24","4"],"C","Every item with every supplier: 6 × 4.",
  "SELECT COUNT(*) FROM items CROSS JOIN suppliers",[(24,)]),
]),
("Day 6 · Agile delivery · Self joins and metrics", "people, stories, epics", [
 ("Using `people e LEFT JOIN people m ON e.manager_id = m.id`, who is Vik's manager?",["Priya","Arun","Neha","NULL"],"B",
  "A self join reads one table twice: once as employees, once as managers.",
  "SELECT m.name FROM people e LEFT JOIN people m ON e.manager_id=m.id WHERE e.name='Vik'",[('Arun',)]),
 ("How many direct reports does Priya have?",["1","2","3","0"],"B","Arun and Neha. Vik reports to Arun, not Priya.",
  "SELECT COUNT(*) FROM people e JOIN people m ON e.manager_id=m.id WHERE m.name='Priya'",[(2,)]),
 ("Team Beta's predictability, `100.0 * SUM(done points) / SUM(all points)`:",["50.0","70.0","100.0","66.7"],"B",
  "Beta finished 7 of its 10 points.",
  "SELECT ROUND(100.0*SUM(CASE WHEN status='Done' THEN points ELSE 0 END)/SUM(points),1) FROM stories WHERE team='Beta'",[(70.0,)]),
 ("Total points on epics owned by Neha (`stories JOIN epics JOIN people`)?",["8","13","16","19"],"C",
  "Neha owns Policy Docs (8 + 5) and Claims API (3).",
  "SELECT SUM(s.points) FROM stories s JOIN epics e ON s.epic_id=e.epic_id JOIN people p ON e.owner_id=p.id WHERE p.name='Neha'",[(16,)]),
 ("Which epic has no Done stories? (`NOT EXISTS`)",["Onboarding AI","Policy Docs","Claims API","None"],"C",
  "Claims API has only a carried-over story.",
  "SELECT title FROM epics e WHERE NOT EXISTS (SELECT 1 FROM stories s WHERE s.epic_id=e.epic_id AND s.status='Done')",[('Claims API',)]),
]),
("Day 7 · Banking · Subqueries", "accounts, watchlist", [
 ("How many accounts: `WHERE balance > (SELECT AVG(balance) FROM accounts)`?",["1","2","3","4"],"B",
  "Average is 92,000. ACC2 and ACC4 are above it.",
  "SELECT COUNT(*) FROM accounts WHERE balance>(SELECT AVG(balance) FROM accounts)",[(2,)]),
 ("How many accounts sit above their own branch average (correlated subquery)?",["1","2","3","4"],"B",
  "ACC1 beats Chennai's 30,000 and ACC2 beats Mumbai's 140,000. ACC4 equals Delhi's average, which isn't above it.",
  "SELECT COUNT(*) FROM accounts a WHERE balance>(SELECT AVG(balance) FROM accounts b WHERE b.branch=a.branch)",[(2,)]),
 ("How many accounts appear in `(SELECT account FROM transactions WHERE type='CREDIT')`?",["1","2","3","5"],"B","ACC1 and ACC2.",
  "SELECT COUNT(*) FROM accounts WHERE acc IN (SELECT account FROM transactions WHERE type='CREDIT')",[(2,)]),
 ("The watchlist holds 'ACC3' and a NULL. `SELECT COUNT(*) FROM accounts WHERE acc NOT IN (SELECT acc FROM watchlist)` returns:",["4","5","0","1"],"C",
  "One NULL in a NOT IN list makes every comparison unknown, so the result is zero. A real production bug.",
  "SELECT COUNT(*) FROM accounts WHERE acc NOT IN (SELECT acc FROM watchlist)",[(0,)]),
 ("Same question with `NOT EXISTS (SELECT 1 FROM watchlist w WHERE w.acc = accounts.acc)`:",["4","5","0","1"],"A",
  "NOT EXISTS ignores the NULL safely. Prefer it over NOT IN.",
  "SELECT COUNT(*) FROM accounts a WHERE NOT EXISTS (SELECT 1 FROM watchlist w WHERE w.acc=a.acc)",[(4,)]),
]),
("Day 8 · Product analytics · Funnels with CTEs", "events", [
 ("`SELECT COUNT(DISTINCT user_id) FROM events WHERE event='kyc'`",["2","3","4","5"],"C",
  "Includes user 5, who did KYC without signing up. Raw counts can overstate a funnel step.",
  "SELECT COUNT(DISTINCT user_id) FROM events WHERE event='kyc'",[(4,)]),
 ("`WITH signed AS (SELECT DISTINCT user_id FROM events WHERE event='signup')` + users from `signed` who did KYC:",["2","3","4","5"],"B",
  "Users 1, 2 and 4. The CTE keeps the funnel honest.",
  "WITH signed AS (SELECT DISTINCT user_id FROM events WHERE event='signup') SELECT COUNT(DISTINCT e.user_id) FROM events e JOIN signed s ON e.user_id=s.user_id WHERE e.event='kyc'",[(3,)]),
 ("Signup → activate conversion?",["25%","40%","50%","75%"],"C","2 of 4 signed-up users activated.",
  "SELECT 100.0*COUNT(DISTINCT CASE WHEN event='activate' THEN user_id END)/COUNT(DISTINCT CASE WHEN event='signup' THEN user_id END) FROM events",[(50.0,)]),
 ("How many users signed up and activated on the same day?",["0","1","2","3"],"B","Only user 4, on day 2.",
  "SELECT COUNT(*) FROM events a JOIN events b ON a.user_id=b.user_id AND a.day=b.day WHERE a.event='signup' AND b.event='activate'",[(1,)]),
 ("How long does a CTE exist?",["For the session","Until dropped","Only for the one statement it belongs to","Forever, like a view"],"C",
  "A CTE is a named subquery for a single statement. For reuse across queries, create a view.",None,None),
]),
("Day 9 · Retail stores · Ranking with window functions", "store_sales", [
 ("Using `ROW_NUMBER() OVER (PARTITION BY store ORDER BY revenue DESC)`, how many rows have number 1?",["1","3","7","2"],"B",
  "One per store: Chennai, Mumbai and Delhi.",
  "SELECT COUNT(*) FROM (SELECT ROW_NUMBER() OVER (PARTITION BY store ORDER BY revenue DESC) rn FROM store_sales) WHERE rn=1",[(3,)]),
 ("Chennai months have revenue 120, 120 and 100. What do RANK and DENSE_RANK give the 100 month?",["3 and 3","2 and 2","3 and 2","2 and 3"],"C",
  "RANK leaves a gap after a tie; DENSE_RANK doesn't.",
  "SELECT RANK() OVER (ORDER BY revenue DESC), DENSE_RANK() OVER (ORDER BY revenue DESC) FROM store_sales WHERE store='Chennai' ORDER BY revenue LIMIT 1",[(3,2)]),
 ("Which store ranks #1 by total revenue?",["Chennai","Mumbai","Delhi","Tie"],"B","Mumbai 600, Chennai 340, Delhi 90.",
  "SELECT store FROM store_sales GROUP BY store ORDER BY SUM(revenue) DESC LIMIT 1",[('Mumbai',)]),
 ("How many rows does `SELECT store, SUM(revenue) OVER (PARTITION BY store) FROM store_sales` return?",["3","7","1","6"],"B",
  "A window function adds a column without collapsing rows. GROUP BY would give 3.",
  "SELECT COUNT(*) FROM (SELECT store, SUM(revenue) OVER (PARTITION BY store) FROM store_sales)",[(7,)]),
 ("Mumbai month 3's share of Mumbai revenue: `100.0 * revenue / SUM(revenue) OVER (PARTITION BY store)`",["25.0","41.7","33.3","50.0"],"B","250 ÷ 600.",
  "SELECT ROUND(100.0*revenue/SUM(revenue) OVER (PARTITION BY store),1) FROM store_sales WHERE store='Mumbai' ORDER BY month DESC LIMIT 1",[(41.7,)]),
]),
("Day 10 · Banking ledger · Running totals, LAG, LEAD", "ledger", [
 ("ACC1's running balance after day 3: `SUM(amount) OVER (PARTITION BY acc ORDER BY d)`",["5000","3000","2000","6000"],"C","5000 − 2000 − 1000.",
  "SELECT bal FROM (SELECT d, SUM(amount) OVER (PARTITION BY acc ORDER BY d) bal FROM ledger WHERE acc='ACC1') WHERE d=3",[(2000,)]),
 ("`LAG(amount) OVER (PARTITION BY acc ORDER BY d)` for ACC1 on day 1:",["0","5000","NULL","Error"],"C","Day 1 has no previous row, so the result is NULL.",
  "SELECT LAG(amount) OVER (PARTITION BY acc ORDER BY d) FROM ledger WHERE acc='ACC1' ORDER BY d LIMIT 1",[(None,)]),
 ("ACC1's day-4 change: `amount - LAG(amount) OVER (...)`",["4000","5000","3000","-5000"],"B","4000 − (−1000).",
  "SELECT x FROM (SELECT d, amount-LAG(amount) OVER (PARTITION BY acc ORDER BY d) x FROM ledger WHERE acc='ACC1') WHERE d=4",[(5000,)]),
 ("`LEAD(d) OVER (PARTITION BY acc ORDER BY d)` for ACC2's day-1 row:",["2","3","NULL","1"],"B","ACC2's next entry is on day 3.",
  "SELECT LEAD(d) OVER (PARTITION BY acc ORDER BY d) FROM ledger WHERE acc='ACC2' ORDER BY d LIMIT 1",[(3,)]),
 ("ACC1's 3-entry moving sum on day 4: `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`",["1000","6000","4000","-3000"],"A","−2000 − 1000 + 4000.",
  "SELECT x FROM (SELECT d, SUM(amount) OVER (PARTITION BY acc ORDER BY d ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) x FROM ledger WHERE acc='ACC1') WHERE d=4",[(1000,)]),
]),
("Day 11 · Insurance renewals · Messy text and dates", "renewals", [
 ("The state values are 'MA', 'MA ' and 'ma'. How many groups does `GROUP BY state` produce for them?",["1","2","3","Error"],"C",
  "Trailing spaces and case make them different values. `GROUP BY UPPER(TRIM(state))` gives 1.",
  "SELECT COUNT(DISTINCT state) FROM renewals WHERE UPPER(TRIM(state))='MA'",[(3,)]),
 ("`SUBSTR('LIF-2031', 1, 3)` returns:",["LIF","LIF-","IF-","2031"],"A","Start at position 1 and take 3 characters. Handy for product codes.",
  "SELECT SUBSTR('LIF-2031',1,3)",[('LIF',)]),
 ("Dates stored as text 'DD-MM-YYYY': which comes first in `ORDER BY due`?",["20-12-2026","05-01-2027","10-02-2027","Error"],"B",
  "Text sorts character by character, so '05' beats '20'. That's wrong, because Dec 2026 is earliest. Store dates as DATE or as ISO 'YYYY-MM-DD'.",
  "SELECT due FROM text_dates ORDER BY due LIMIT 1",[('05-01-2027',)]),
 ("`WHERE due BETWEEN '2026-12-01' AND '2026-12-31'`: how many December renewals are counted?",["1","2","3","4"],"B",
  "'2026-12-31 10:00' is later than '2026-12-31', so it's missed. Use `due < '2027-01-01'` for timestamps.",
  "SELECT COUNT(*) FROM renewals WHERE due BETWEEN '2026-12-01' AND '2026-12-31'",[(2,)]),
 ("What does `NULLIF(0, 0)` return, and why is it used in `claims / NULLIF(policies, 0)`?",["0, to round","NULL, to avoid divide-by-zero errors","1, as a default","Error"],"B",
  "NULLIF turns 0 into NULL, and dividing by NULL gives NULL instead of crashing.",
  "SELECT NULLIF(0,0)",[(None,)]),
]),
("Day 12 · Release planning · Set operations and query order", "pi1, pi2", [
 ("PI-1 features: Login, Docs, Search. PI-2: Docs, Search, Chat, Search. How many rows from `UNION`?",["4","5","7","3"],"A","UNION removes duplicates: Login, Docs, Search, Chat.",
  "SELECT COUNT(*) FROM (SELECT feature FROM pi1 UNION SELECT feature FROM pi2)",[(4,)]),
 ("Same tables with `UNION ALL`?",["4","5","7","6"],"C","UNION ALL keeps everything: 3 + 4. It's also faster, because it skips de-duplication.",
  "SELECT COUNT(*) FROM (SELECT feature FROM pi1 UNION ALL SELECT feature FROM pi2)",[(7,)]),
 ("`pi1 INTERSECT pi2` returns how many features?",["1","2","3","4"],"B","Docs and Search are in both. These are features carried across PIs.",
  "SELECT COUNT(*) FROM (SELECT feature FROM pi1 INTERSECT SELECT feature FROM pi2)",[(2,)]),
 ("`pi1 EXCEPT pi2` returns:",["Chat","Login","Docs, Search","Nothing"],"B","In PI-1 but dropped from PI-2. (Oracle calls this MINUS.)",
  "SELECT feature FROM pi1 EXCEPT SELECT feature FROM pi2",[('Login',)]),
 ("In what order does SQL logically run a query?",["SELECT → FROM → WHERE → GROUP BY","FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY","FROM → SELECT → WHERE → ORDER BY","WHERE → FROM → SELECT → HAVING"],"B",
  "This explains why a SELECT alias can't be used in WHERE but can be used in ORDER BY.",None,None),
]),
("Day 13 · Investing · A personal stock portfolio", "portfolio, prices", [
 ("Realised profit on sold positions: `SUM((sell_price - buy_price) * shares) WHERE sell_price IS NOT NULL`",["240","400","160","560"],"B",
  "BLK: 120 × 2 = 240, plus MS: 20 × 8 = 160.",
  "SELECT SUM((sell_price-buy_price)*shares) FROM portfolio WHERE sell_price IS NOT NULL",[(400,)]),
 ("Market value of open positions: `portfolio JOIN prices`, `SUM(shares * close) WHERE sell_price IS NULL`",["5660","6540","7420","6000"],"B",
  "JPM 2100 + GS 2000 + V 1560 + BLK 880.",
  "SELECT SUM(p.shares*c.close) FROM portfolio p JOIN prices c ON p.ticker=c.ticker WHERE p.sell_price IS NULL",[(6540,)]),
 ("Which ticker is returned by `GROUP BY ticker HAVING COUNT(*) > 1`?",["JPM","BLK","GS","None"],"B","BLK was bought twice, at different prices.",
  "SELECT ticker FROM portfolio GROUP BY ticker HAVING COUNT(*)>1",[('BLK',)]),
 ("BLK's weighted average buy price: `SUM(shares * buy_price) / SUM(shares)`",["800.00","766.67","700.00","900.00"],"B",
  "(2 × 700 + 1 × 900) ÷ 3. Plain AVG(buy_price) gives 800 and ignores position size, a common reporting mistake.",
  "SELECT ROUND(1.0*SUM(shares*buy_price)/SUM(shares),2) FROM portfolio WHERE ticker='BLK'",[(766.67,)]),
 ("JPM unrealised gain: `100.0 * (close - buy_price) / buy_price`",["60.0","40.0","28.6","210.0"],"B","(210 − 150) ÷ 150.",
  "SELECT ROUND(100.0*(c.close-p.buy_price)/p.buy_price,1) FROM portfolio p JOIN prices c ON p.ticker=c.ticker WHERE p.ticker='JPM'",[(40.0,)]),
]),
("Day 14 · Career moves · A job-application tracker", "applications", [
 ("How many applications are at stage 'Interview'?",["1","2","3","4"],"B","BlackRock and BCG.",
  "SELECT COUNT(*) FROM applications WHERE stage='Interview'",[(2,)]),
 ("Which role holds the highest offer? (`ORDER BY offer_eur DESC LIMIT 1`)",["JPMorgan, Release Train Engineer","JPMorgan, Program Manager","BlackRock, Program Manager","NULL row"],"B",
  "105,000 beats 95,000. Careful: in some databases (PostgreSQL, Oracle) NULLs sort first in DESC, so add `WHERE offer_eur IS NOT NULL`.",
  "SELECT company, role FROM applications WHERE offer_eur IS NOT NULL ORDER BY offer_eur DESC LIMIT 1",[('JPMorgan','Program Manager')]),
 ("`SELECT COUNT(DISTINCT company) FROM applications`",["4","5","6","3"],"B","JPMorgan appears twice.",
  "SELECT COUNT(DISTINCT company) FROM applications",[(5,)]),
 ("Offer rate: `100.0 * SUM(CASE WHEN stage='Offer' THEN 1 ELSE 0 END) / COUNT(*)`",["16.7","33.3","40.0","50.0"],"B","2 offers from 6 applications.",
  "SELECT ROUND(100.0*SUM(CASE WHEN stage='Offer' THEN 1 ELSE 0 END)/COUNT(*),1) FROM applications",[(33.3,)]),
 ("Keeping only the latest application per company (`ROW_NUMBER() OVER (PARTITION BY company ORDER BY applied DESC) = 1`) leaves how many rows?",["4","5","6","2"],"B",
  "One row per company. For JPMorgan, the 22 Oct Program Manager application wins.",
  "SELECT COUNT(*) FROM (SELECT ROW_NUMBER() OVER (PARTITION BY company ORDER BY applied DESC) rn FROM applications) WHERE rn=1",[(5,)]),
]),
]

errors = 0
out = ["# Daily Data Drill: SQL (14 days, 70 questions)\n",
       "Original questions using invented data from banking, investing, retail, insurance, claims, product delivery and job hunting. ",
       "Company names and tickers are used as labels only; all figures are made up for practice. ",
       "Every answer with a query was checked by running it (SQLite 3.53). Where databases differ, the explanation says so.\n"]
for title, tables, qs in DAYS:
    out.append(f"\n---\n\n## {title}\n\n*Tables: {tables}*\n")
    for i,(qq,opts,ans,expl,sql,exp) in enumerate(qs,1):
        if sql:
            got = q(sql)
            if got != exp:
                errors += 1; print("MISMATCH", title, i, got, exp, file=sys.stderr)
        out.append(f"\n**Q{i}.** {qq}  \n" + "  ".join(f"{'ABCD'[k]}) {o}" for k,o in enumerate(opts)) +
                   f"  \n**Answer: {ans}.** {expl}\n")

# table appendix
out.append("\n---\n\n## Sample tables\n")
for t in ["policies","transactions","items","claims","suppliers","people","stories","epics","accounts","watchlist","events","store_sales","ledger","renewals","portfolio","prices","applications","pi1","pi2"]:
    cols=[d[1] for d in db.execute(f"PRAGMA table_info({t})")]
    rows=q(f"SELECT * FROM {t}")
    out.append(f"\n**{t}**\n\n| " + " | ".join(cols) + " |\n|" + "---|"*len(cols) + "\n" +
               "\n".join("| " + " | ".join("NULL" if v is None else str(v) for v in r) + " |" for r in rows) + "\n")
open(sys.argv[1],"w").write("".join(out))
print("errors:", errors)

# ---- exports: site JSON + LinkedIn kit ----
import json, datetime, re
if len(sys.argv) > 3:
    START = datetime.date(2026, 11, 3)
    SITE = "https://madhanirulandi.com/drill/"
    tbls = {}
    def tdata(t):
        if t not in tbls:
            cols=[d[1] for d in db.execute(f"PRAGMA table_info({t})")]
            tbls[t]={"cols":cols,"rows":[["NULL" if v is None else v for v in r] for r in q(f"SELECT * FROM {t}")]}
        return t
    days=[]
    kit=["# Daily Data Drill: LinkedIn kit (SQL)\n\nOne native poll per day. Poll limits: question ≤140 characters, 2–4 options, each ≤30 characters. ",
         "Put the link in the first comment, not the post body. Reveal yesterday's answer in a comment before posting today's.\n"]
    for n,(title,tables,qs) in enumerate(DAYS,1):
        date = START + datetime.timedelta(days=n-1)
        tl=[tdata(t.strip()) for t in tables.split(",")]
        days.append({"n":n,"title":title,"date":date.isoformat(),"tables":tl,
            "questions":[{"q":qq,"options":opts,"answer":"ABCD".index(ans),"why":expl} for qq,opts,ans,expl,_,_ in qs]})
        # poll pick: first question whose options all fit 30 chars
        pick=next((i for i,x in enumerate(qs) if max(len(o) for o in x[1])<=30), None)
        qq,opts,ans,expl,_,_=qs[pick]
        pollq="Which option is correct? Answer before you look it up."
        assert len(pollq)<=140 and all(len(o)<=30 for o in opts)
        sample=tl[0]; td=tbls[sample]
        tbl="\n".join([" | ".join(map(str,td["cols"]))]+[" | ".join(map(str,r)) for r in td["rows"][:6]])
        plain=re.sub(r"`([^`]*)`",r"\1",qq)
        kit.append(f"\n---\n\n## Day {n} · {date:%a %d %b} · {title.split('·',1)[1].strip()}\n\n**Post text**\n\n```\n"
            f"Daily Data Drill #{n}: {title.split('·')[1].strip()} 🧠\n\n{plain}\n\nTable: {sample}\n{tbl}\n\n"
            f"Vote below. Answer and explanation tomorrow.\n4 more questions on today's topic: link in the first comment.\n\n"
            f"#SQL #DataAnalytics #LearningInPublic #DailyDataDrill\n```\n\n"
            f"**Poll question:** {pollq}\n\n**Poll options:** " + " · ".join(f"{'ABCD'[k]}) {o}" for k,o in enumerate(opts)) +
            f"\n\n**Poll duration:** 1 day\n\n**First comment:** All 5 questions with instant answers: {SITE}?utm_source=linkedin#day-{n}\n\n"
            f"**Answer comment (post next day):** ✅ Answer: {ans}) {opts['ABCD'.index(ans)]}. {expl}\n")
    json.dump({"start":START.isoformat(),"days":days,"tables":tbls}, open(sys.argv[2],"w"), ensure_ascii=False, separators=(",",":"))
    open(sys.argv[3],"w").write("".join(kit))
    print("exported", len(days), "days")
