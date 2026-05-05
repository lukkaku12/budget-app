import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Configuración de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
}

const BudgetDetails: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { budgetAmount } = location?.state || {};

  // Filtros y filtros aplicados
  const [filters, setFilters] = useState({
    min_day: "",
    max_day: "",
    min_amount: "",
    max_amount: "",
  });
  const [appliedFilters, setAppliedFilters] = useState<typeof filters>({
    min_day: "",
    max_day: "",
    min_amount: "",
    max_amount: "",
  });

  const fetchTransactions = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        ...(appliedFilters.min_day && { min_day: appliedFilters.min_day }),
        ...(appliedFilters.max_day && { max_day: appliedFilters.max_day }),
        ...(appliedFilters.min_amount && {
          min_amount: appliedFilters.min_amount,
        }),
        ...(appliedFilters.max_amount && {
          max_amount: appliedFilters.max_amount,
        }),
      });

      const response = await axios.get(
        `https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/transactions/budget/${id}?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransactions(response.data);
    } catch {
      setError("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch de transacciones al aplicar filtros
  useEffect(() => {
    if (location.pathname === `/budgets/${id}`) {
      fetchTransactions();
    }
  }, [id, appliedFilters, location.pathname, budgetAmount]);

  // Manejar cambios en los campos de filtro
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Aplicar filtros al hacer clic en el botón
  const handleApplyFilters = () => {
    setAppliedFilters(filters); // Actualiza los filtros aplicados
  };

  // Restablecer los filtros
  const handleResetFilters = () => {
    setFilters({
      min_day: "",
      max_day: "",
      min_amount: "",
      max_amount: "",
    });
    setAppliedFilters({
      min_day: "",
      max_day: "",
      min_amount: "",
      max_amount: "",
    });
  };

  // Configuración de datos para la gráfica
  const chartData = {
    labels: transactions.map((t) => new Date(t.date).toLocaleDateString()), // Asegúrate de que esto sea un arreglo de cadenas
    datasets: [
      {
        label: "Transaction Amount",
        data: transactions.map((t) => t.amount), // Monto de cada transacción
        backgroundColor: "rgba(67, 97, 238, 0.24)",
        borderColor: "rgba(67, 97, 238, 1)",
        borderWidth: 1,
      },
    ],
  };

  const ChartDataTotal = {
    labels: ["Total"], // Aquí puedes poner un solo valor o los totales si tienes más de uno
    datasets: [
      {
        label: "Total Amount",
        data: [transactions.reduce((total, t) => total + t.amount, 0)], // Suma de todos los montos
        backgroundColor: "rgba(14, 165, 164, 0.24)",
        borderColor: "rgba(14, 165, 164, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptionsTotal = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Total Amount Spent" },
    },
    scales: {
      y: {
        min: 10,
        max: Math.floor(budgetAmount),
      },
    },
  } as const;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Transactions Overview" },
    },
    scales: {
      y: {
        min: 10,
        max: Math.floor(budgetAmount),
      },
    },
  } as const;

  // Función para eliminar una transacción
  const handleDeleteTransaction = async (transactionId: string) => {
    const token = Cookies.get("token");
    try {
      await axios.delete(
        `https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/transactions/${transactionId}/budget/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Actualizar el estado eliminando la transacción del arreglo
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
      alert("Transaction deleted successfully");
    } catch {
      alert("Failed to delete the transaction");
    }
  };

  const totalSpent = transactions.reduce((total, t) => total + t.amount, 0);
  const remaining = Number(budgetAmount || 0) - totalSpent;

  if (loading) {
    return <div className="loading-state"><div><div className="spinner-dot" /><h2>Loading transactions</h2><p className="text-muted">Building your budget detail view...</p></div></div>;
  }

  if (error) {
    return <section className="empty-state panel"><div><h2>Something went wrong</h2><p className="text-muted">{error}</p><button className="pp-btn pp-btn-secondary" onClick={() => navigate("/home")}>Back to budgets</button></div></section>;
  }

  return (
    <div>
      <header className="topbar">
        <div>
          <h1>Transactions</h1>
          <p>Inspect spending, apply targeted filters, and manage records for this budget.</p>
        </div>
        <div className="action-row">
          <button className="pp-btn pp-btn-secondary" onClick={() => navigate("/home")}>← Budgets</button>
          <button className="pp-btn pp-btn-primary" onClick={() => navigate(`/budgets/${id}/create-transaction`)}>＋ Add transaction</button>
        </div>
      </header>

      <section className="stat-grid" aria-label="Transaction summary">
        <div className="stat-card"><span>Total spent</span><strong>${totalSpent.toFixed(2)}</strong></div>
        <div className="stat-card"><span>Budget amount</span><strong>${Number(budgetAmount || 0).toFixed(2)}</strong></div>
        <div className="stat-card"><span>Remaining</span><strong>${remaining.toFixed(2)}</strong></div>
      </section>

      <section className="chart-grid">
        <div className="chart-panel">
          <div className="panel-header"><h2 className="panel-title">Transaction rhythm</h2></div>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="chart-panel">
          <div className="panel-header"><h2 className="panel-title">Total vs plan</h2></div>
          <Bar data={ChartDataTotal} options={chartOptionsTotal} />
        </div>
      </section>

      <section className="panel mb-4">
        <div className="panel-header"><h2 className="panel-title">Filter transaction records</h2></div>
        <div className="filter-grid">
          <div className="form-field mb-0"><label htmlFor="min_day">Minimum day</label><input className="pp-input" id="min_day" type="number" name="min_day" value={filters.min_day} onChange={handleInputChange} placeholder="1" /></div>
          <div className="form-field mb-0"><label htmlFor="max_day">Maximum day</label><input className="pp-input" id="max_day" type="number" name="max_day" value={filters.max_day} onChange={handleInputChange} placeholder="31" /></div>
          <div className="form-field mb-0"><label htmlFor="min_amount">Minimum amount</label><input className="pp-input" id="min_amount" type="number" name="min_amount" value={filters.min_amount} onChange={handleInputChange} placeholder="0.01" /></div>
          <div className="form-field mb-0"><label htmlFor="max_amount">Maximum amount</label><input className="pp-input" id="max_amount" type="number" name="max_amount" value={filters.max_amount} onChange={handleInputChange} placeholder="1000" /></div>
        </div>
        <div className="action-row mt-3"><button className="pp-btn pp-btn-primary" onClick={handleApplyFilters}>Apply filters</button><button className="pp-btn pp-btn-ghost" onClick={handleResetFilters}>Reset filters</button></div>
      </section>

      {transactions.length === 0 ? (
        <section className="empty-state panel"><div><h2>No transactions found</h2><p className="text-muted">Add the first transaction to start visualizing this budget.</p><button className="pp-btn pp-btn-primary" onClick={() => navigate(`/budgets/${id}/create-transaction`)}>Add transaction</button></div></section>
      ) : (
        <section className="transaction-list">
          {transactions.map((transaction) => (
            <article className="transaction-row" key={transaction.id}>
              <div><strong>{transaction.description}</strong><p>ID {transaction.id} · {new Date(transaction.date).toLocaleDateString()}</p></div>
              <div className="amount-positive">${transaction.amount.toFixed(2)}</div>
              <div className="action-row"><button className="pp-btn pp-btn-danger pp-btn-sm" onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button><button className="pp-btn pp-btn-secondary pp-btn-sm" onClick={() => navigate(`/budget/${id}/edit-transaction/${transaction.id}`)}>Edit</button></div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default BudgetDetails;
