# RDBMS vs NoSQL — Comparative Analysis

## Overview

This document compares relational databases (RDBMS) and NoSQL databases in the context of the e-commerce product catalog built in this assignment, and provides a recommendation for a healthcare startup's patient management system.

---

## Key Differences

| Dimension         | RDBMS (MySQL)                          | NoSQL (MongoDB)                          |
|-------------------|----------------------------------------|------------------------------------------|
| Data Model        | Fixed schema, tables & rows            | Flexible schema, documents/collections   |
| Consistency Model | ACID                                   | BASE (tunable consistency)               |
| Scaling           | Vertical (scale-up)                    | Horizontal (scale-out / sharding)        |
| Query Language    | SQL — rich joins, aggregations         | MQL — document-oriented, pipeline-based  |
| Relationships     | Foreign keys, JOINs                    | Embedded documents or manual references  |
| CAP Positioning   | CP (Consistency + Partition Tolerance) | AP or CP depending on configuration      |

---

## Database Recommendation

### Scenario: Healthcare Patient Management System

**Recommendation: MySQL (RDBMS)**

For a core patient management system, MySQL is the stronger choice, and the reasoning centers on data integrity and regulatory compliance.

Patient data is inherently relational — a patient links to appointments, appointments link to doctors, doctors link to departments, prescriptions link to both patients and drugs, and billing links to all of them. These are well-defined, stable relationships that SQL handles natively through foreign keys and JOINs, whereas MongoDB would require either denormalization (risking data duplication and update anomalies) or manual reference management.

More critically, healthcare systems are governed by strict regulations such as HIPAA, HL7, and in India, the DISHA framework. These mandate **data accuracy and auditability** — properties that ACID guarantees directly. MySQL's atomicity ensures that a prescription write either fully succeeds or fully rolls back; there is no scenario where a partial record enters the database. Isolation prevents concurrent reads of a patient record mid-update, which in a clinical context could mean a nurse reading an outdated drug dosage. No healthcare organization can tolerate the eventual consistency trade-off of BASE, where a "stale read" could influence a medical decision.

From the CAP theorem perspective, patient systems must prioritize **Consistency over Availability**. If two hospital nodes disagree on a patient's allergy list during a network partition, the system must halt and surface the conflict rather than silently serve divergent data.

---

### Would the Answer Change for a Fraud Detection Module?

**Yes — partially. A hybrid architecture becomes appropriate.**

Fraud detection workloads are fundamentally different: they require analyzing large volumes of behavioral events (logins, billing transactions, access patterns) at high speed, with flexible and evolving feature schemas. These patterns align well with MongoDB's strengths — schemaless event ingestion, horizontal scalability, and fast document reads for pattern matching.

Therefore, the recommended architecture is:
- **MySQL** — patient records, appointments, prescriptions, billing (ACID, relational integrity)
- **MongoDB** — fraud/audit event logs, behavioral telemetry, anomaly detection pipelines (high throughput, flexible schema)

This polyglot persistence approach uses each database where it excels, rather than forcing one system to accommodate both fundamentally different workloads.

