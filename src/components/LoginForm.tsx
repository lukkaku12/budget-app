import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/auth/login",
        form
      );

      document.cookie = `token=${response.data.accessToken}; path=/; expires=${new Date(
        Date.now() + 86400000
      ).toUTCString()}; secure; SameSite=Strict`;

      auth.setIsAuthenticated(true);
      navigate("/home", { replace: true });
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      console.error("Login error:", error);
      setError(message || "Login failed. Please try again.");
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-art">
        <Link to="/welcome" className="brand-mark text-decoration-none text-white">
          <span className="brand-orb" />
          <span>Payout Pal</span>
        </Link>
        <div>
          <span className="eyebrow">Secure budget access</span>
          <h1>Welcome back to your money workspace.</h1>
          <p>Pick up where you left off with a focused dashboard built for calm budget decisions.</p>
        </div>
        <div className="auth-preview">
          <strong>Today&apos;s flow</strong>
          <div className="auth-preview-row"><span>Review budgets</span><strong>2 min</strong></div>
          <div className="auth-preview-row"><span>Add transaction</span><strong>Fast</strong></div>
        </div>
      </section>

      <section className="auth-panel-wrap">
        <form className="auth-card" onSubmit={handleSubmit}>
          <span className="pill">Sign in</span>
          <h2>Access your dashboard</h2>
          <p className="auth-subtitle">Enter your credentials to return to Payout Pal.</p>
          {error && <div className="alert-soft">{error}</div>}

          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input className="pp-input" type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input className="pp-input" type="password" id="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <button type="submit" className="pp-btn pp-btn-primary pp-btn-wide">Sign in to workspace</button>
          <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
        </form>
      </section>
    </main>
  );
};

export default LoginForm;
