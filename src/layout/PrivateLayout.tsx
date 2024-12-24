import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const PrivateLayout = () => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="layout d-flex flex-column min-vh-100">
      {/* Header */}
      <Navbar bg="success" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/home">Payout Pal</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Container>
          <Row>
            <Col xs={12} md={8} className="mx-auto">
              <div className="content">
                <Outlet />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <Navbar bg="dark" variant="dark" className="mt-4">
        <Container>
          <Navbar.Text className="text-center text-white">
            &copy; All rights reserved. 2024
          </Navbar.Text>
        </Container>
      </Navbar>
    </div>
  );
};

export default PrivateLayout;