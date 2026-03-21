# Part 6 — Capstone Design Justification

---

## Storage Systems

Each of the four goals demands a different data access pattern, which is why the design uses purpose-built storage systems rather than a single general-purpose database.

**Goal 1 — Readmission Risk Prediction** uses **Snowflake (cloud data warehouse)**. Historical treatment records, discharge summaries, lab results, and demographic data are loaded nightly via Spark ETL into a star-schema dimensional model. Snowflake's columnar, MPP (massively parallel processing) architecture lets ML feature pipelines scan hundreds of millions of rows cheaply and quickly. dbt models produce clean, versioned feature tables that feed the XGBoost/LightGBM training and daily batch scoring jobs tracked in MLflow.

**Goal 2 — Plain-English Patient Queries** uses a two-layer retrieval stack: **PostgreSQL** for structured, transactional patient records (diagnoses, admissions, medications) and **pgvector** for semantic search over embedded clinical notes. When a doctor asks "Has this patient had a cardiac event?", the NLP engine translates the question into a SQL predicate (routed to Postgres) or a cosine-similarity vector search (routed to pgvector), then merges and cites the results. PostgreSQL's row-level security also enforces per-doctor access controls.

**Goal 3 — Monthly Management Reports** is served entirely from **Snowflake**, the same warehouse used for Goal 1. Pre-aggregated dbt models produce monthly snapshots of bed occupancy rates, department-wise cost roll-ups, and length-of-stay distributions. Separating reporting from the OLTP layer means management queries never contend with live patient-care transactions.

**Goal 4 — Real-Time ICU Vitals** uses **TimescaleDB** (or InfluxDB), a time-series database optimised for high-frequency, append-heavy workloads. ICU devices publish metrics via MQTT/TCP into Apache Kafka topics; Apache Flink consumes these streams, applies windowed anomaly-detection rules, and writes time-stamped readings to TimescaleDB hypertables. Automated retention policies compress or drop data beyond 90 days, controlling storage growth.

Unstructured data — DICOM images, scanned documents, raw audit logs — is stored in an **S3-compatible object lake** in Parquet format, available for future ML workloads without burdening transactional systems.

---

## OLTP vs OLAP Boundary

The **OLTP boundary** encompasses everything needed to support live patient care: the FHIR/REST API Gateway, PostgreSQL (patient records and appointments), TimescaleDB (real-time vitals), and Kafka (the live event bus). These systems are optimised for low-latency reads and writes, strong consistency, and concurrent access by clinical staff.

The **OLAP boundary** begins at the nightly Spark ETL job that extracts, transforms, and loads data from PostgreSQL and the data lake into **Snowflake**. From that point onward — feature engineering, ML training, report aggregation — all workloads run against immutable snapshots in the warehouse and are isolated from production systems. The ETL acts as the explicit crossing point: it translates row-oriented, normalised OLTP records into denormalised, columnar OLAP structures designed for analytical scan performance. Flink's stream processor sits in a hybrid zone — it consumes live Kafka events (OLTP territory) but also writes summarised window aggregates into Snowflake (OLAP territory) for trend reporting.

---

## Trade-offs

**Key trade-off: Data freshness vs. system complexity.** Using a strict batch ETL pipeline to feed the data warehouse means the ML readmission model scores patients on data that is up to 24 hours stale. For a clinical setting, a deteriorating patient admitted at 9 PM may not receive an updated risk score until the following morning's batch run.

**Mitigation strategy:** Introduce a **Lambda Architecture** pattern for Goal 1: a fast path where high-priority trigger events (new admission, ICU transfer, critical lab result) are published to Kafka and processed by Flink to update a "hot" risk score in a low-latency store (e.g., Redis), while the existing nightly batch continues to handle full model retraining and historical scoring. This preserves the simplicity and cost-efficiency of the batch layer for the majority of cases while ensuring clinically time-sensitive patients receive near-real-time risk updates. The trade-off introduced by this mitigation — two scoring code paths to maintain — is managed by a shared MLflow model registry that serves identical model artefacts to both the batch and streaming inference endpoints.
