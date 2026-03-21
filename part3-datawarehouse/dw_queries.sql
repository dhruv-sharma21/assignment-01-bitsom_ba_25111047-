-- Q1: Total sales revenue by product category for each month
SELECT 
    p.category, 
    d.month_name, 
    SUM(f.total_revenue) AS monthly_revenue
FROM fact_sales f
JOIN dim_product p ON f.product_id = p.product_id
JOIN dim_date d ON f.date_key = d.date_key
GROUP BY p.category, d.month_name, d.month_num
ORDER BY d.month_num;

-- Q2: Top 2 performing stores by total revenue
SELECT 
    s.store_name, 
    SUM(f.total_revenue) AS total_revenue
FROM fact_sales f
JOIN dim_store s ON f.store_id = s.store_id
GROUP BY s.store_name
ORDER BY total_revenue DESC
LIMIT 2;

-- Q3: Month-over-month sales trend across all stores
WITH monthly_sales AS (
    SELECT 
        d.year, 
        d.month_num, 
        d.month_name, 
        SUM(f.total_revenue) AS revenue
    FROM fact_sales f
    JOIN dim_date d ON f.date_key = d.date_key
    GROUP BY d.year, d.month_num, d.month_name
)
SELECT 
    year, 
    month_name, 
    revenue AS current_month_revenue,
    LAG(revenue) OVER (ORDER BY year, month_num) AS previous_month_revenue,
    (revenue - LAG(revenue) OVER (ORDER BY year, month_num)) / LAG(revenue) OVER (ORDER BY year, month_num) * 100 AS mom_growth_pct
FROM monthly_sales;