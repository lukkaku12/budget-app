import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

const CreateBudget = () => {
  const [formData, setFormData] = useState({ name: "", category_name: "", amount: "", month: "" });
  const [categories, setCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get("https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/categories", { headers: { Authorization: `Bearer ${token}` } });
      setCategories(response.data.map((cat: { name: string }) => cat.name));
    } catch (error) { console.log("Error fetching categories", error); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "amount" || name === "month" ? Number(value) : value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategoryFilter(value);
    setIsCustomCategory(value === "Otro");
    if (value !== "Otro") setCustomCategory("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("token");
    const category_name = isCustomCategory ? customCategory : categoryFilter;
    const newFormData = { ...formData, category_name };
    try {
      await axios.post("https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/budgets", newFormData, { headers: { Authorization: `Bearer ${token}` } });
      navigate("/home");
    } catch (error) { console.log(error); }
  };

  return (
    <div className="form-page">
      <header className="topbar">
        <div><h1>Create budget</h1><p>Design a new monthly envelope with category, amount, and timeframe.</p></div>
        <button className="pp-btn pp-btn-secondary" onClick={() => navigate("/home")}>Close</button>
      </header>
      <section className="form-layout">
        <aside className="form-aside">
          <span className="eyebrow">Budget builder</span>
          <h2 className="mt-3">Make your next spending plan feel intentional.</h2>
          <p className="text-white-50">Use a concise name, assign a category, and set the month you want this budget to govern.</p>
        </aside>
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-field"><label htmlFor="name">Budget name</label><input className="pp-input" type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="May essentials" required /></div>
          <div className="form-field"><label htmlFor="category_name">Category</label><select id="category_name" name="category_name" className="pp-select" value={categoryFilter} onChange={handleCategoryChange} required><option value="">Select a category</option>{categories.map((category, index) => <option key={index} value={category}>{category}</option>)}<option value="Otro">Create custom category</option></select></div>
          {isCustomCategory && <div className="form-field"><label htmlFor="customCategory">Custom category</label><input id="customCategory" type="text" className="pp-input" placeholder="Write your category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} required /></div>}
          <div className="form-field"><label htmlFor="amount">Amount</label><input className="pp-input" type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} placeholder="1200.00" required step="0.01" /></div>
          <div className="form-field"><label htmlFor="month">Month number</label><input className="pp-input" type="number" id="month" name="month" value={formData.month} onChange={handleChange} placeholder="1-12" required min="1" max="12" /></div>
          <div className="action-row"><button type="submit" className="pp-btn pp-btn-primary">Create budget</button><button type="button" className="pp-btn pp-btn-ghost" onClick={() => navigate("/home")}>Cancel</button></div>
        </form>
      </section>
    </div>
  );
};

export default CreateBudget;
