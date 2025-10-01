import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config";
import {
  getNotifications,
  markNotificationAsRead,
  getUnreadCount
} from "./config/notificationService";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Dashboard.css";
import Income from "./Income.jsx";
import Expenses from "./Expenses.jsx";
import logo from "../img/taxpal1.png";

const COLOR_PRIMARY = "#1D4ED8"; 
const COLOR_SKY = "#38BDF8"; 
const PIE_COLORS = [
  "#1D4ED8", 
  "#2563EB", 
  "#3B82F6", 
  "#60A5FA", 
  "#93C5FD", 
  "#BFDBFE", 
  "#DBEAFE", 
  "#38BDF8", 
  "#22D3EE", 
  "#A5F3FC", 
  "#E0F2FE", 
  "#BAE6FD", 
];

const BAR_WIDTH = 13; 
const BAR_GAP = 5; 
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getCurrentUserKey() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u?.email ? `transactions:${u.email}` : null;
  } catch {
    return null;
  }
}

const easeOutQuad = t => t * (2 - t);

function AnimatedNumber({ value, duration = 1000 }) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const startValue = currentValue;
    const endValue = value;
    const startTime = performance.now();

    const animateValue = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const nextValue = startValue + (endValue - startValue) * easedProgress;

      setCurrentValue(nextValue);

      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };

    requestAnimationFrame(animateValue);
  }, [value, duration]);

  return Math.round(currentValue);
}

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const barRef = useRef(null);
  const [chartHeightPx, setChartHeightPx] = useState(180);
  const [animateIn, setAnimateIn] = useState(false);
  const [pieProgress, setPieProgress] = useState(0);
  const [chartRange, setChartRange] = useState("this_week");

  const [showIncome, setShowIncome] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications
  useEffect(() => {
    setNotifications(getNotifications());
    setUnreadCount(getUnreadCount());
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'fa-bars' },
    { name: 'Transactions', path: '/transactions', icon: 'fa-check' },
    { name: 'Budget', path: '/budget', icon: 'fa-money-bill' },
    { name: 'Tax Estimator', path: '/tax-estimator', icon: 'fa-money-bill-trend-up' },
    { name: 'Reports', path: '/report', icon: 'fa-file' },
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


  const [transactions, setTransactions] = useState(() => {
    try {
      const cacheKey = getCurrentUserKey();
      const cached = cacheKey ? localStorage.getItem(cacheKey) : null;
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await axios.get(`${API_BASE_URL}/transactions`, {
          headers: { ...getAuthHeaders() },
        });
        const items = (res.data?.items || []).map((t) => ({
          ...t,
          id: t._id || t.id,
        }));
        setTransactions(items);
        try {
          const cacheKey = getCurrentUserKey();
          if (cacheKey) localStorage.setItem(cacheKey, JSON.stringify(items));
        } catch {}
      } catch (err) {}
    }
    fetchTransactions();
  }, []);

  useEffect(() => {
    function recalc() {
      const h = barRef.current ? barRef.current.clientHeight : 200;
      setChartHeightPx(Math.max(100, h - 70));
    }
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  useEffect(() => {
    setAnimateIn(false);
    const t = setTimeout(() => setAnimateIn(true), 60);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    setAnimateIn(false);
    const t = setTimeout(() => setAnimateIn(true), 60);
    return () => clearTimeout(t);
  }, [transactions]);

  useEffect(() => {
    setPieProgress(0);
    const duration = 900; // ms
    let rafId;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setPieProgress(p);
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [transactions]);

  const handleAddTransaction = (tx) => {
    const normalized = { ...tx, id: tx._id || tx.id || String(Date.now()) };
    setTransactions((prev) => {
      const next = [normalized, ...prev];
      try {
        const cacheKey = getCurrentUserKey();
        if (cacheKey) localStorage.setItem(cacheKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount || 0), 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount || 0), 0);
    return { income, expenses };
  }, [transactions]);

  const { monthTotals, prevMonthTotals } = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    
    // For current month
    const startOfMonth = new Date(y, m, 1);
    const endOfMonth = new Date(y, m + 1, 0);
    
    // For previous month
    const startOfPrevMonth = new Date(y, m - 1, 1);
    const endOfPrevMonth = new Date(y, m, 0);

    let income = 0;
    let expenses = 0;
    let pincome = 0;
    let pexpenses = 0;

    for (const t of transactions) {
      if (!t.date) continue;
      const d = new Date(t.date);
      if (isNaN(d)) continue;

      const amount = Number(t.amount || 0);
      
      // Current month transactions
      if (d >= startOfMonth && d <= endOfMonth) {
        if (t.type === "income") {
          income += amount;
        } else if (t.type === "expense") {
          expenses += amount;
        }
      }
      // Previous month transactions
      else if (d >= startOfPrevMonth && d <= endOfPrevMonth) {
        if (t.type === "income") {
          pincome += amount;
        } else if (t.type === "expense") {
          pexpenses += amount;
        }
      }
    }

    // Ensure totals are non-negative
    income = Math.max(0, income);
    expenses = Math.max(0, expenses);
    pincome = Math.max(0, pincome);
    pexpenses = Math.max(0, pexpenses);

      return {
      monthTotals: { income, expenses },
      prevMonthTotals: { income: pincome, expenses: pexpenses },
    };
  }, [transactions]);

  // Recent Tax Payments: filter transactions that look like tax-related
  const recentTaxPayments = useMemo(() => {
    const looksLikeTax = (t) => {
      const cat = (t.category || '').toString().toLowerCase();
      const typ = (t.type || '').toString().toLowerCase();
      const desc = (t.description || '').toString().toLowerCase();
      return (
        cat.includes('tax') ||
        typ === 'tax' ||
        desc.includes('tax')
      );
    };
    const sorted = [...transactions]
      .filter(looksLikeTax)
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    return sorted.slice(0, 8);
  }, [transactions]);

  const formatINR = (n) => `₹${Number(n || 0).toFixed(2)}`;  const expenseBreakdown = useMemo(() => {
    const byCat = transactions
      .filter((t) => t.type === "expense")
      .reduce((map, t) => {
        const key = (t.category || "Other").toString();
        map[key] = (map[key] || 0) + Number(t.amount || 0);
        return map;
      }, {});
    const entries = Object.entries(byCat);
    const total = entries.reduce((s, [, v]) => s + v, 0);
    return { entries, total };
  }, [transactions]);

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setUserName(user.name || "User");
        const welcomed = sessionStorage.getItem("welcomedOnce");
        if (!welcomed) {
          toast.success(`Welcome back, ${user.name || "User"}!`, {
            toastId: "welcomeOnce",
          });
          sessionStorage.setItem("welcomedOnce", "true");
        }
      } catch (err) {
        console.error("Error parsing user info:", err);
      }
    }
  }, []);

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
              onClick={() => {
                closeToast();
              }}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                background: "#ffffff",
                cursor: "pointer",
                marginleft: "67px",
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
                marginleft: "67px",
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
    <div className="dashboard-container">
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
                {unreadCount}
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
          <div style={{ position: 'relative' }}>
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
                    <p>{JSON.parse(localStorage.getItem('user'))?.email || 'user@example.com'}</p>
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
              <Link to="/transactions">
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
            <li
              className={
                useLocation().pathname === "/tax-estimator" ? "active" : ""
              }
            >
              <Link to="/tax-estimator">
                <i className="fa-solid fa-money-bill-trend-up"></i>
                <span style={{ marginLeft: "18px" }} className="text">
                  Tax Estimator
                </span>
              </Link>
            </li>
            <li  className={
                useLocation().pathname === "/report" ? "active" : ""
              }>
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
              ₹<AnimatedNumber value={monthTotals.income} />{" "}
              {(() => {
                const curr = monthTotals.income;
                const prev = prevMonthTotals.income || 0;
                const change =
                  prev === 0
                    ? curr > 0
                      ? 100
                      : 0
                    : ((curr - prev) / prev) * 100;
                const up = change >= 0;
                return (
                  <span className="up">
                    {up ? "↑" : "↓"} {Math.abs(change).toFixed(0)}%
                  </span>
                );
              })()}
            </h3>
          </div>
          <div className="summary-card expenses">
            <span>Monthly Expenses </span>
            <h3>
              ₹<AnimatedNumber value={monthTotals.expenses} />{" "}
              {(() => {
                const curr = monthTotals.expenses;
                const prev = prevMonthTotals.expenses || 0;
                const change =
                  prev === 0
                    ? curr > 0
                      ? 100
                      : 0
                    : ((curr - prev) / prev) * 100;
                const up = change >= 0;
                return (
                  <span className="down">
                    {up ? "↑" : "↓"} {Math.abs(change).toFixed(0)}%
                  </span>
                );
              })()}
            </h3>
          </div>
          <div className="summary-card tax">
            <span>Estimated Tax Due</span>
            <h3>
              {(() => {
                const currentTaxData = JSON.parse(localStorage.getItem('taxEstimate') || '{"estimatedTax": 0}');
                const prevTaxData = JSON.parse(localStorage.getItem('prevTaxEstimate') || '{"estimatedTax": 0}');
                const curr = Number(currentTaxData.estimatedTax);
                const prev = Number(prevTaxData.estimatedTax);
                const change = prev === 0 ? (curr > 0 ? 100 : 0) : ((curr - prev) / prev) * 100;
                const up = change >= 0;
                
                return (
                  <>
                    ₹<AnimatedNumber value={curr} />{' '}

                  </>
                );
              })()}
            </h3>
          </div>
          <div className="summary-card savings">
            <span>Savings Rate</span>
            <h3>
              {(() => {
                const income = monthTotals.income;
                const expenses = monthTotals.expenses;
                const prevIncome = prevMonthTotals.income || 0;
                const prevExpenses = prevMonthTotals.expenses || 0;
                
                // Calculate current and previous savings rates
                const savings = Math.max(0, income - expenses);
                const prevSavings = Math.max(0, prevIncome - prevExpenses);
                const savingsRate = income > 0 ? Math.min(100, Math.max(0, (savings / income) * 100)) : 0;
                const prevSavingsRate = prevIncome > 0 ? Math.min(100, Math.max(0, (prevSavings / prevIncome) * 100)) : 0;
                
                // Calculate the percentage change in savings rate, capped at 100%
                let rateChange;
                if (prevSavingsRate === 0) {
                  rateChange = savingsRate > 0 ? Math.min(100, savingsRate) : 0;
                } else {
                  const change = ((savingsRate - prevSavingsRate) / prevSavingsRate) * 100;
                  rateChange = Math.min(100, Math.max(-100, change));
                }
                
                const isPositive = rateChange >= 0;
                
                return (
                  <>
                    {savingsRate.toFixed(1)}%{' '}
                    <span className={isPositive ? 'up' : 'down'}>
                      {isPositive ? '↑' : '↓'} {Math.min(100, Math.abs(rateChange)).toFixed(0)}%
                    </span>
                  </>
                );
              })()}
            </h3>
          </div>
        </div>

        <div className="charts-row">
          <div className="income-expense-chart">
            <div className="chart-header">
              <span>Income vs Expense</span>
              <select
                value={chartRange}
                onChange={(e) => setChartRange(e.target.value)}
              >
                <option value="last_24h">Last 24 Hours</option>
                <option value="this_week">This Week</option>
                <option value="end_of_month">End This Month</option>
              </select>
            </div>
            <div
              ref={barRef}
              className="bar-chart-placeholder"
              style={{
                position: "relative",
                height: "100%",
                width: "100%",
                marginTop: "-5px",
                padding: "6px 10px 34px 46px",
              }}
            >
              {(() => {
                const fmtDay = new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "2-digit",
                });
                const map = new Map();
                const now = new Date();
                const startOfMonth = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  1
                );
                const endOfMonth = new Date(
                  now.getFullYear(),
                  now.getMonth() + 1,
                  0
                );
                endOfMonth.setHours(23, 59, 59, 999);
                const startOfWeek = new Date(now);
                const day = startOfWeek.getDay();
                const diffToMonday = day === 0 ? -6 : 1 - day;
                startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
                startOfWeek.setHours(0, 0, 0, 0);
                const twentyFourHoursAgo = new Date(
                  now.getTime() - 24 * 60 * 60 * 1000
                );

                const isInRange = (dateObj) => {
                  if (chartRange === "end_of_month") {
                    return dateObj >= startOfMonth && dateObj <= endOfMonth;
                  }
                  if (chartRange === "last_24h") {
                    return dateObj >= twentyFourHoursAgo && dateObj <= now;
                  }
                  const endOfWeek = new Date(startOfWeek);
                  endOfWeek.setDate(endOfWeek.getDate() + 6);
                  endOfWeek.setHours(23, 59, 59, 999);
                  return dateObj >= startOfWeek && dateObj <= endOfWeek;
                };

                for (const t of transactions) {
                  if (!t.date) continue;
                  const d = new Date(t.date);
                  if (isNaN(d)) continue;
                  if (!isInRange(d)) continue;
                  const key = d.toISOString().slice(0, 10);
                  const entry = map.get(key) || {
                    income: 0,
                    expense: 0,
                    label: fmtDay.format(d),
                  };
                  const amt = Number(t.amount || 0);
                  if (t.type === "income") entry.income += amt;
                  else if (t.type === "expense") entry.expense += amt;
                  map.set(key, entry);
                }
                const entries = Array.from(map.entries()).sort(([a], [b]) =>
                  a.localeCompare(b)
                );
                if (entries.length === 0) return null;
                const maxVal = Math.max(
                  1,
                  ...entries.map(([, e]) => Math.max(e.income, e.expense))
                );
                const chartHeight = Math.max(90, chartHeightPx - 80);
                const yTicks = 5;
                const nf = new Intl.NumberFormat("en", { notation: "compact" });
                const grid = Array.from({ length: yTicks + 1 }, (_, i) => {
                  const y = (i / yTicks) * chartHeight;
                  const val = Math.round(((yTicks - i) / yTicks) * maxVal);
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: 10,
                        right: 0,
                        top: y + 6,
                        height: 1,
                        width: 700,
                        background: "#eef3fb",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 15,
                          top: -9,
                          fontSize: 12,
                          color: "#6b7280",
                        }}
                      >
                        {nf.format(val)}
                      </span>
                    </div>
                  );
                });
                const DAY_GAP = 28;
                const PAIR_GAP = 6;
                const bars = (
                  <div
                    style={{
                      position: "absolute",
                      left: 80,
                      right: 10,
                      bottom: 115,
                      display: "flex",
                      alignItems: "flex-end",
                      gap: DAY_GAP,
                    }}
                  >
                    {entries.map(([key, e]) => {
                      const hInc = (e.income / maxVal) * chartHeight;
                      const hExp = (e.expense / maxVal) * chartHeight;
                      return (
                        <div
                          key={key}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-end",
                              gap: PAIR_GAP,
                            }}
                          >
                            <div
                              style={{
                                width: BAR_WIDTH,
                                height: animateIn ? hInc : 0,
                                background:
                                  hInc > 0 ? COLOR_PRIMARY : "transparent",
                                borderRadius: hInc > 2 ? 6 : 0,
                                transition: "height 600ms ease",
                              }}
                            />
                            <div
                              style={{
                                width: BAR_WIDTH,
                                height: animateIn ? hExp : 0,
                                background:
                                  hExp > 0 ? COLOR_SKY : "transparent",
                                borderRadius: hExp > 2 ? 6 : 0,
                                transition: "height 600ms ease 80ms",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              marginTop: 10,
                              fontSize: 12,
                              color: "#6b7280",
                            }}
                          >
                            {e.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
                return (
                  <>
                    {grid}
                    {bars}
                  </>
                );
              })()}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 50,
                marginTop: -110,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    background: COLOR_PRIMARY,
                  }}
                />
                <span style={{ color: "#1f2937", fontWeight: 500 }}>
                  Income
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    background: COLOR_SKY,
                  }}
                />
                <span style={{ color: "#1f2937", fontWeight: 500 }}>
                  Expenses
                </span>
              </div>
            </div>
          </div>
          <div className="expense-breakdown">
            <div className="chart-header">
              <span>Expense Breakdown</span>
            </div>
            <div
              className="pie-chart-placeholder"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                marginTop: "80px",
                transform: animateIn ? "scale(1)" : "scale(0.92)",
                opacity: animateIn ? 1 : 0,
                transition: "transform 550ms ease, opacity 550ms ease",
              }}
            >
              {expenseBreakdown.entries.length === 0 ? (
                <span>No expenses yet</span>
              ) : (
                <>
                  {(() => {
                    let start = 0;
                    const segments = expenseBreakdown.entries.map(
                      ([cat, val], idx) => {
                        const pct = expenseBreakdown.total
                          ? (val / expenseBreakdown.total) * 100
                          : 0;
                        const end = start + pct * pieProgress;
                        const color = PIE_COLORS[idx % PIE_COLORS.length];
                        const seg = `${color} ${start}% ${end}%`;
                        start = end;
                        return seg;
                      }
                    );
                    const bg = `conic-gradient(${segments.join(",")})`;
                    return (
                      <div
                        style={{
                          position: "relative",
                          width: 170,
                          height: 170,
                        }}
                      >
                        <div
                          style={{
                            width: 170,
                            height: 170,
                            borderRadius: "50%",
                            background: bg,
                            filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.06))",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              width: 110,
                              height: 110,
                              borderRadius: "50%",
                              background: "#ffffff",
                              border: "6px solid #E5E7EB",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span style={{ color: "#6b7280", fontSize: 12 }}>
                              Total
                            </span>
                            <span
                              style={{
                                color: "#111827",
                                fontWeight: 700,
                                fontSize: 22,
                              }}
                            >
                              {Math.round(expenseBreakdown.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 20,
                      flexWrap: "wrap",
                    }}
                  >
                    {expenseBreakdown.entries.map(([cat, val], idx) => (
                      <div
                        key={cat}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            background: PIE_COLORS[idx % PIE_COLORS.length],
                          }}
                        />
                        <span style={{ color: "#6b7280", fontWeight: 600 }}>
                          {cat} :
                        </span>
                        <span style={{ color: "#111827", fontWeight: 700 }}>
                          {Math.round(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
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
                  <td colSpan="4">
                    No Transactions Yet, record new income or expenses!
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id || t._id}>
                    <td>
                      {t.date ? new Date(t.date).toLocaleDateString() : ""}
                    </td>
                    <td>{t.description}</td>
                    <td>{t.category}</td>
                    <td
                      style={{
                        color: t.type === "income" ? "#34cc85" : "#e25454",
                      }}
                    >
                      {t.type === "income" ? "+" : "-"}₹
                      {Number(t.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
