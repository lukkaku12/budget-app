import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const PrivateLayout = () => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/welcome" />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <Link to="/home" className="brand-mark text-decoration-none text-white">
            <span className="brand-orb" />
            <span>Payout Pal</span>
          </Link>
          <nav className="sidebar-nav" aria-label="Workspace navigation">
            <Link className="sidebar-link" to="/home">▦ Budgets</Link>
            <Link className="sidebar-link" to="/create-budget">＋ New budget</Link>
            <Link className="sidebar-link" to="/profile">◉ Profile</Link>
          </nav>
          <div className="sidebar-card">
            <strong>Financial command center</strong>
            <p className="mb-0 mt-2 text-white-50">Plan budgets, inspect spend, and keep your monthly money system tidy.</p>
          </div>
        </div>
        <small className="text-white-50">© {new Date().getFullYear()} Payout Pal</small>
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;
