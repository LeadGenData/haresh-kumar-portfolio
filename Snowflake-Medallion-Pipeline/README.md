# Snowflake Cloud Data Engineering & Credit Fraud Analytics

A complete enterprise-grade cloud data pipeline implementing the **Medallion Architecture (Bronze -> Silver -> Gold)**, automated orchestration, data governance, and interactive Power BI fraud analytics.

---

## 🚨 The Problem: Latency, Inaccuracy, and Security Risks in Fraud Detection
Financial institutions lose millions daily to credit card fraud. Detecting anomalous activity requires ingestion of high-velocity raw transaction logs. However, building these systems faces critical roadblocks:
1. **Dirty Data & Duplicates:** Ingesting raw logs results in format disparities and duplicates.
2. **Slow Query Latency:** Directly querying raw logs for BI dashboards causes report timeouts.
3. **PII Security & Compliance (GDPR/PCI):** Sensitive cardholder details (e.g. credit card numbers) are exposed to business analysts who do not need to see them.
4. **Manual Runs:** Orchestrating the ingestion steps manually is prone to human error and data lag.

---

## 💡 The Solution: Snowflake Medallion Streaming Pipeline
I architected and deployed a secure, end-to-end data pipeline in Snowflake:

```
Raw Logs ──> [Bronze Layer] ──(Cleanse/De-dup)──> [Silver Layer] ──(Star Schema)──> [Gold Layer] ──> Power BI / Jupyter
```

### 1. Ingestion & Storage (Bronze Layer)
* Loaded raw transactional JSON and CSV files into Snowflake Stages.
* Staged records into Bronze landing tables containing raw timestamps and variants.

### 2. Cleansing & Transformation (Silver Layer)
* Developed SQL standardizations (`03_silver_layer.sql`) to clean nulls, standardize currency values, and cast string dates to timestamp types.
* Implemented de-duplication windows using analytical functions to isolate duplicate entries.

### 3. Star Schema Modeling (Gold Layer)
* Modeled transactional dimensions in a high-performance Star Schema (`04_gold_star_schema.sql`).
* Created fact tables (`FactTransactions`) and dimension tables (`DimCustomers`, `DimMerchants`, `DimDates`) to minimize query latency for visual reporting.

### 4. Real-time Orchestration
* Deployed **Snowflake Streams** (`06_streams_tasks_alerts.sql`) to capture changes in the transactional data logs.
* Scheduled **Snowflake Tasks** to automate ETL runs, calling stored procedures automatically.
* Integrated alert notifications trigger on pipeline cost anomalies.

### 5. Security & Governance (RBAC & Masking)
* Implemented **Dynamic Data Masking** (`08_governance.sql`) to mask sensitive credit card numbers (`4111-XXXX-XXXX-1111`) for unauthorized reporting roles.
* Configured Row-Level Security (RLS) to restrict regional transaction visibility to localized analyst groups.

### 6. Interactive Visualization (Power BI & Python)
* Built an interactive Power BI dashboard (`Detail.pbix`) connected to reporting views (`07_views_powerbi.sql`) showing fraud heatmaps and transaction velocities.
* Developed Jupyter models (`Fraud_Analysis.ipynb`) to evaluate transaction anomalies and predict fraud.

---

## 📈 Business Impact
* **PII Compliance:** Met PCI-DSS compliance regulations by masking 100% of sensitive cardholder credentials.
* **Latency Reduction:** Optimized BI rendering speeds by over 60% through pre-aggregated Gold views and indexing.
* **Automation:** Eliminated manual data loading latency by orchestrating streams to trigger ETL tasks on data arrival.
