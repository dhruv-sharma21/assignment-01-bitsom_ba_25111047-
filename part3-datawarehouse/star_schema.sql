-- Dimension Tables
CREATE TABLE dim_date (
    date_key INT PRIMARY KEY,
    full_date DATE,
    month_num INT,
    month_name VARCHAR(20),
    year INT,
    quarter INT
);

CREATE TABLE dim_store (
    store_id INT PRIMARY KEY,
    store_name VARCHAR(100),
    store_city VARCHAR(50)
);

CREATE TABLE dim_product (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100),
    category VARCHAR(50)
);

-- Fact Table
CREATE TABLE fact_sales (
    transaction_id VARCHAR(20) PRIMARY KEY,
    date_key INT,
    store_id INT,
    product_id INT,
    units_sold INT,
    unit_price DECIMAL(10, 2),
    total_revenue DECIMAL(15, 2),
    FOREIGN KEY (date_key) REFERENCES dim_date(date_key),
    FOREIGN KEY (store_id) REFERENCES dim_store(store_id),
    FOREIGN KEY (product_id) REFERENCES dim_product(product_id)
);

-- Seed Data (Cleaned and Standardized)
INSERT INTO dim_store (store_id, store_name, store_city) VALUES
(1, 'Chennai Anna', 'Chennai');

INSERT INTO dim_product (product_id, product_name, category) VALUES
(1, 'Speaker', 'Electronics'),
(2, 'Tablet', 'Electronics'),
(3, 'Phone', 'Electronics');

INSERT INTO dim_date (date_key, full_date, month_num, month_name, year, quarter) VALUES
(20230110, '2023-01-10', 1, 'January', 2023, 1),
(20230502, '2023-05-02', 5, 'May', 2023, 2),
(20230504, '2023-05-04', 5, 'May', 2023, 2),
(20230511, '2023-05-11', 5, 'May', 2023, 2),
(20230608, '2023-06-08', 6, 'June', 2023, 2),
(20230614, '2023-06-14', 6, 'June', 2023, 2),
(20230829, '2023-08-29', 8, 'August', 2023, 3),
(20231104, '2023-11-04', 11, 'November', 2023, 4),
(20231208, '2023-12-08', 12, 'December', 2023, 4),
(20231212, '2023-12-12', 12, 'December', 2023, 4);

INSERT INTO fact_sales (transaction_id, date_key, store_id, product_id, units_sold, unit_price, total_revenue) VALUES
('TXN5000', 20230829, 1, 1, 3, 49262.78, 147788.34),
('TXN5258', 20230504, 1, 1, 10, 49262.78, 492627.80),
('TXN5001', 20231212, 1, 2, 11, 23226.12, 255487.32),
('TXN5038', 20230614, 1, 2, 3, 23226.12, 69678.36),
('TXN5065', 20230608, 1, 2, 13, 23226.12, 301939.56),
('TXN5111', 20230511, 1, 2, 14, 23226.12, 325165.68),
('TXN5123', 20231208, 1, 2, 11, 23226.12, 255487.32),
('TXN5002', 20230502, 1, 3, 20, 48703.39, 974067.80),
('TXN5046', 20231104, 1, 3, 10, 48703.39, 487033.90),
('TXN5061', 20230110, 1, 3, 14, 48703.39, 681847.46);