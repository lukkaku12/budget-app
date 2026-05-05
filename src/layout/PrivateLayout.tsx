import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const PrivateLayout = () => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/welcome" />;
  }

  return (
    <div className="app-shell d-flex flex-column min-vh-100">
      <Navbar expand="lg" className="premium-navbar">
        <Container className="premium-container">
          <Navbar.Brand as={Link} to="/home" className="text-white">
            Payout Pal
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/profile" className="text-white-50">
              Profile
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <main className="premium-page flex-grow-1">
        <Container className="premium-container">
          <Outlet />
        </Container>
      </main>

      <footer className="py-3 border-top border-secondary-subtle bg-white">
        <Container className="premium-container text-secondary small">
          © {new Date().getFullYear()} Payout Pal. Crafted for better budgeting.
        </Container>
      </footer>
    </div>
  );
};

export default PrivateLayout;
