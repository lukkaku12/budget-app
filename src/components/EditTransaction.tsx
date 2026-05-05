import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

interface Transaction { id: string; description: string; amount: number; date: string; }

const EditTransaction: React.FC = () => {
  const { idBudget, idTransaction } = useParams<{ idBudget: string; idTransaction: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      const token = Cookies.get("token");
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/transactions/${idTransaction}/budget/${idBudget}`, { headers: { Authorization: `Bearer ${token}` } });
        setTransaction(response.data);
      } catch {
        setError("Failed to fetch transaction.");
      } finally { setLoading(false); }
    };
    fetchTransaction();
  }, [idBudget, idTransaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransaction((prev) => (prev ? { ...prev, [name]: name === "amount" ? Number(value) : value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (!transaction) return;
    try {
      await axios.patch(`https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/transactions/${transaction.id}`, { description: transaction.description, amount: parseFloat(String(transaction.amount)), date: transaction.date, budget_id: idBudget }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Transaction updated successfully");
      navigate(`/budgets/${idBudget}`);
    } catch (error) {
      console.log(error);
      setError("Failed to update the transaction.");
    }
  };

  if (loading) return <div className="loading-state"><div><div className="spinner-dot" /><h2>Loading transaction</h2></div></div>;
  if (error) return <div className="alert-soft">{error}</div>;
  if (!transaction) return <section className="empty-state panel"><h2>Transaction not found.</h2></section>;

  return (
    <div className="form-page">
      <header className="topbar"><div><h1>Edit transaction</h1><p>Refine the transaction details and keep reporting clean.</p></div><button className="pp-btn pp-btn-secondary" onClick={() => navigate(`/budgets/${idBudget}`)}>Cancel</button></header>
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-field"><label htmlFor="description">Description</label><input className="pp-input" id="description" type="text" name="description" value={transaction.description} onChange={handleChange} required /></div>
        <div className="form-field"><label htmlFor="amount">Amount</label><input className="pp-input" id="amount" type="number" name="amount" value={transaction.amount} onChange={handleChange} required /></div>
        <div className="form-field"><label htmlFor="date">Date</label><input className="pp-input" id="date" type="date" name="date" value={new Date(transaction.date).toISOString().split("T")[0]} onChange={handleChange} required /></div>
        <button className="pp-btn pp-btn-primary" type="submit">Save changes</button>
      </form>
    </div>
  );
};

export default EditTransaction;
