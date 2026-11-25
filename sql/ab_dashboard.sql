-- A/B Testing Dashboard Queries for BigQuery (GA4 Export)
-- Assumes GA4 events exported to BigQuery project:dataset.events_*

-- ──────────────────────────────────────────────
-- 1. Experiment Overview (Assignment Rates)
-- ──────────────────────────────────────────────
CREATE OR REPLACE VIEW `project.dataset.ab_experiment_overview` AS
WITH assignments AS (
  SELECT
    event_date,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') AS experiment_id,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'variant') AS variant,
    COUNT(DISTINCT user_pseudo_id) AS unique_users,
    COUNT(*) AS total_assignments
  FROM `project.dataset.events_*`
  WHERE event_name = 'ab_experiment'
    AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  GROUP BY 1, 2, 3
)
SELECT
  experiment_id,
  variant,
  SUM(unique_users) AS total_users,
  SUM(total_assignments) AS total_assignments,
  ROUND(SUM(unique_users) * 100.0 / SUM(SUM(unique_users)) OVER (PARTITION BY experiment_id), 1) AS pct_of_experiment
FROM assignments
GROUP BY 1, 2
ORDER BY 1, 2;

-- ──────────────────────────────────────────────
-- 2. Primary Metric Conversion Rates
-- ──────────────────────────────────────────────
CREATE OR REPLACE VIEW `project.dataset.ab_conversion_rates` AS
WITH conversions AS (
  SELECT
    event_date,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') AS experiment_id,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'variant') AS variant,
    event_name AS conversion_event,
    COUNT(DISTINCT user_pseudo_id) AS converting_users,
    COUNT(*) AS total_conversions,
    SUM((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'value')) AS total_value
  FROM `project.dataset.events_*`
  WHERE event_name IN ('cta_click', 'newsletter_signup', 'book_purchase_click', 'purchase')
    AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') IS NOT NULL
    AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  GROUP BY 1, 2, 3, 4
),
assignments AS (
  SELECT
    experiment_id,
    variant,
    COUNT(DISTINCT user_pseudo_id) AS assigned_users
  FROM `project.dataset.events_*`
  WHERE event_name = 'ab_experiment'
    AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  GROUP BY 1, 2
)
SELECT
  c.experiment_id,
  c.variant,
  c.conversion_event,
  c.converting_users,
  a.assigned_users,
  ROUND(c.converting_users * 100.0 / a.assigned_users, 2) AS conversion_rate_pct,
  c.total_conversions,
  c.total_value
FROM conversions c
JOIN assignments a
  ON c.experiment_id = a.experiment_id
  AND c.variant = a.variant
ORDER BY 1, 2, 3;

-- ──────────────────────────────────────────────
-- 3. Statistical Significance (Bayesian / Frequentist)
-- ──────────────────────────────────────────────
CREATE OR REPLACE VIEW `project.dataset.ab_significance` AS
WITH variant_stats AS (
  SELECT
    experiment_id,
    variant,
    conversion_event,
    converting_users,
    assigned_users,
    converting_users / assigned_users AS conversion_rate,
    -- Wilson score interval for confidence
    (converting_users + 1.92) / (assigned_users + 3.84) AS wilson_center,
    1.96 * SQRT((conversion_rate * (1 - conversion_rate) + 1.92 / assigned_users) / assigned_users) AS wilson_margin
  FROM `project.dataset.ab_conversion_rates`
)
SELECT
  s1.experiment_id,
  s1.conversion_event,
  s1.variant AS variant_a,
  s2.variant AS variant_b,
  s1.conversion_rate AS rate_a,
  s2.conversion_rate AS rate_b,
  s1.conversion_rate - s2.conversion_rate AS absolute_diff,
  ROUND((s1.conversion_rate - s2.conversion_rate) / s2.conversion_rate * 100, 1) AS relative_lift_pct,
  -- Simplified significance: non-overlapping Wilson intervals
  CASE
    WHEN (s1.wilson_center - s1.wilson_margin) > (s2.wilson_center + s2.wilson_margin) THEN 'A significant'
    WHEN (s2.wilson_center - s2.wilson_margin) > (s1.wilson_center + s1.wilson_margin) THEN 'B significant'
    ELSE 'Not significant'
  END AS significance,
  s1.assigned_users AS users_a,
  s2.assigned_users AS users_b
FROM variant_stats s1
JOIN variant_stats s2
  ON s1.experiment_id = s2.experiment_id
  AND s1.conversion_event = s2.conversion_event
  AND s1.variant < s2.variant
ORDER BY 1, 2;

-- ──────────────────────────────────────────────
-- 4. Daily Trend (Time Series)
-- ──────────────────────────────────────────────
CREATE OR REPLACE VIEW `project.dataset.ab_daily_trend` AS
SELECT
  event_date,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') AS experiment_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'variant') AS variant,
  event_name,
  COUNT(DISTINCT user_pseudo_id) AS daily_users,
  COUNT(*) AS daily_events
FROM `project.dataset.events_*`
WHERE event_name IN ('ab_experiment', 'cta_click', 'newsletter_signup', 'book_purchase_click')
  AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') IS NOT NULL
  AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
                        AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
GROUP BY 1, 2, 3, 4
ORDER BY 1 DESC, 2, 3;

-- ──────────────────────────────────────────────
-- 5. Segment Analysis (Device, Country, Language)
-- ──────────────────────────────────────────────
CREATE OR REPLACE VIEW `project.dataset.ab_segment_analysis` AS
WITH base AS (
  SELECT
    event_date,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') AS experiment_id,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'variant') AS variant,
    event_name,
    user_pseudo_id,
    device.category AS device_category,
    geo.country AS country,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_path') AS page_path
  FROM `project.dataset.events_*`
  WHERE event_name IN ('ab_experiment', 'cta_click', 'newsletter_signup', 'book_purchase_click')
    AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') IS NOT NULL
    AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
)
SELECT
  experiment_id,
  variant,
  event_name,
  device_category,
  country,
  COUNT(DISTINCT user_pseudo_id) AS users,
  COUNT(*) AS events,
  ROUND(COUNT(DISTINCT user_pseudo_id) * 100.0 / SUM(COUNT(DISTINCT user_pseudo_id)) OVER (PARTITION BY experiment_id, variant, event_name), 1) AS pct
FROM base
GROUP BY 1, 2, 3, 4, 5
ORDER BY 1, 2, 3, 6 DESC;