import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import logo from "../img/taxpal1.png";

function Budget() {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("May, 2025");
  const [description, setDescription] = useState("");

  const [budgets, setBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem("budgets");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("budgets", JSON.stringify(budgets));
    } catch (e) {}
  }, [budgets]);

  const handleCreateBudget = (e) => {
    e.preventDefault();
    if (!category.trim() || !amount || !month.trim()) return;
    const entry = {
      id: Date.now(),
      category: category.trim(),
      budget: parseFloat(amount),
      spent: 0,
      month: month.trim(),
      description: description.trim(),
    };
    setBudgets((prev) => [entry, ...prev]);
    setCategory("");
    setAmount("");
    setDescription("");
  };

  const handleEditRow = (id) => {
    const idx = budgets.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const b = budgets[idx];
    const newCategory = window.prompt("Edit category", b.category) || b.category;
    const newBudgetStr = window.prompt("Edit budget amount", String(b.budget)) || String(b.budget);
    const newSpentStr = window.prompt("Edit spent amount", String(b.spent || 0)) || String(b.spent || 0);
    const newMonth = window.prompt("Edit month", b.month) || b.month;
    const newDescription = window.prompt("Edit description", b.description || "") || b.description || "";
    const newBudget = parseFloat(newBudgetStr);
    const newSpent = parseFloat(newSpentStr);
    if (Number.isNaN(newBudget) || Number.isNaN(newSpent)) return;
    setBudgets((prev) => {
      const copy = [...prev];
      copy[idx] = { ...b, category: newCategory, budget: newBudget, spent: newSpent, month: newMonth, description: newDescription };
      return copy;
    });
  };

  return (
    <div>
      <div className="navbar">
        <div className="brand">
          <img src={logo} alt="Taxpal Logo" />
          <span className="tagline">Your trusted tax partner</span>
        </div>
        <div className="nav-icons">
          <i className="fa fa-search"></i>
          <i className="fa fa-bell"></i>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzBpnouxDuF063trW5gZOyXtyuQaExCQVMYA&s"
            alt="User Profile"
            className="avatar"
          />
          <button className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="sidebar">
        <div className="menu-title">MENU</div>
        <nav className="nav-menu">
          <ul>
            <li>
              <Link to="/dashboard">
                <i className="fa-solid fa-bars"></i>
                <span className="text">Dashboard</span>
              </Link>
            </li>
            <li>
              <i className="fa-solid fa-check"></i>
              <span className="text">Transactions</span>
            </li>
            <li>
              <i className="fa-solid fa-money-bill"></i>
              <span className="text">Budget</span>
            </li>
            <li>
              <i className="fa-solid fa-money-bill-trend-up"></i>
              <span className="text">Tax Estimator</span>
            </li>
            <li>
              <i className="fa-solid fa-file"></i>
              <span className="text">Reports</span>
            </li>
          </ul>
        </nav>
        <div className="sidebar-bottom">
          <Link to="/setting-page" className="settings-btn">
            <i style={{ width: "30px" }} className="fa-solid fa-gear"></i>
            <span style={{ marginLeft: "19px" }}>Settings</span>
          </Link>
          <div className="dark-mode-toggle">
            <i style={{ width: "20px" }} className="fa-solid fa-moon"></i>
            <span style={{ marginLeft: "21px" }}>Dark Mode</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
      <div className="modal">
        <h2>Create New Budget</h2>

        <form onSubmit={handleCreateBudget}>
          <div className="form-row">
            <div className="form-group">
              <label style={{ marginLeft: "30px" }}>Category</label>
              <input
                style={{ width: "87%", marginLeft: "30px" }}
                type="text"
                placeholder="e.g Food"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label style={{ marginLeft: "40px" }}>Budget Amount</label>
              <input
                style={{ width: "83%", marginLeft: "39px" }}
                type="number"
                step="0.01"
                placeholder="$ 0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ marginLeft: "30px" }}>Month</label>
            <input
              style={{ width: "41.6%", marginLeft: "30px" }}
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label style={{ marginLeft: "30px" }}>Description (Optional)</label>
            <textarea
              placeholder="e.g web design project"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="actions">
            <button type="button" className="btn btn-cancel" onClick={() => { setCategory(""); setAmount(""); setDescription(""); }}>Clear</button>
            <button type="submit" className="btn btn-primary">Create Budget</button>
          </div>
        </form>

        <div className="budget-table">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>Month</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {budgets.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "#999" }}>
                    No budgets yet. Create one above.
                  </td>
                </tr>
              ) : (
                budgets.map((b) => {
                  const remaining = Math.max(0, Number(b.budget) - Number(b.spent || 0));
                  return (
                    <tr key={b.id}>
                      <td>{b.category}</td>
                      <td>${Number(b.budget).toFixed(2)}</td>
                      <td>${Number(b.spent || 0).toFixed(2)}</td>
                      <td>${remaining.toFixed(2)}</td>
                      <td>{b.month}</td>
                      <td>
                        <button onClick={() => handleEditRow(b.id)}>Edit</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Budget;
