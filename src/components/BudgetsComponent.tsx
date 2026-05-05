import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

interface Category { id: string; name: string; user_id: string; }
interface Budget { id: string; name: string; amount: number; start_date: string; end_date: string; status: string; category: Category; }

const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [monthFilter, setMonthFilter] = useState<number | "">("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const navigate = useNavigate();

  const retrieveUserBudgets = async () => {
    const token = Cookies.get("token");
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string | number> = {};
      if (categoryFilter) params.category = categoryFilter;
      if (monthFilter !== "") params.month = monthFilter;
      if (statusFilter) params.status = statusFilter;
      const response = await axios.get("https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/budgets", { headers: { Authorization: `Bearer ${token}` }, params });
      setBudgets(response.data);
      setError(null);
    } catch (err) {
      setError("No budgets found...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { retrieveUserBudgets(); }, [categoryFilter, monthFilter, statusFilter]);

  const totals = useMemo(() => {
    const total = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const active = budgets.filter((budget) => budget.status === "active").length;
    const categories = new Set(budgets.map((budget) => budget.category?.name).filter(Boolean)).size;
    return { total, active, categories };
  }, [budgets]);

  if (loading) {
    return <div className="loading-state"><div><div className="spinner-dot" /><h2>Loading budgets</h2><p className="text-muted">Preparing your financial workspace...</p></div></div>;
  }

  return (
    <div>
      <header className="topbar">
        <div>
          <h1>Budgets</h1>
          <p>Your monthly plans, categories, and spending windows at a glance.</p>
        </div>
        <button className="pp-btn pp-btn-primary" onClick={() => navigate("/create-budget")}>＋ Create budget</button>
      </header>

      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">Workspace overview</span>
          <h2>Plan every dollar with a clearer dashboard.</h2>
          <p className="mb-0 text-white-50">Filter budgets by status, category, or month, then jump into transactions for deeper analysis.</p>
        </div>
        <div className="metric"><strong>{budgets.length}</strong><span>Total budgets</span></div>
      </section>

      <section className="stat-grid" aria-label="Budget summary">
        <div className="stat-card"><span>Planned amount</span><strong>{formatCurrency(totals.total)}</strong></div>
        <div className="stat-card"><span>Active budgets</span><strong>{totals.active}</strong></div>
        <div className="stat-card"><span>Categories</span><strong>{totals.categories}</strong></div>
      </section>

      <section className="panel mb-4">
        <div className="panel-header">
          <h2 className="panel-title">Refine budget list</h2>
          <button className="pp-btn pp-btn-ghost pp-btn-sm" onClick={retrieveUserBudgets}>Refresh</button>
        </div>
        <div className="filter-grid">
          <div className="form-field mb-0">
            <label htmlFor="categoryFilter">Category</label>
            <select id="categoryFilter" className="pp-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All Categories</option><option value="Food">Food</option><option value="Travel">Travel</option><option value="Entertainment">Entertainment</option>
            </select>
          </div>
          <div className="form-field mb-0">
            <label htmlFor="monthFilter">Month</label>
            <select id="monthFilter" className="pp-select" value={monthFilter === "" ? "" : monthFilter} onChange={(e) => setMonthFilter(e.target.value === "" ? "" : Number(e.target.value))}>
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleString("en", { month: "long" })}</option>)}
            </select>
          </div>
          <div className="form-field mb-0">
            <label htmlFor="statusFilter">Status</label>
            <select id="statusFilter" className="pp-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option><option value="pending">Pending</option><option value="active">Active</option><option value="completed">Completed</option>
            </select>
          </div>
          <button className="pp-btn pp-btn-secondary" onClick={retrieveUserBudgets}>Apply filters</button>
        </div>
      </section>

      {error || budgets.length === 0 ? (
        <section className="empty-state panel">
          <div><span className="feature-icon mx-auto mb-3">＋</span><h2>No budgets to show</h2><p className="text-muted">Create your first polished budget workspace.</p><button className="pp-btn pp-btn-primary" onClick={() => navigate("/create-budget")}>Create New Budget</button></div>
        </section>
      ) : (
        <section className="budget-grid">
          {budgets.map((budget) => (
            <article className="budget-card" key={budget.id} onClick={() => navigate(`/budgets/${budget.id}`, { state: { budgetAmount: budget.amount } })}>
              <div>
                <div className="budget-card-top"><span className={`status-pill ${budget.status}`}>{budget.status}</span><span className="category-chip">{budget.category.name}</span></div>
                <h3>{budget.name}</h3>
                <div className="budget-amount">{formatCurrency(budget.amount)}</div>
              </div>
              <div className="budget-meta"><span>Starts {formatDate(budget.start_date)}</span><span>Ends {formatDate(budget.end_date)}</span><strong>Open transaction detail →</strong></div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default Budgets;
