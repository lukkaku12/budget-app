import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
}

const EditTransaction: React.FC = () => {
  const { idBudget, idTransaction } = useParams<{ idBudget: string, idTransaction: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch de la transacción para editar
  useEffect(() => {
    const fetchTransaction = async () => {
      const token = Cookies.get("token");
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/transactions/${idTransaction}/budget/${idBudget}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTransaction(response.data);
      } catch (err) {
        setError("Failed to fetch transaction.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [idBudget, idTransaction]);

  // Manejo de los cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransaction((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  // Enviar los cambios al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (!transaction) return;

    try {
        console.log(typeof transaction.amount)
      await axios.patch(
        `https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/transactions/${transaction.id}`,
        { description:transaction.description,
            amount:parseFloat(String(transaction.amount)),
            date:transaction.date,
            budget_id: idBudget
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Transaction updated successfully");
      navigate(`/budgets/${idBudget}`); // Redirigir a la página de detalles del presupuesto
    } catch (err) {
        console.log(err);
      setError("Failed to update the transaction.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!transaction) {
    return <p>Transaction not found.</p>;
  }

  return (
    <Container>
      <h2>Edit Transaction</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={transaction.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            value={transaction.amount}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={new Date(transaction.date).toISOString().split("T")[0]} // Formato adecuado para input tipo date
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default EditTransaction;