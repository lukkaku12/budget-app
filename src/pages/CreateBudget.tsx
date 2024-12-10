import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import Cookies from 'js-cookie';

const CreateBudget = () => {
  const [formData, setFormData] = useState({
    name: "",
    category_name: "",
    amount: "",
    month: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" || name === "month" ? Number(value) : value,
    });
  };
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get('token')
    try {
        const response = await axios.post('https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/budgets',  formData,  {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        console.log(response.data)
        navigate('/home')
        
    } catch (error) {
        console.log(error)
    }
  };


  return (
    <div className="container mt-5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        fill="currentColor"
        class="bi bi-x"
        viewBox="0 0 16 16"
        onClick={() => navigate('/home')}
      >
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
      </svg>
      <h2 className="text-center mb-4">Create a New Budget</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category_name" className="form-label">
            Category Name
          </label>
          <input
            type="text"
            id="category_name"
            name="category_name"
            className="form-control"
            value={formData.category_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            className="form-control"
            value={formData.amount}
            onChange={handleChange}
            required
            step="0.01"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="month" className="form-label">
            Month
          </label>
          <input
            type="number"
            id="month"
            name="month"
            className="form-control"
            value={formData.month}
            onChange={handleChange}
            required
            min="1"
            max="12"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateBudget;
