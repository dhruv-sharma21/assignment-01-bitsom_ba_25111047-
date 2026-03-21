# Normalization Analysis — orders_flat.csv

---

## Anomaly Analysis

The flat file schema stores every attribute of customers, products, sales representatives, and orders
in a single table. This design introduces three classic relational anomalies.

---

### Insert Anomaly

**Definition:** A fact cannot be recorded without the existence of another, unrelated fact.

**Example from the dataset:**

A new product — say, a "Whiteboard" priced at ₹4,500 — cannot be added to the system until at least
one order for that product exists. The product has no independent row; its attributes
(`product_id`, `product_name`, `category`, `unit_price`) only appear as part of an order row.

Similarly, a new sales representative cannot be on-boarded into the database until they handle their
first order. There is no `sales_reps` table; SR01/SR02/SR03 exist only because they appear in order rows.

**Specific evidence:** No row exists in the CSV for a product that has zero orders (e.g., no hypothetical
P009). If such a product existed, it would be invisible to the database entirely.

---

### Update Anomaly

**Definition:** Changing one real-world fact requires updating multiple rows, and a partial update
leaves the database in an inconsistent state.

**Example from the dataset:**

The `unit_price` of **P001 (Laptop)** is ₹55,000, and this value appears in every row where a Laptop
was ordered. If the price changes to ₹52,000, every one of those rows must be updated individually.

Concretely, the Laptop (P001) appears in rows including:

| order_id | product_id | unit_price |
|----------|-----------|------------|
| ORD1114  | P001      | 55000      |
| ORD1095  | P001      | 55000      |
| ORD1098  | P001      | 55000      |
| ORD1131  | P001      | 55000      |
| ORD1025  | P001      | 55000      |
| ORD1054  | P001      | 55000      |
| … (many more) | … | … |

If even one row is missed during an update, different rows will disagree on the price of the same
product — a direct inconsistency with no way to determine which value is correct.

The same anomaly applies to `sales_rep_name` and `office_address`. SR01's address appears as both
`"Mumbai HQ, Nariman Point, Mumbai - 400021"` (e.g., ORD1114) and the abbreviated
`"Mumbai HQ, Nariman Pt, Mumbai - 400021"` (e.g., ORD1180, ORD1174, ORD1176) — a real-world
inconsistency that already exists in this dataset, caused by the absence of a single authoritative
source of truth for the sales rep's office address.

---

### Delete Anomaly

**Definition:** Deleting one fact unintentionally destroys another, unrelated fact.

**Example from the dataset:**

**Customer C005 (Vikram Singh, Mumbai)** has placed multiple orders. Suppose all of Vikram's orders
are deleted — perhaps he requests account deletion. Every row referencing C005 would be removed:

| order_id | customer_id | customer_name  |
|----------|------------|----------------|
| ORD1075  | C005       | Vikram Singh   |
| ORD1137  | C005       | Vikram Singh   |
| ORD1022  | C005       | Vikram Singh   |
| ORD1144  | C005       | Vikram Singh   |


Once all of these rows are gone, all knowledge that **SR03 (Ravi Kumar)** handled Vikram is also lost,
along with the fact that **P003 (Desk Chair, ₹8,500)** was ever a product the business sold to
Mumbai customers — if Vikram happened to be the only one who ordered a particular product, that
product disappears from the database entirely.

---

## Normalization Justification

Your manager's argument — that a single flat table is simpler and normalization is over-engineering —
sounds intuitive but collapses under the weight of real-world data maintenance. The `orders_flat.csv`
dataset itself proves this point concretely.

Consider the **Update Anomaly** already present in the raw data: SR01 (Deepak Joshi) has his office
address recorded as both `"Mumbai HQ, Nariman Point, Mumbai - 400021"` and the abbreviated
`"Mumbai HQ, Nariman Pt, Mumbai - 400021"` across different rows. This is not a hypothetical risk —
the inconsistency is already there, in a dataset of fewer than 200 rows. In a production system
handling thousands of orders per day, such drift becomes undetectable and uncorrectable without
auditing every single row. A normalized `sales_reps` table would store that address exactly once;
updating it takes one `UPDATE` statement and the entire database stays consistent.

The **Insert Anomaly** is equally damaging to business operations. If the company introduces a new
product — say, a printer — it cannot record the product's name, category, or price until a customer
actually orders it. This means no price list can be maintained, no inventory can reference it, and no
sales rep can quote it, all because the "simple" design conflates product catalog management with
order management.

The **Delete Anomaly** poses a serious compliance risk. Under data privacy regulations (such as
India's DPDP Act), a customer may request deletion of their personal data. In the flat table,
honoring that request deletes not just the customer's PII but also order history, product sales
records, and sales performance data — because they are all entangled in the same rows.

Normalization is not over-engineering; it is the minimal structure required to make the database
represent reality faithfully. The flat table is simple to create once, but it becomes progressively
more expensive to maintain, correct, and trust. The 3NF schema trades a small upfront design cost
for a system that can be updated, extended, and queried with confidence — which is exactly what the
manager's "simple" table cannot guarantee.
