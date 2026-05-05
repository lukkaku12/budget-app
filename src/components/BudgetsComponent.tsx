import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
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

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

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
      setError(null);
    } catch (err) {
      setError("No budgets found...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveUserBudgets();
  }, [categoryFilter, monthFilter, statusFilter]);

  const overview = useMemo(() => {
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const activeBudgets = budgets.filter((b) => b.status.toLowerCase() === "active").length;
    const savingsTarget = totalBudget * 0.2;
    return { totalBudget, activeBudgets, savingsTarget, categories: new Set(budgets.map((b) => b.category?.name)).size };
  }, [budgets]);

  const toneByStatus: Record<string, string> = {
    active: "success",
    pending: "warning",
    completed: "secondary",
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3 text-secondary">Loading your budget dashboard...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="dark" onClick={() => navigate("/create-budget")}>Create Your First Budget</Button>
      </Container>
    );
  }

  return (
    <Container fluid className="px-0">
      <section className="glass-card p-4 p-md-5 mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <p className="text-uppercase text-secondary fw-semibold mb-2" style={{ letterSpacing: ".08em", fontSize: "0.75rem" }}>Overview</p>
            <h1 className="h3 fw-bold mb-2">Financial Planning Hub</h1>
            <p className="text-secondary mb-0">Track spending, optimize categories, and keep your goals on pace.</p>
          </div>
          <Button variant="dark" className="px-4" onClick={() => navigate("/create-budget")}>+ New Budget</Button>
        </div>

        <Row className="g-3">
          <Col md={3} sm={6}><Card className="border-0 shadow-sm h-100"><Card.Body><small className="text-secondary">Total Planned</small><h4 className="fw-bold mt-2 mb-0">{currency.format(overview.totalBudget)}</h4></Card.Body></Card></Col>
          <Col md={3} sm={6}><Card className="border-0 shadow-sm h-100"><Card.Body><small className="text-secondary">Active Budgets</small><h4 className="fw-bold mt-2 mb-0">{overview.activeBudgets}</h4></Card.Body></Card></Col>
          <Col md={3} sm={6}><Card className="border-0 shadow-sm h-100"><Card.Body><small className="text-secondary">Categories</small><h4 className="fw-bold mt-2 mb-0">{overview.categories}</h4></Card.Body></Card></Col>
          <Col md={3} sm={6}><Card className="border-0 shadow-sm h-100"><Card.Body><small className="text-secondary">Savings Goal (20%)</small><h4 className="fw-bold mt-2 mb-0">{currency.format(overview.savingsTarget)}</h4></Card.Body></Card></Col>
        </Row>
      </section>

      <Form className="glass-card p-3 p-md-4 mb-4">
        <Row className="gy-3">
          <Col md={4}><Form.Group controlId="categoryFilter"><Form.Label className="fw-semibold">Category</Form.Label><Form.Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}><option value="">All Categories</option><option value="Food">Food</option><option value="Travel">Travel</option><option value="Entertainment">Entertainment</option></Form.Select></Form.Group></Col>
          <Col md={4}><Form.Group controlId="monthFilter"><Form.Label className="fw-semibold">Month</Form.Label><Form.Select value={monthFilter === "" ? "" : monthFilter} onChange={(e) => setMonthFilter(e.target.value === "" ? "" : Number(e.target.value))}><option value="">All Months</option>{Array.from({ length: 12 }, (_, i) => (<option key={i} value={i}>{new Date(0, i).toLocaleString("en", { month: "long" })}</option>))}</Form.Select></Form.Group></Col>
          <Col md={4}><Form.Group controlId="statusFilter"><Form.Label className="fw-semibold">Status</Form.Label><Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">All Statuses</option><option value="pending">Pending</option><option value="active">Active</option><option value="completed">Completed</option></Form.Select></Form.Group></Col>
        </Row>
      </Form>

      <Row className="gy-4">
        {budgets.map((budget) => (
          <Col key={budget.id} xs={12} sm={6} lg={4}>
            <Card className="border-0 shadow-sm h-100" onClick={() => navigate(`/budgets/${budget.id}`, { state: { budgetAmount: budget.amount } })} style={{ cursor: "pointer", transition: "all .18s ease" }}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 fw-semibold">{budget.name}</h5>
                  <Badge bg={toneByStatus[budget.status.toLowerCase()] || "primary"} className="pill-chip text-capitalize">{budget.status}</Badge>
                </div>
                <p className="h4 fw-bold mb-3">{currency.format(budget.amount)}</p>
                <div className="d-flex flex-column gap-2 text-secondary small">
                  <span>Start: {new Date(budget.start_date).toLocaleDateString()}</span>
                  <span>End: {new Date(budget.end_date).toLocaleDateString()}</span>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white border-0 pt-0 px-4 pb-4">
                <span className="pill-chip bg-light text-primary-emphasis">{budget.category.name}</span>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Budgets;
