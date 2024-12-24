import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null); // Estado para manejar el foco
  const navigate = useNavigate();
  const auth = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Enviar solicitud de login con axios
      const response = await axios.post(
        'https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/auth/login',
        form
      );

      console.log('Login Success:', response.data);

      // Crear una cookie segura para el token
      document.cookie = `token=${response.data.accessToken}; path=/; expires=${new Date(
        Date.now() + 86400000
      ).toUTCString()}; secure; SameSite=Strict`;

      auth.setIsAuthenticated(true);
      navigate('/home', { replace: true });
    } catch (error: any) {
      if (error.response) {
        // Error del servidor con mensaje
        alert(`Error: ${error.response.data.message || 'Something went wrong'}`);
      } else {
        console.error('Error during login:', error);
        alert('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Login</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      focusedField === 'email' ? 'border-primary' : ''
                    }`}
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
                      focusedField === 'password' ? 'border-primary' : ''
                    }`}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
              <div className="text-center mt-3">
                <p>
                  Don't have an account?{' '}
                  <a href="/register" className="text-primary">
                    Register
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};