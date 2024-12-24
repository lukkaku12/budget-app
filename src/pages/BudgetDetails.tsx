import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Spinner,
  Alert,
  Form,
  Button,
  Table,
} from "react-bootstrap";
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
    } catch (err) {
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
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
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
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
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
  };

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
  };

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
    } catch (err) {
      alert("Failed to delete the transaction");
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading transactions...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2>Transactions</h2>

      {/* Botón para volver a Budgets */}
      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => navigate("/home")}
      >
        Back to Budgets
      </Button>

      {/* Botón para añadir transacciones */}
      <Button
        variant="success"
        className="mb-4 ms-3"
        onClick={() => navigate(`/budgets/${id}/create-transaction`)}
      >
        Add Transaction
      </Button>

      {/* Contenedor flex para mostrar las gráficas de forma paralela */}
      <div className="d-flex justify-content-between mb-4">
        <div className="chart-container" style={{ width: "48%" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="chart-container" style={{ width: "48%" }}>
          <Bar data={ChartDataTotal} options={chartOptionsTotal} />
        </div>
      </div>

      {/* Filtros */}
      <Form className="mb-4">
        <Form.Group className="mb-2">
          <Form.Label>Minimum Day</Form.Label>
          <Form.Control
            type="number"
            name="min_day"
            value={filters.min_day}
            onChange={handleInputChange}
            placeholder="1"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Maximum Day</Form.Label>
          <Form.Control
            type="number"
            name="max_day"
            value={filters.max_day}
            onChange={handleInputChange}
            placeholder="31"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Minimum Amount</Form.Label>
          <Form.Control
            type="number"
            name="min_amount"
            value={filters.min_amount}
            onChange={handleInputChange}
            placeholder="0.01"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Maximum Amount</Form.Label>
          <Form.Control
            type="number"
            name="max_amount"
            value={filters.max_amount}
            onChange={handleInputChange}
            placeholder="1000"
          />
        </Form.Group>

        <Button variant="primary" className="me-2" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
        <Button variant="secondary" onClick={handleResetFilters}>
          Reset Filters
        </Button>
      </Form>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.description}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() =>
                      navigate(
                        `/budget/${id}/edit-transaction/${transaction.id}`
                      )
                    } // Redirige a la página de edición
                    className="ms-2"
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default BudgetDetails;
