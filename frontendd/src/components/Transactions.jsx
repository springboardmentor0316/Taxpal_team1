import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../Dashboard.css";
import logo from "../../img/taxpal1.png";
import {
  getNotifications,
  markNotificationAsRead,
  getUnreadCount,
} from "../config/notificationService";

function Transactions() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  const [transactions, setTransactions] = useState(() => {
    const storedTransactions = localStorage.getItem('taxTransactions');
    const allTransactions = storedTransactions ? JSON.parse(storedTransactions) : [];
    return allTransactions.filter(txn => txn.amount !== 0 && txn.amount !== "0");
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedTransactions = localStorage.getItem('taxTransactions');
      if (updatedTransactions) {
        const allTransactions = JSON.parse(updatedTransactions);
        const nonZeroTransactions = allTransactions.filter(txn => txn.amount !== 0 && txn.amount !== "0");
        setTransactions(nonZeroTransactions);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".notification-container")) {
        setShowNotifications(false);
      }
      if (
        !event.target.closest(".profile-dropdown") &&
        !event.target.closest(".avatar")
      ) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    { name: "Reports", path: "/reports", icon: "fa-file" },
  ];

  useEffect(() => {
    setNotifications(getNotifications());
    setUnreadCount(getUnreadCount());
  }, []);

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setUserName(user.name || "User");
      } catch (err) {
        console.error("Error parsing user info:", err);
      }
    }
  }, []);

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

  const handleLogout = () => {
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
              onClick={closeToast}
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
  };

  return (
    <div
      className="dashboard-container"
      style={{
        minHeight: "100vh",
        width: "100%",
      }}
    >
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

          <div
            className="notification-container"
            style={{ position: "relative" }}
          >
            <i
              className="fa fa-bell"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadCount(0);
                notifications.forEach((n) => {
                  if (!n.read) markNotificationAsRead(n.id);
                });
                setNotifications(getNotifications());
              }}
            ></i>
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "#f44336",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                }}
              >
                {unreadCount}
              </span>
            )}
            {showNotifications && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: "0",
                  width: "300px",
                  maxHeight: "400px",
                  overflowY: "auto",
                  background: "white",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  zIndex: 1000,
                }}
              >
                {notifications.length === 0 ? (
                  <div
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    No new notifications
                  </div>
                ) : (
                  <div>
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "12px",
                          borderBottom: "1px solid #eee",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              marginBottom: "4px",
                            }}
                          >
                            {notification.title}
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#666",
                            }}
                          >
                            {notification.message}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#999",
                              marginTop: "4px",
                            }}
                          >
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

          <div style={{ position: "relative" }}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzBpnouxDuF063trW5gZOyXtyuQaExCQVMYA&s"
              alt="User Profile"
              className="avatar"
              onClick={() => setShowProfile(!showProfile)}
            />
            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzBpnouxDuF063trW5gZOyXtyuQaExCQVMYA&s"
                    alt="Profile"
                  />
                  <div className="profile-info">
                    <h4>{userName}</h4>
                    <p>
                      {JSON.parse(localStorage.getItem("user"))?.email ||
                        "user@example.com"}
                    </p>
                  </div>
                </div>
                <div className="profile-menu">
                  <Link to="/setting-page" className="profile-menu-item">
                    <i className="fa-solid fa-user"></i>
                    <span>View Profile</span>
                  </Link>
                  <div className="profile-menu-item" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span>Logout</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
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
            <li className={isActive("/transactions")}>
              <i className="fa-solid fa-check"></i>
              <span className="text">Transactions</span>
            </li>
            <li>
              <Link to="/budget">
                <i className="fa-solid fa-money-bill"></i>
                <span className="text">Budget</span>
              </Link>
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
                <span className="text">Reports</span>
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
            <i
              style={{
                width: "20px",
              }}
              className="fa-solid fa-moon"
            ></i>
            <span
              style={{
                marginLeft: "13px",
              }}
            >
              Dark Mode
            </span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px 20px",
            background: "#fff",
            marginBottom: "15px",
            marginTop: "-45px",
            width: "96.8%",
          }}
        >
          <h2 style={{ margin: 0, color: "#000",}}>Tax Payment Transactions</h2>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            paddingBottom: "20px"
          }}
        >
          {transactions.length === 0 ? (
            <div style={{ color: "#6b7280", textAlign: "center", padding: "40px 0" }}>No tax payments yet</div>
          ) : (
            transactions.map((txn) => (
              <div
                key={txn.id}
                style={{
                  background: "#ffffff",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  padding: 20,
                  width: "1192px",
                  marginRight: "-5px",
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#111827", fontSize: "18px", marginBottom: "4px" }}>
                      {txn.type}
                    </div>
                    {txn.description && (
                      <div style={{ color: "#6b7280", fontSize: "14px" }}>
                        {txn.description}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: txn.amount < 0 ? "#e25454" : "#34cc85",
                      fontSize: "20px",
                      marginLeft: "20px"
                    }}
                  >
                    {txn.amount < 0 ? "-" : "+"}₹
                    {Math.abs(txn.amount).toLocaleString()}
                  </div>
                </div>
                <div
                  style={{
                    color: "#6b7280",
                    marginTop: 8,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <i className="far fa-clock" style={{ fontSize: '12px' }}></i>
                  {txn.date} • {txn.time}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Transactions;
