import React, { useState, useEffect } from "react";
import { User, Tag, Bell, Lock, SquarePen, X } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import logo from "../img/taxpal1.png";
import { toast } from "react-toastify";


function Settings() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'fa-bars' },
    { name: 'Transactions', path: '/transactions', icon: 'fa-check' },
    { name: 'Budget', path: '/budget', icon: 'fa-money-bill' },
    { name: 'Tax Estimator', path: '/tax-estimator', icon: 'fa-money-bill-trend-up' },
    { name: 'Reports', path: '/reports', icon: 'fa-file' },
    { name: 'Settings', path: '/setting-page', icon: 'fa-gear' }
  ];

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = menuItems.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const [activeTab, setActiveTab] = useState("expense");
  const [expenseCategories, setExpenseCategories] = useState(() => {
    const saved = localStorage.getItem("expenseCategories");
    return saved
      ? JSON.parse(saved)
      : [
          { color: "red", name: "Travel" },
          { color: "blue", name: "Marketing" },
          { color: "purple", name: "Software Subscription" },
          { color: "orange", name: "Meals & Entertainment" },
          { color: "brown", name: "Office Rent" },
          { color: "green", name: "Professional Development" },
          { color: "gold", name: "Utilities" },
          { color: "gray", name: "Business Expenses" },
        ];
  });

  const [incomeCategories, setIncomeCategories] = useState(() => {
    const saved = localStorage.getItem("incomeCategories");
    return saved
      ? JSON.parse(saved)
      : [
          { color: "green", name: "Salary" },
          { color: "teal", name: "Freelance" },
          { color: "#10b981", name: "Investments" },
          { color: "#22c55e", name: "Interest" },
        ];
  });

  const handleAddCategory = () => {
    const name = window.prompt("Enter new category name");
    if (!name || !name.trim()) return;
    const color =
      window.prompt("Enter color (CSS name or hex, e.g. #10b981)", "gray") ||
      "gray";
    if (activeTab === "expense") {
      setExpenseCategories((prev) => [...prev, { name: name.trim(), color }]);
    } else {
      setIncomeCategories((prev) => [...prev, { name: name.trim(), color }]);
    }
  };

  const handleEditCategory = (index) => {
    const list = activeTab === "expense" ? expenseCategories : incomeCategories;
    const current = list[index];
    const name = window.prompt("Edit category name", current.name);
    if (!name || !name.trim()) return;
    const color = window.prompt("Edit color", current.color) || current.color;
    if (activeTab === "expense") {
      setExpenseCategories((prev) => {
        const next = [...prev];
        next[index] = { name: name.trim(), color };
        return next;
      });
    } else {
      setIncomeCategories((prev) => {
        const next = [...prev];
        next[index] = { name: name.trim(), color };
        return next;
      });
    }
  };

  const handleDeleteCategory = (index) => {
    if (!window.confirm("Delete this category?")) return;
    if (activeTab === "expense") {
      setExpenseCategories((prev) => prev.filter((_, i) => i !== index));
    } else {
      setIncomeCategories((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "expenseCategories",
      JSON.stringify(expenseCategories)
    );
  }, [expenseCategories]);

  useEffect(() => {
    localStorage.setItem("incomeCategories", JSON.stringify(incomeCategories));
  }, [incomeCategories]);

  return (
    <div style={{ fontFamily: "Aboreto, system-ui", padding: "70px" }}>
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
                className={`search-input ${showSearch ? 'active' : ''}`}
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
                    setTimeout(() => document.querySelector('.search-input').focus(), 100);
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
                        setSearchTerm('');
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
          <i className="fa fa-bell"></i>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzBpnouxDuF063trW5gZOyXtyuQaExCQVMYA&s"
            alt="User Profile"
            className="avatar"
          />
          <button
            className="logout-btn"
            onClick={() => {
              const id = "logoutConfirm";
              if (toast.isActive(id)) return;
              toast(
                ({ closeToast }) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      alignItems: "center",
                      textAlign: "center",
                      marginLeft: "60px",
                    }}
                  >
                    <div style={{ fontWeight: 700, color: "#111827" }}>
                      Confirm Logout
                    </div>
                    <div style={{ color: "#4b5563", fontSize: 14 }}>
                      Are you sure you want to log out?
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        marginTop: 6,
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() => {
                          closeToast();
                        }}
                        style={{
                          padding: "8px 14px",
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          background: "#ffffff",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          closeToast();
                          localStorage.removeItem("token");
                          localStorage.removeItem("user");
                          toast.info("Logged out successfully", {
                            toastId: "logoutOnce",
                          });
                          navigate("/");
                        }}
                        style={{
                          padding: "8px 14px",
                          borderRadius: 8,
                          border: "none",
                          background: "#207ed0",
                          color: "#ffffff",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                ),
                {
                  toastId: id,
                  position: "top-center",
                  autoClose: false,
                  closeOnClick: false,
                  draggable: false,
                  closeButton: false,
                  hideProgressBar: true,
                  icon: false,
                  style: {
                    width: "360px",
                    margin: "0 auto",
                    textAlign: "center",
                    borderRadius: 12,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                    padding: "16px 20px",
                  },
                }
              );
            }}
          >
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
                <span style={{ marginLeft: "16px" }} className="text">
                  Budget
                </span>
              </Link>
            </li>
            <li>
              <Link to="/tax-estimator">
                <i className="fa-solid fa-money-bill-trend-up"></i>
                <span className="text">Tax Estimator</span>
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fa-solid fa-file"></i>
                <span style={{ marginLeft: "23px" }} className="text">
                  Reports
                </span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-bottom">
          <button className="settings-btn">
            <i style={{ width: "30px" }} className="fa-solid fa-gear"></i>
            <span style={{ marginLeft: "4px" }}>Settings</span>
          </button>
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

      {/* Main Content */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "330px",
          marginRight: "-70px",
        }}
      >
        {/* Header Box */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px 20px",
            background: "#fff",
            marginBottom: "10px",
            width: "96.5%",
          }}
        >
          <h2 style={{ margin: 0, color: "black" }}>Settings</h2>
          <p style={{ margin: 0, color: "#0000007f" }}>
            Manage your account settings and preferences
          </p>
        </div>

        <div style={{ display: "flex", gap: "20px", flex: 1 }}>
          {/* Left Box */}
          <div
            style={{
              flexBasis: "370px",
              flexShrink: 0,
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "30px",
              color: "black",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li
                style={{
                  marginBottom: "15px",
                  padding: "8px",
                  color: "#0000007f",
                }}
              >
                <User size={20} color="#999" /> Profile
              </li>
              <li
                style={{
                  marginBottom: "15px",
                  padding: "8px",
                  border: "1px solid #0000007f",
                  borderRadius: "8px",
                  background: "#f0f8ff",
                  color: "#0000007f",
                }}
              >
                <Tag size={20} color="#999" /> Categories
              </li>
              <li
                style={{
                  marginBottom: "15px",
                  padding: "8px",
                  color: "#0000007f",
                }}
              >
                <Bell size={20} color="#999" /> Notification
              </li>
              <li style={{ padding: "8px", color: "#0000007f" }}>
                <Lock size={20} color="#999" /> Security
              </li>
            </ul>
          </div>

          {/* Right Box */}
          <div
            style={{
              flexBasis: "710px",
              height: "72vh",
              flexShrink: 0,
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "30px",
              color: "#0000007f",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ marginTop: "0", color: "black" }}>
              Category Management
            </h3>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <button
                onClick={() => setActiveTab("expense")}
                style={{
                  border:
                    activeTab === "expense"
                      ? "1px solid black"
                      : "1px solid transparent",
                  padding: "5px 15px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  background: activeTab === "expense" ? "white" : "transparent",
                  cursor: "pointer",
                }}
              >
                Expense Categories
              </button>
              <button
                onClick={() => setActiveTab("income")}
                style={{
                  border:
                    activeTab === "income"
                      ? "1px solid black"
                      : "1px solid transparent",
                  background: activeTab === "income" ? "white" : "transparent",
                  cursor: "pointer",
                  color: "black",
                  fontSize: "16px",
                  padding: "5px 15px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                Income Categories
              </button>
            </div>

            {/* Categories List */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
              {(activeTab === "expense"
                ? expenseCategories
                : incomeCategories
              ).map((cat, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <span>
                    <span
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: cat.color,
                        marginRight: "10px",
                      }}
                    ></span>
                    {cat.name}
                  </span>
                  <span style={{ cursor: "pointer", color: "#999" }}>
                    <SquarePen
                      size={18}
                      color="#999"
                      style={{ cursor: "pointer" }}
                      title="Edit"
                      onClick={() => handleEditCategory(idx)}
                    />{" "}
                    <X
                      size={18}
                      color="#999"
                      title="Delete"
                      onClick={() => handleDeleteCategory(idx)}
                    />
                  </span>
                </li>
              ))}
            </ul>

            {/* Add New Category Button */}
            <button
              style={{
                marginTop: "-20px",
                marginBottom: "-20px",
                width: "100%",
                padding: "15px",
                backgroundColor: "#207ed0",
                color: "white",
                fontWeight: "bold",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
              onClick={handleAddCategory}
            >
              + Add New Category
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
