import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { Badge, Button, Card, Spinner, Form, Container, Row, Col, Alert } from "react-bootstrap";

interface Category {
  id: string;
  name: string;
  user_id: string;
}

interface Budget {
  id: string;
  name: string;
  amount: number;
  start_date: string;
  end_date: string;
  status: string;
  category: Category;
}

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
      const params: any = {};
      if (categoryFilter) params.category = categoryFilter;
      if (monthFilter !== "") params.month = monthFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await axios.get(
        "https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/budgets",
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );
      setBudgets(response.data);
    } catch (err) {
      setError("No budgets found...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveUserBudgets();
  }, [categoryFilter, monthFilter, statusFilter]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading budgets...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="success" onClick={() => navigate("/create-budget")}>
          Create New Budget
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Budgets</h2>
        <Button variant="primary" onClick={() => navigate("/create-budget")}>
          Create New Budget
        </Button>
      </div>

      {/* Filter Form */}
      <Form className="bg-light p-3 rounded mb-4">
        <Row className="gy-3">
          <Col md={4}>
            <Form.Group controlId="categoryFilter">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Entertainment">Entertainment</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="monthFilter">
              <Form.Label>Month</Form.Label>
              <Form.Select
                value={monthFilter === "" ? "" : monthFilter}  // Maneja correctamente el valor ""
                onChange={(e) => setMonthFilter(e.target.value === "" ? "" : Number(e.target.value))}  // Maneja correctamente el valor ""
              >
                <option value="">All Months</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString("en", { month: "long" })}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="statusFilter">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className="mt-3 text-end">
          <Button variant="secondary" onClick={() => retrieveUserBudgets()}>
            Apply Filters
          </Button>
        </div>
      </Form>

      {/* Budgets Grid */}
      <Row className="gy-4">
        {budgets.map((budget) => (
          <Col key={budget.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              className="h-100"
              onClick={() => navigate(`/budgets/${budget.id}`, { state: { budgetAmount: budget.amount } })}
              style={{ cursor: "pointer" }} // Añade estilo de puntero para que se vea clickeable
            >
              <Card.Header className="bg-primary text-white">{budget.name}</Card.Header>
              <Card.Body>
                <p>
                  <strong>Amount:</strong> ${budget.amount.toFixed(2)}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(budget.start_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(budget.end_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong> {budget.status}
                </p>
              </Card.Body>
              <Card.Footer>
                <Badge bg="info">Category: {budget.category.name}</Badge>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Budgets;