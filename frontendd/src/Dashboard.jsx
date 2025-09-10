import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Dashboard.css";
import Income from "./Income.jsx";
import Expenses from "./Expenses.jsx";
import logo from "../img/taxpal1.png";
function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");

  // modal states
  const [showIncome, setShowIncome] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);

  // transactions state (persisted in localStorage)
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("transactions");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    } catch (e) {}
  }, [transactions]);

  const handleAddTransaction = (tx) => {
    setTransactions((prev) => [{ id: Date.now(), ...tx }, ...prev]);
  };

  //dark mode
  // const [darkMode, setDarkMode] = useState(() => {
  //   const saved = localStorage.getItem("darkMode");
  //   return saved === "true";
  // });

  // useEffect(() => {
  //   document.documentElement.classList.toggle("dark", darkMode);
  //   localStorage, setItem("darkMode", String(darkMode));
  // }, [darkMode]);

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setUserName(user.name || "User");
        toast.success(`Welcome back, ${user.name || "User"}!`);
      } catch (err) {
        console.error("Error parsing user info:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
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
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="sidebar">
        <div className="menu-title">MENU</div>
        <nav className="nav-menu">
          <ul>
            <li
              className={
                useLocation().pathname === "/dashboard" ? "active" : ""
              }
            >
              <Link to="/dashboard">
                <i className="fa-solid fa-bars"></i>
                <span className="text">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fa-solid fa-check"></i>
                <span className="text">Transactions</span>
              </Link>
            </li>
            <li
              className={useLocation().pathname === "/budget" ? "active" : ""}
            >
              <Link to="/budget">
                <i className="fa-solid fa-money-bill"></i>
                <span className="text">Budget</span>
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fa-solid fa-money-bill-trend-up"></i>
                <span className="text">Tax Estimator</span>
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fa-solid fa-file"></i>
                <span className="text">Reports</span>
              </Link>
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

      <div className="dashboard-content">
        <div className="welcome-row">
          <h2>Welcome, {userName}</h2>
          <div className="action-buttons">
            <button className="income-btn" onClick={() => setShowIncome(true)}>
              Record New Income
            </button>
            <button
              className="expense-btn"
              onClick={() => setShowExpenses(true)}
            >
              Record New Expense
            </button>
          </div>
        </div>

        <div className="summary-cards">
          <div className="summary-card income">
            <span>Monthly Income</span>
            <h3>
              $0.0 <span className="up">↑ 59%</span>
            </h3>
          </div>
          <div className="summary-card expenses">
            <span>Monthly Expenses</span>
            <h3>
              $0.0 <span className="down">↓ 59%</span>
            </h3>
          </div>
          <div className="summary-card tax">
            <span>Estimated tax due</span>
            <h3>
              $0.00 <span className="down">↓</span>
            </h3>
          </div>
          <div className="summary-card savings">
            <span>Savings Rate</span>
            <h3>
              0.0% <span className="down">↓</span>
            </h3>
          </div>
        </div>

        <div className="charts-row">
          <div className="income-expense-chart">
            <div className="chart-header">
              <span>Income vs Expense</span>
              <select>
                <option>This Week</option>
              </select>
            </div>
            <div className="bar-chart-placeholder">Bar Chart Here</div>
          </div>
          <div className="expense-breakdown">
            <div className="chart-header">
              <span>Expense Breakdown</span>
            </div>
            <div className="pie-chart-placeholder">Pie Chart Here</div>
            <div className="legend">
              <span className="business">Business: 2300</span>
              <span className="food">Food: 1500</span>
              <span className="others">Others: 274</span>
            </div>
          </div>
        </div>

        <div className="transactions-panel">
          <h3>Recent Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4">No Transactions Yet, record new income or expenses!</td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td>{t.description}</td>
                    <td>{t.category}</td>
                    <td style={{ color: t.type === "income" ? "#34cc85" : "#e25454" }}>
                      {t.type === "income" ? "+" : "-"}${Number(t.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {showIncome && (
        <div className="modal-overlay">
          <Income
            onClose={() => setShowIncome(false)}
            onSave={(data) => {
              handleAddTransaction({ ...data, type: "income" });
              setShowIncome(false);
            }}
          />
        </div>
      )}
      {showExpenses && (
        <div className="modal-overlay">
          <Expenses
            onClose={() => setShowExpenses(false)}
            onSave={(data) => {
              handleAddTransaction({ ...data, type: "expense" });
              setShowExpenses(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
