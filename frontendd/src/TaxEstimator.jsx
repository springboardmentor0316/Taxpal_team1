import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../img/taxpal1.png";
import { API_ENDPOINTS } from "./config/api";
// Utility function to get due dates for quarters
const getDueDate = (quarter) => {
  const year = new Date().getFullYear();
  const dueDates = {
    'Q1': `${year}-04-15`,
    'Q2': `${year}-06-15`,
    'Q3': `${year}-09-15`,
    'Q4': `${year}-01-15`
  };
  return new Date(dueDates[quarter]);
};

const countries = [
  {
    name: "United States",
    states: [
      "California",
      "Texas",
      "New York",
      "Florida",
      "Illinois",
      "Washington",
    ],
  },
  {
    name: "India",
    states: [
      "Maharashtra",
      "Gujarat",
      "Rajasthan",
      "Karnataka",
      "Tamil Nadu",
      "Delhi",
    ],
  },
  {
    name: "Canada",
    states: [
      "Ontario",
      "British Columbia",
      "Alberta",
      "Quebec",
      "Manitoba",
      "Nova Scotia",
    ],
  },
  {
    name: "United Kingdom",
    states: ["England", "Scotland", "Wales", "Northern Ireland"],
  },
];

const TaxEstimator = () => {
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

  const [formData, setFormData] = useState({
    country: "United States",
    state: "California",
    filingStatus: "Single",
    quarter: "Q2 (Apr - Jun 2025)",
    grossIncome: "",
    businessExpenses: "",
    retirementContributions: "",
    healthInsurance: "",
    homeOfficeDeduction: "",
  });

  const [estimatedTax, setEstimatedTax] = useState(0);

  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset error when form data changes
  useEffect(() => {
    setError(null);
  }, [formData]);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      console.log('Token:', token);
      console.log('User data:', user);
      if (token && user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      // Reset state if country changes
      if (field === "country") {
        const selectedCountry = countries.find((c) => c.name === value);
        return {
          ...prev,
          country: value,
          state: selectedCountry?.states[0] || "",
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const generateTaxReminders = (quarter, estimatedTax) => {
    // Extract quarter and year from the selected quarter
    const quarterMap = {
      "Q1 (Jan - Mar 2025)": {
        number: 1,
        dueDate: "2025-03-15",
        reminderDate: "2025-03-01",
      },
      "Q2 (Apr - Jun 2025)": {
        number: 2,
        dueDate: "2025-06-15",
        reminderDate: "2025-06-01",
      },
      "Q3 (Jul - Sep 2025)": {
        number: 3,
        dueDate: "2025-09-15",
        reminderDate: "2025-09-01",
      },
      "Q4 (Oct - Dec 2025)": {
        number: 4,
        dueDate: "2025-12-15",
        reminderDate: "2025-12-01",
      },
    };

    const quarterInfo = quarterMap[quarter];
    if (!quarterInfo) return;

    const taxData = {
      quarter,
      estimatedTax,
      dueDate: quarterInfo.dueDate,
      reminderDate: quarterInfo.reminderDate,
      timestamp: new Date().toISOString(), // Add timestamp for sorting
      id: Date.now(), // Unique identifier for each estimate
    };

    // Get existing history or initialize new array
    const existingHistory = JSON.parse(localStorage.getItem("taxEstimatesHistory") || "[]");
    
    // Add new estimate to history
    existingHistory.push(taxData);
    
    // Save updated history
    localStorage.setItem("taxEstimatesHistory", JSON.stringify(existingHistory));
    // Show success message
    toast.success("Tax calculation complete. Reminders have been scheduled.", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const calculateTax = async () => {
    setLoading(true);
    setError(null);
    
    const toNumber = (val) => {
      if (typeof val === "number") return val;
      if (!val) return 0;
      return Number(String(val).replace(/[^0-9.\-]/g, "")) || 0;
    };

    const income = toNumber(formData.grossIncome);
    const deductions = {
      businessExpenses: toNumber(formData.businessExpenses),
      retirementContributions: toNumber(formData.retirementContributions),
      healthInsurance: toNumber(formData.healthInsurance),
      homeOfficeDeduction: toNumber(formData.homeOfficeDeduction)
    };

    try {
      if (!isLoggedIn) {
        toast.error("Please log in to save tax estimates");
        return;
      }

      let userData;
      try {
        userData = JSON.parse(localStorage.getItem('user'));
        console.log('Parsed user data:', userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast.error("Error accessing user data. Please try logging in again.");
        return;
      }

      if (!userData || !userData.email) {
        console.error('Invalid user data:', userData);
        toast.error("User data is invalid. Please try logging in again.");
        return;
      }

      const response = await fetch(API_ENDPOINTS.taxEstimate.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: userData.email, // Using email as the unique identifier
          quarter: formData.quarter.split(' ')[0], // Extract Q1, Q2, etc.
          country: formData.country,
          state: formData.state,
          filingStatus: formData.filingStatus,
          grossIncome: income,
          deductions: deductions
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setEstimatedTax(data.data.estimatedTax);
        generateTaxReminders(formData.quarter, data.data.estimatedTax);
        toast.success("Tax estimate saved successfully");
      } else {
        console.error('Server error:', data);
        toast.error(data.message || "Failed to calculate tax");
      }
    } catch (error) {
      console.error('Error calculating tax:', error);
      setError(error.message);
      if (error.message === "Failed to fetch") {
        toast.error("Cannot connect to the server. Please make sure the backend server is running.");
      } else {
        toast.error("Failed to calculate tax: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const currentCountry = countries.find((c) => c.name === formData.country);
  return (
    <div style={{ fontFamily: "Aboreto, system-ui" }}>
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

      {/* Main Content Area */}
      <div style={{ marginTop: "72px" }}>
        {/* Header */}
        <header
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            padding: "16px 20px",
            background: "#FFFFFF",
            marginBottom: "20px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#1E293B",
                margin: "0",
              }}
            >
              Tax Estimator
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#64748B",
                margin: "4px 0 0 0",
              }}
            >
              Calculate your estimated tax obligations
            </p>
          </div>
        </header>

        {/* Calculator and Summary Area */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "flex-start",
          }}
        >
          {/* Left Panel - Calculator */}
          <div
            style={{
              flex: "1 1 auto",
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              padding: "24px",
              width: "800px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1E293B",
                margin: "0 0 24px 0",
              }}
            >
              Quarterly Tax Calculator
            </h2>

            {/* Country and State Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                marginBottom: "24px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Country/Region
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid rgb(204, 204, 204)",
                      borderRadius: "14px",
                      fontSize: "14px",
                      background: "rgb(255, 255, 255)",
                    }}
                  >
                    {countries.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  State/Province
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid rgb(204, 204, 204)",
                      borderRadius: "14px",
                      fontSize: "14px",
                      background: "rgb(255, 255, 255)",
                    }}
                  >
                    {currentCountry?.states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Filing Status and Quarter Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                marginBottom: "32px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Filing Status
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={formData.filingStatus}
                    onChange={(e) =>
                      handleInputChange("filingStatus", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid rgb(204, 204, 204)",
                      borderRadius: "14px",
                      fontSize: "14px",
                      background: "rgb(255, 255, 255)",
                    }}
                  >
                    <option>Single</option>
                    <option>Married</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Quarter
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={formData.quarter}
                    onChange={(e) =>
                      handleInputChange("quarter", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid rgb(204, 204, 204)",
                      borderRadius: "14px",
                      fontSize: "14px",
                      background: "rgb(255, 255, 255)",
                    }}
                  >
                    <option>Q1 (Jan - Mar 2025)</option>
                    <option>Q2 (Apr - Jun 2025)</option>
                    <option>Q3 (Jul - Sep 2025)</option>
                    <option>Q4 (Oct - Dec 2025)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Income Section */}
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#1E293B",
                margin: "0 0 16px 0",
              }}
            >
              Income
            </h3>

            <div style={{ marginBottom: "32px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Gross Income for Quarter
              </label>
              <input
                type="text"
                placeholder="₹ 0.00"
                style={{
                  width: "97.4%",
                  padding: "10px",
                  marginBottom: "13px",
                  borderRadius: "14px",
                  border: "1px solid rgb(204, 204, 204)",
                  fontSize: "14px",
                  color: "black",
                  backgroundColor: "white",
                }}
                value={formData.grossIncome}
                onChange={(e) =>
                  handleInputChange("grossIncome", e.target.value)
                }
              />
            </div>

            {/* Deductions Section */}
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#1E293B",
                margin: "0 0 16px 0",
              }}
            >
              Deductions
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                marginBottom: "24px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Business Expenses
                </label>
                <input
                  type="text"
                  placeholder="₹ 0.00"
                  style={{
                    width: "94.6%",
                    padding: "10px",
                    marginBottom: "13px",
                    borderRadius: "14px",
                    border: "1px solid rgb(204, 204, 204)",
                    fontSize: "14px",
                    color: "black",
                    backgroundColor: "white",
                  }}
                  value={formData.businessExpenses}
                  onChange={(e) =>
                    handleInputChange("businessExpenses", e.target.value)
                  }
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Retirement Contributions
                </label>
                <input
                  type="text"
                  placeholder="₹ 0.00"
                  style={{
                    width: "94.6%",
                    padding: "10px",
                    marginBottom: "13px",
                    borderRadius: "14px",
                    border: "1px solid rgb(204, 204, 204)",
                    fontSize: "14px",
                    color: "black",
                    backgroundColor: "white",
                  }}
                  value={formData.retirementContributions}
                  onChange={(e) =>
                    handleInputChange("retirementContributions", e.target.value)
                  }
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                marginBottom: "32px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Health Insurance Premiums
                </label>
                <input
                  type="text"
                  placeholder="₹ 0.00"
                  style={{
                    width: "94.6%",
                    padding: "10px",
                    marginBottom: "13px",
                    borderRadius: "14px",
                    border: "1px solid rgb(204, 204, 204)",
                    fontSize: "14px",
                    color: "black",
                    backgroundColor: "white",
                  }}
                  value={formData.healthInsurance}
                  onChange={(e) =>
                    handleInputChange("healthInsurance", e.target.value)
                  }
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Home Office Deduction
                </label>
                <input
                  type="text"
                  placeholder="₹ 0.00"
                  style={{
                    width: "94.6%",
                    padding: "10px",
                    marginBottom: "13px",
                    borderRadius: "14px",
                    border: "1px solid rgb(204, 204, 204)",
                    fontSize: "14px",
                    color: "black",
                    backgroundColor: "white",
                  }}
                  value={formData.homeOfficeDeduction}
                  onChange={(e) =>
                    handleInputChange("homeOfficeDeduction", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateTax}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 24px",
                backgroundColor: loading ? "#9CA3AF" : "#207ED0",
                color: "#fff",
                border: "none",
                borderRadius: "15px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = "#2563EB")}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = "#3B82F6")}
            >
              {loading ? (
                <>
                  <i className="fa fa-spinner fa-spin" />
                  Calculating...
                </>
              ) : (
                "Calculate Estimated Tax"
              )}
            </button>
            
            {error && (
              <div style={{ 
                marginTop: "16px", 
                padding: "12px", 
                backgroundColor: "#FEE2E2", 
                color: "#B91C1C",
                borderRadius: "8px",
                fontSize: "14px" 
              }}>
                {error}
              </div>
            )}
          </div>

          {/* Right Panel - Tax Summary */}
          <div
            style={{
              width: "300px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              padding: "24px",
              position: "sticky",
              top: "24px",
              alignSelf: "flex-start",
              height: "fit-content",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#1E293B",
                margin: "0 0 16px 0",
              }}
            >
              Tax Summary
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#6B7280",
                    fontSize: "14px",
                    marginBottom: "8px"
                  }}
                >
                  <span>Quarterly Estimated Tax</span>
                  <span style={{ color: "#111827", fontWeight: 700 }}>
                    ₹{Number(estimatedTax).toFixed(2)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#6B7280",
                    fontSize: "14px",
                    marginBottom: "8px"
                  }}
                >
                  <span>Annual Tax Estimate</span>
                  <span style={{ color: "#111827", fontWeight: 700 }}>
                    ₹{(Number(estimatedTax) * 4).toFixed(2)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#6B7280",
                    fontSize: "14px",
                    marginBottom: "8px"
                  }}
                >
                  <span>Total Deductions</span>
                  <span style={{ color: "#111827", fontWeight: 700 }}>
                    ₹{(
                      Number(formData.businessExpenses || 0) +
                      Number(formData.retirementContributions || 0) +
                      Number(formData.healthInsurance || 0) +
                      Number(formData.homeOfficeDeduction || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6B7280",
                  padding: "12px",
                  background: "#F3F4F6",
                  borderRadius: "8px",
                  marginTop: "8px"
                }}
              >
                Tax calculation based on {formData.filingStatus.toLowerCase()} filing status. 
                Your next payment for {formData.quarter} is due on {
                  formData.quarter ? getDueDate(formData.quarter.split(' ')[0]).toLocaleDateString() : 'calculating...'
                }.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Calendar */}
      <div className="content-container" style={{ padding: "20px", marginLeft: "-21px" }}>
        <div
          className="main-card"
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            width: "97.6%",
          }}
        >
          <h1
            style={{
              fontSize: "22px",
              color: "#1E293B",
              margin: "0 0 24px 0",
              fontWeight: "600",
            }}
          >
            Tax Calendar
          </h1>

          {(() => {
            // Get all tax estimates from localStorage history
            const allEstimates = JSON.parse(localStorage.getItem("taxEstimatesHistory") || "[]");
            
            // Sort estimates by date
            allEstimates.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

            if (allEstimates.length === 0) {
              return (
                <div
                  style={{
                    textAlign: "center",
                    color: "#6B7280",
                    padding: "20px",
                  }}
                >
                  No tax reminders yet. Calculate your estimated tax to see
                  payment schedule.
                </div>
              );
            }

            const monthNames = [
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ];

            // Group events by month
            const eventsByMonth = {};
            
            allEstimates.forEach(estimate => {
              const reminderDate = new Date(estimate.reminderDate);
              const dueDate = new Date(estimate.dueDate);
              
              const reminderKey = `${reminderDate.getFullYear()}-${reminderDate.getMonth()}`;
              const dueKey = `${dueDate.getFullYear()}-${dueDate.getMonth()}`;
              
              if (!eventsByMonth[reminderKey]) eventsByMonth[reminderKey] = [];
              if (!eventsByMonth[dueKey]) eventsByMonth[dueKey] = [];
              
              eventsByMonth[reminderKey].push({
                type: 'reminder',
                date: reminderDate,
                data: estimate
              });
              
              eventsByMonth[dueKey].push({
                type: 'payment',
                date: dueDate,
                data: estimate
              });
            });

            // Sort months chronologically
            const sortedMonths = Object.keys(eventsByMonth).sort();

            return (
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {sortedMonths.map(monthKey => {
                  const [year, month] = monthKey.split('-').map(Number);
                  const events = eventsByMonth[monthKey].sort((a, b) => a.date - b.date);

                  return (
                    <div key={monthKey}>
                      <h2 style={{ 
                        fontSize: "18px", 
                        marginBottom: "16px",
                        color: "#1E293B",
                        borderBottom: "2px solid #E5E7EB",
                        paddingBottom: "8px"
                      }}>
                        {monthNames[month]} {year}
                      </h2>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {events.map((event, index) => (
                          <div
                            key={`${event.type}-${index}`}
                            className="event-card"
                            style={{
                              border: "1px solid #E5E7EB",
                              borderRadius: "8px",
                              padding: "16px",
                              backgroundColor: event.type === 'reminder' ? '#F0F9FF' : '#F0FDF4'
                            }}
                          >
                            <div
                              className="event-title"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <span>
                                {event.type === 'reminder' ? 'Reminder: ' : ''}
                                {event.data.quarter} Estimated Tax {event.type === 'payment' ? 'Payment' : 'Reminder'}
                              </span>
                              <span
                                className={`badge ${event.type}`}
                                style={{
                                  background: event.type === 'reminder' ? '#0088FF' : '#00C0E8',
                                  color: "white",
                                  padding: "4px 8px",
                                  borderRadius: "12px",
                                  fontSize: "12px",
                                }}
                              >
                                {event.type === 'reminder' ? 'Reminder' : 'Payment'}
                              </span>
                            </div>
                            <div
                              className="event-date"
                              style={{
                                color: "#6B7280",
                                fontSize: "14px",
                                margin: "8px 0",
                              }}
                            >
                              {event.date.toLocaleDateString()}
                            </div>
                            <div className="event-desc" style={{ color: "#374151" }}>
                              {event.type === 'reminder' 
                                ? `Reminder for upcoming tax payment of ₹${Number(event.data.estimatedTax).toFixed(2)} due on ${new Date(event.data.dueDate).toLocaleDateString()}`
                                : `${event.data.quarter} estimated tax payment of ₹${Number(event.data.estimatedTax).toFixed(2)} is due`
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default TaxEstimator;
