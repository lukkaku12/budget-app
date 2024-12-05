import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null); // Estado para manejar el foco

  const navigate = useNavigate();

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login Data:', form);
    navigate('/home');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          onFocus={() => handleFocus('email')}
          onBlur={handleBlur}
          style={{
            ...styles.input,
            ...(focusedField === 'email' ? styles.inputFocus : {}),
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          onFocus={() => handleFocus('password')}
          onBlur={handleBlur}
          style={{
            ...styles.input,
            ...(focusedField === 'password' ? styles.inputFocus : {}),
          }}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#e3f2fd', // Azul pastel
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#1976d2', // Azul más intenso
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto'
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    fontSize: '16px',
    width: '90%',
    borderRadius: '5px',
    border: '1px solid #90caf9', // Azul suave
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#1976d2', // Azul más intenso al enfocar
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    color: 'white',
    backgroundColor: '#1976d2',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#115293',
  },
};