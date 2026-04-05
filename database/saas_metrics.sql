-- Vincere SaaS Metrics Database Schema
-- Optimized for Real-time Dashboards and Agentic Analysis

-- 1. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.saas_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_name VARCHAR(50) NOT NULL CHECK (plan_name IN ('Free', 'Basic', 'Pro', 'Enterprise')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    mrr_value DECIMAL(12, 2) NOT NULL DEFAULT 0.00, -- MRR contribution of this sub
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Revenue Transactions Table
CREATE TABLE IF NOT EXISTS public.revenue_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sub_id UUID REFERENCES public.saas_subscriptions(id),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('new_sale', 'renewal', 'upgrade', 'refund')),
    status VARCHAR(20) DEFAULT 'paid',
    processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Churn Events Table
CREATE TABLE IF NOT EXISTS public.churn_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    sub_id UUID REFERENCES public.saas_subscriptions(id),
    reason TEXT,
    last_mrr DECIMAL(12, 2),
    canceled_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Daily Metrics Snapshots (For Charting)
CREATE TABLE IF NOT EXISTS public.metrics_daily_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_date DATE UNIQUE NOT NULL,
    total_mrr DECIMAL(15, 2) DEFAULT 0.00,
    active_customers INTEGER DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    churned_customers INTEGER DEFAULT 0,
    revenue_today DECIMAL(15, 2) DEFAULT 0.00
);

-- 5. Helpful View: MRR Calculation
CREATE OR REPLACE VIEW public.vw_mrr_trends AS
SELECT 
    DATE_TRUNC('month', snapshot_date) as month,
    SUM(revenue_today) as total_revenue,
    AVG(total_mrr) as avg_mrr,
    SUM(new_customers) as new_customer_count,
    SUM(churned_customers) as churn_customer_count
FROM public.metrics_daily_snapshots
GROUP BY month
ORDER BY month DESC;

-- Indexes for performance
CREATE INDEX idx_sub_status ON public.saas_subscriptions(status);
CREATE INDEX idx_rev_date ON public.revenue_transactions(processed_at);
CREATE INDEX idx_metrics_date ON public.metrics_daily_snapshots(snapshot_date);
