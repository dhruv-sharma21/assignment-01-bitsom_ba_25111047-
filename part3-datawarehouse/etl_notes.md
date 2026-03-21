## ETL Decisions

## Decision 1 — Categorical Normalization
Problem: The raw data contained inconsistent product categories, such as "electronics" (lowercase) vs "Electronics" (capitalized) and "Grocery" vs "Groceries".
Resolution: During the ETL process, I converted all category strings to sentence case and consolidated variations like "Grocery" into a single standard "Groceries" label. This ensures that analytical grouping by category accurately reflects all relevant products.

## Decision 2 — Handling Missing Location Data
Problem: Approximately 6% of the records had NULL values in the store_city column, which would break reports analyzing performance by region.
Resolution: Since the store_name (e.g., 'Chennai Anna') was always provided and unique to a city, I built a lookup map from non-null records to fill in the missing cities. This restored data integrity for geographical dimensions.

## Decision 3 — Date Format Standardization
Problem: The raw date field was a mix of different string formats, including DD/MM/YYYY, DD-MM-YYYY, and YYYY-MM-DD.
Resolution: I used a robust date-parsing algorithm with dayfirst=True logic to normalize all entries into a single ISO-standard DATE type. This allowed for the generation of a consistent date_key (YYYYMMDD) used to link the fact table to the date dimension for time-series analysis.