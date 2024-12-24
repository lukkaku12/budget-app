import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

const CreateBudget = () => {
  const [formData, setFormData] = useState({
    name: "",
    category_name: "",
    amount: "",
    month: "",
  });
  
  const [categories, setCategories] = useState<string[]>([]); // Para almacenar las categorías desde la API
  const [customCategory, setCustomCategory] = useState<string>(""); // Para manejar la categoría personalizada
  const [categoryFilter, setCategoryFilter] = useState<string>(""); // Filtro de categoría
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false); // Para verificar si se elige "Otro"

  const navigate = useNavigate();

  // Obtener categorías desde la API
  const fetchCategories = async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        "https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setCategories(response.data.map((cat: { name: string }) => cat.name)); // Asumimos que la respuesta contiene un array de objetos con un campo 'name'
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  };

  // Llamar a fetchCategories cuando el componente se monta
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" || name === "month" ? Number(value) : value,
    });
  };

  // Cambiar categoría seleccionada
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategoryFilter(value);
    setIsCustomCategory(value === "Otro"); // Si es "Otro", activamos el campo de texto personalizado
    if (value !== "Otro") {
      setCustomCategory(""); // Limpiamos el campo de texto si no es "Otro"
    }
  };

  // Manejar el cambio de la categoría personalizada
  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCategory(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get('token');
    
    // Si el campo de "Otro" está activo, usamos la categoría personalizada
    const category_name = isCustomCategory ? customCategory : categoryFilter;

    const newFormData = {
      ...formData,
      category_name, // Usamos la categoría seleccionada o personalizada
    };

    try {
      const response = await axios.post(
        "https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/budgets", 
        newFormData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        fill="currentColor"
        className="bi bi-x"
        viewBox="0 0 16 16"
        onClick={() => navigate("/home")}
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
          <select
            id="category_name"
            name="category_name"
            className="form-control"
            value={categoryFilter}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select a Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
            <option value="Otro">Otro</option>
          </select>
          {isCustomCategory && (
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Escribe tu categoría"
              value={customCategory}
              onChange={handleCustomCategoryChange}
              required
            />
          )}
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