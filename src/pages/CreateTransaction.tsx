import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

interface Transaction { id?: string; description: string; amount: number; date: string; }

const CreateTransaction: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Transaction>({ amount: 0, date: "", description: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "amount" ? parseFloat(value) || 0 : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("token");
    try {
      await axios.post("https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/transactions", { ...formData, amount: parseFloat(String(formData.amount)), budget_id: id }, { headers: { Authorization: `Bearer ${token}` } });
      navigate(`/budgets/${id}`);
    } catch (error) {
      setError("Failed to create transaction.");
      console.error(error);
    }
  };

  return (
    <div className="form-page">
      <header className="topbar"><div><h1>Create transaction</h1><p>Add a new spend record to this budget.</p></div><button className="pp-btn pp-btn-secondary" onClick={() => navigate(`/budgets/${id}`)}>Cancel</button></header>
      <section className="form-layout">
        <aside className="form-aside"><span className="eyebrow">Transaction capture</span><h2 className="mt-3">Keep budget history accurate and easy to scan.</h2><p className="text-white-50">Record the amount, date, and description for cleaner reports.</p></aside>
        <form className="form-card" onSubmit={handleSubmit}>
          {error && <div className="alert-soft">{error}</div>}
          <div className="form-field"><label htmlFor="amount">Amount</label><input className="pp-input" type="number" step="0.01" id="amount" name="amount" value={formData.amount} onChange={handleChange} required /></div>
          <div className="form-field"><label htmlFor="date">Date</label><input className="pp-input" type="datetime-local" id="date" name="date" value={formData.date} onChange={handleChange} required /></div>
          <div className="form-field"><label htmlFor="description">Description</label><textarea className="pp-textarea" id="description" name="description" value={formData.description} onChange={handleChange} required /></div>
          <button className="pp-btn pp-btn-primary" type="submit">Create transaction</button>
        </form>
      </section>
    </div>
  );
};

export default CreateTransaction;
