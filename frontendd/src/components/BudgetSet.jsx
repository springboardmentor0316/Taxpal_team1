import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "../Dashboard.css";
import {
  getNotifications,
  markNotificationAsRead,
  getUnreadCount
} from "../config/notificationService";
import logo from "../../img/taxpal1.png";

function Budget() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  // Load notifications
  useEffect(() => {
    setNotifications(getNotifications());
    setUnreadCount(getUnreadCount());
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "fa-bars" },
    { name: "Transactions", path: "/transactions", icon: "fa-check" },
    { name: "Budget", path: "/budget", icon: "fa-money-bill" },
    {
      name: "Tax Estimator",
      path: "/tax-estimator",
      icon: "fa-money-bill-trend-up",
    },
    { name: "Reports", path: "/report", icon: "fa-file" },
    { name: "Settings", path: "/setting-page", icon: "fa-gear" },
  ];

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = menuItems.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("May, 2025");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const savedCategories = localStorage.getItem("expenseCategories");
    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories);
        setCategories(parsedCategories);
      } catch (e) {
        console.error("Error parsing expense categories:", e);
      }
    }
  }, []);

  const [budgets, setBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem("budgets");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const transactions = useMemo(() => {
    try {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) return [];
      const u = JSON.parse(rawUser);
      const key = u?.email ? `transactions:${u.email}` : null;
      if (!key) return [];
      const rawTx = localStorage.getItem(key);
      return rawTx ? JSON.parse(rawTx) : [];
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("budgets", JSON.stringify(budgets));
    } catch (e) {}
  }, [budgets]);

  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  // Click outside to close notifications
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  // Click outside to close notifications
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateBudget = (e) => {
    e.preventDefault();
    if (!category.trim()) {
      toast.warning("Please enter a category");
      return;
    }
    if (/\d/.test(category)) {
      toast.error("Category should not contain numbers");
      return;
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      toast.error("Budget amount must be a valid number greater than 0");
      return;
    }
    if (!amount) {
      toast.warning("Please enter a budget amount");
      return;
    }
    if (!month.trim()) {
      toast.warning("Please enter a month");
      return;
    }
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
    const newCategory =
      window.prompt("Edit category", b.category) || b.category;
    const newBudgetStr =
      window.prompt("Edit budget amount", String(b.budget)) || String(b.budget);
    const newMonth = window.prompt("Edit month", b.month) || b.month;
    const newDescription =
      window.prompt("Edit description", b.description || "") ||
      b.description ||
      "";
    const newBudget = parseFloat(newBudgetStr);
    if (Number.isNaN(newBudget)) return;
    setBudgets((prev) => {
      const copy = [...prev];
      copy[idx] = {
        ...b,
        category: newCategory,
        budget: newBudget,
        month: newMonth,
        description: newDescription,
      };
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
          <div className="search-container">
            <div className="search-wrapper">
              <input
                type="text"
                className={`search-input ${showSearch ? "active" : ""}`}
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onBlur={() => {
                  setTimeout(() => {
                    setSearchResults([]);
                    if (!searchTerm) {
                      setShowSearch(false);
                    }
                  }, 200);
                }}
              />
              <i
                className="fa fa-search search-icon"
                onClick={() => {
                  setShowSearch(!showSearch);
                  if (!showSearch) {
                    setTimeout(
                      () => document.querySelector(".search-input").focus(),
                      100
                    );
                  }
                }}
              ></i>
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((item) => (
                    <div
                      key={item.path}
                      className="search-result-item"
                      onClick={() => {
                        navigate(item.path);
                        setSearchTerm("");
                        setSearchResults([]);
                        setShowSearch(false);
                      }}
                    >
                      <i className={`fa-solid ${item.icon}`}></i>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="notification-container" style={{ position: 'relative' }}>
            <i 
              className="fa fa-bell" 
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadCount(0);
                notifications.forEach(n => {
                  if (!n.read) {
                    markNotificationAsRead(n.id);
                  }
                });
                setNotifications(getNotifications());
              }}
            ></i>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#f44336',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '12px',
              }}>
                {notifications.length}
              </span>
            )}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                width: '300px',
                maxHeight: '400px',
                overflowY: 'auto',
                background: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                zIndex: 1000,
              }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                    No new notifications
                  </div>
                ) : (
                  <div>
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '12px',
                          borderBottom: '1px solid #eee',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                            {notification.title}
                          </div>
                          <div style={{ fontSize: '14px', color: '#666' }}>
                            {notification.message}
                          </div>
                          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                            {new Date(notification.date).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="profile-container">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzBpnouxDuF063trW5gZOyXtyuQaExCQVMYA&s"
              alt="User Profile"
              className="avatar"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
            />
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzBpnouxDuF063trW5gZOyXtyuQaExCQVMYA&s"
                    alt="Profile"
                  />
                  <div className="profile-info">
                    <h4>{user?.name || 'User'}</h4>
                    <p>{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <div className="profile-menu">
                  <Link to="/setting-page" className="profile-menu-item">
                    <i className="fas fa-user"></i>
                    View Profile
                  </Link>
                  <div
                    className="profile-menu-item"
                    onClick={() => {
                      const id = "logoutConfirm";
                      if (toast.isActive(id)) return;
                      toast(
                        ({ closeToast }) => (
                          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", textAlign: "center", marginLeft: "60px" }}>
                            <div style={{ fontWeight: 700, color: "#111827" }}>Confirm Logout</div>
                            <div style={{ color: "#4b5563", fontSize: 14 }}>Are you sure you want to log out?</div>
                            <div style={{ display: "flex", gap: 10, marginTop: 6, justifyContent: "center" }}>
                              <button onClick={() => closeToast()} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #d1d5db", background: "#ffffff", cursor: "pointer" }}>Cancel</button>
                              <button onClick={() => {
                                closeToast();
                                localStorage.removeItem("token");
                                localStorage.removeItem("user");
                                toast.info("Logged out successfully", { toastId: "logoutOnce" });
                                navigate("/");
                              }} style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: "#207ed0", color: "#ffffff", cursor: "pointer", fontWeight: 600 }}>Confirm</button>
                            </div>
                          </div>
                        ),
                        { toastId: id, position: "top-center", autoClose: false, closeOnClick: false, draggable: false, closeButton: false, hideProgressBar: true, icon: false, style: { width: "360px", margin: "0 auto", textAlign: "center", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.12)", padding: "16px 20px" } }
                      );
                    }}
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>

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
            <li className={useLocation().pathname === "/transactions" ? "active" : ""}>
              <Link to="/transactions">
                <i className="fa-solid fa-check"></i>
                <span className="text">Transactions</span>
              </Link>
            </li>
            <li className={useLocation().pathname === "/budget" ? "active" : ""}>
              <i className="fa-solid fa-money-bill"></i>
              <span style={{ marginLeft: "16px" }} className="text">
                Budget
              </span>
            </li>
            <li>
              <Link to="/tax-estimator">
                <i className="fa-solid fa-money-bill-trend-up"></i>
                <span className="text">Tax Estimator</span>
              </Link>
            </li>
            <li>
              <Link to="/report">
              <i className="fa-solid fa-file"></i>
              <span style={{ marginLeft: "23px" }} className="text">
                Reports
              </span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-bottom">
          <Link to="/setting-page" className="settings-btn">
            <i style={{ width: "30px" }} className="fa-solid fa-gear"></i>
            <span style={{ marginLeft: "4px" }}>Settings</span>
          </Link>
          <div className="dark-mode-toggle">
            <i style={{ width: "20px" }} className="fa-solid fa-moon"></i>
            <span style={{ marginLeft: "13px" }}>Dark Mode</span>
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
              <select
                style={{
                  width: "91%",
                  marginLeft: "30px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "20px",
                  fontSize: "14px",
                  background: "#fff",
                }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label style={{ marginLeft: "40px" }}>Budget Amount</label>
              <input
                style={{ width: "83%", marginLeft: "39px" }}
                type="number"
                step="0.01"
                placeholder="₹ 0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ marginLeft: "30px" }}>Month</label>
            <input
              style={{
                width: "43.4%",
                marginLeft: "30px",
                border: "1px solid #ccc",
                borderRadius: "20px",
              }}
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
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => {
                setCategory("");
                setAmount("");
                setDescription("");
              }}
            >
              Clear
            </button>
            <button type="submit" className="btn btn-primary">
              Create Budget
            </button>
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
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", color: "#999" }}
                  >
                    No budgets yet. Create one above.
                  </td>
                </tr>
              ) : (
                budgets.map((b) => {
                  const monthStr = (b.month || "").trim();
                  const [labelMonth, labelYear] = (() => {
                    const cleaned = monthStr.replace(",", "").trim();
                    const parts = cleaned.split(/\s+/);
                    return [parts[0] || "", Number(parts[1]) || undefined];
                  })();
                  const monthIndex = (() => {
                    const names = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ];
                    const i = names.findIndex(
                      (n) =>
                        n.toLowerCase() === labelMonth.slice(0, 3).toLowerCase()
                    );
                    return i >= 0 ? i : undefined;
                  })();
                  const computedSpent = transactions.reduce((sum, t) => {
                    if (t.type !== "expense") return sum;
                    if (
                      (t.category || "").toString().toLowerCase() !==
                      (b.category || "").toString().toLowerCase()
                    )
                      return sum;
                    if (!t.date) return sum;
                    const d = new Date(t.date);
                    if (isNaN(d)) return sum;
                    if (monthIndex === undefined || labelYear === undefined)
                      return sum;
                    if (
                      d.getMonth() === monthIndex &&
                      d.getFullYear() === labelYear
                    ) {
                      return sum + Number(t.amount || 0);
                    }
                    return sum;
                  }, 0);
                  const remaining = Math.max(
                    0,
                    Number(b.budget) - Number(computedSpent)
                  );
                  return (
                    <tr key={b.id}>
                      <td>{b.category}</td>
                      <td>₹{Number(b.budget).toFixed(2)}</td>
                      <td>₹{Number(computedSpent).toFixed(2)}</td>
                      <td>₹{remaining.toFixed(2)}</td>
                      <td>{b.month}</td>
                      <td>
                        <button
                          style={{
                            backgroundColor: "#207ED0",
                            color: "#fff",
                            borderRadius: "5px",
                            padding: "5px 10px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleEditRow(b.id)}
                        >
                          Edit
                        </button>
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
