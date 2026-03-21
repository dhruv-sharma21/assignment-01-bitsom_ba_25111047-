# Data Lake Architecture — Analysis & Recommendation

## Architecture Recommendation

### Scenario: Fast-Growing Food Delivery Startup

**Recommendation: Data Lakehouse**

A Data Lakehouse is the right architecture for this startup, and the reasoning comes directly from the diversity of data types they collect.

**Reason 1 — Multi-Modal Data Requires Raw Storage First**
The startup collects four fundamentally different data types: structured payment transactions, semi-structured JSON/text customer reviews, time-series GPS location logs, and unstructured restaurant menu images. A traditional Data Warehouse can only ingest structured, pre-modelled data — it would require discarding or heavily transforming GPS logs and images before storage, losing raw fidelity. A pure Data Lake stores everything as-is, but offers no query or governance layer. A Lakehouse combines both: raw files land in open formats (Parquet, Delta, JSON) on cheap object storage (S3/GCS), while a metadata and transaction layer (Delta Lake or Apache Iceberg) makes them queryable with SQL.

**Reason 2 — ACID Transactions on Streaming Data**
Payment transactions demand exactly-once guarantees and the ability to correct errors via updates or deletes (e.g., fraud reversals). Delta Lake on top of a Data Lakehouse provides ACID transactions over object storage — something neither a pure Data Lake (no consistency guarantees) nor a traditional warehouse (too expensive to ingest high-frequency GPS streams) handles well.

**Reason 3 — Unified Platform for Both ML and BI**
A food delivery startup needs two very different workloads: real-time ML models (ETA prediction from GPS, recommendation from reviews) and business intelligence dashboards (revenue by city, order trends). A Lakehouse serves both — data scientists access raw Parquet files via Spark or Python, while analysts run SQL directly on the same data via Trino or DuckDB, with no data duplication between a lake and a warehouse.

---

*Word count: ~248 words*
