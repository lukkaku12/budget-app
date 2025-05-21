import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

export default function LandingPage() {
  return (
    <div className="bg-success text-white min-vh-100 d-flex flex-column">
      {/* Hero Section */}
      <header className="py-5 text-center">
        <Container>
          <h1 className="display-4 fw-bold">Welcome to Payout Pal</h1>
          <p className="lead mt-3">
            Take control of your budget with a platform built for real insights and simplicity.
          </p>
          <div className="mt-4">
            <Link to="/login" className="btn btn-dark btn-lg me-3">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg">
              Register
            </Link>
          </div>
        </Container>
      </header>

      {/* Features Section */}
      <section className="bg-light text-dark py-5 d-flex align-items-center" style={{ minHeight: "60vh" }}>
        <Container>
          <Row className="text-center">
            <Col md={4}>
              <h3>Track Your Spending</h3>
              <p>Monitor every expense with ease and see where your money goes.</p>
            </Col>
            <Col md={4}>
              <h3>Smart Budgeting</h3>
              <p>Create and manage budgets that adapt to your goals and habits.</p>
            </Col>
            <Col md={4}>
              <h3>Visual Insights</h3>
              <p>Gain clear insights with charts and analysis tailored to your data.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 text-center bg-success text-white">
        <Container>
          <h2 className="mb-3">Ready to transform your finances?</h2>
          <p className="lead mb-4">Join Payout Pal and take the first step toward financial clarity.</p>
          <Link to="/register" className="btn btn-light btn-lg">
            Get Started
          </Link>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <Container>
          &copy; {new Date().getFullYear()} Payout Pal. All rights reserved.
        </Container>
      </footer>
    </div>
  );
}