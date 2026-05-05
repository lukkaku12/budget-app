import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/auth/register", formData);
      auth.setIsAuthenticated(true);
      document.cookie = `token=${response.data.accessToken}; path=/; expires=${new Date(Date.now() + 86400000).toUTCString()}; secure; SameSite=Strict`;
      navigate("/home", { replace: true });
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      console.error("Error en el registro:", error);
      setError(message || "An error occurred during registration");
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
          <span className="eyebrow">New workspace</span>
          <h1>Start budgeting with a product that feels premium.</h1>
          <p>Create your account and move into a cleaner budgeting system for categories, spending, and monthly focus.</p>
        </div>
        <div className="auth-preview">
          <strong>Workspace setup</strong>
          <div className="auth-preview-row"><span>Create account</span><strong>Step 1</strong></div>
          <div className="auth-preview-row"><span>Build first budget</span><strong>Step 2</strong></div>
        </div>
      </section>

      <section className="auth-panel-wrap">
        <form className="auth-card" onSubmit={handleSubmit}>
          <span className="pill">Create account</span>
          <h2>Open your workspace</h2>
          <p className="auth-subtitle">A refined budgeting dashboard is a few details away.</p>
          {error && <div className="alert-soft">{error}</div>}

          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input className="pp-input" type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Alex Morgan" required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input className="pp-input" type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input className="pp-input" type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a secure password" required />
          </div>
          <button type="submit" className="pp-btn pp-btn-primary pp-btn-wide">Create workspace</button>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </section>
    </main>
  );
};

export default RegisterForm;
