import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";

interface Transaction {
    id?: string;
    description: string;
    amount: number;
    date: string;
}

const CreateTransaction: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Transaction>({
    amount: 0,
    date: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    setFormData({
      ...formData,
      [name]: name === "amount" ? parseFloat(value) || 0 : value, // Convertir "amount" a número
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("token");

    try {
        console.log(typeof formData.amount);
      await axios.post(
        `https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/transactions`,
        {
          ...formData,
          amount: parseFloat(String(formData.amount)), 
          budget_id: id, // Agregar el budget_id
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate(`/budgets/${id}`); // Redirigir a los detalles del presupuesto
    } catch (err) {
      setError("Failed to create transaction.");
      console.error(err);
    }
  };

  return (
    <Container className="py-5">
      <h2>Create Transaction</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="amount" className="mb-3">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="date" className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Transaction
        </Button>
      </Form>
    </Container>
  );
};

export default CreateTransaction;