import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../img/taxpal1.png";
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

    // Store tax data in localStorage
    // Save current tax as previous before updating
    const currentTax = localStorage.getItem("taxEstimate");
    if (currentTax) {
      localStorage.setItem("prevTaxEstimate", currentTax);
    }

    const taxData = {
      quarter,
      estimatedTax,
      dueDate: quarterInfo.dueDate,
      reminderDate: quarterInfo.reminderDate,
    };

    localStorage.setItem("taxEstimate", JSON.stringify(taxData));
    // Show success message
    toast.success("Tax calculation complete. Reminders have been scheduled.", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const calculateTax = () => {
    const toNumber = (val) => {
      if (typeof val === "number") return val;
      if (!val) return 0;
      return Number(String(val).replace(/[^0-9.\-]/g, "")) || 0;
    };
    const income = toNumber(formData.grossIncome);
    const deductions =
      toNumber(formData.businessExpenses) +
      toNumber(formData.retirementContributions) +
      toNumber(formData.healthInsurance) +
      toNumber(formData.homeOfficeDeduction);
    const taxable = Math.max(0, income - deductions);
    const rate = formData.filingStatus === "Single" ? 0.25 : 0.22;
    const calculated = taxable * rate;
    setEstimatedTax(calculated);
    generateTaxReminders(formData.quarter, calculated);
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
          <i className="fa fa-search"></i>
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
              style={{
                width: "100%",
                padding: "14px 24px",
                backgroundColor: "#207ED0",
                color: "#fff",
                border: "none",
                borderRadius: "15px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#2563EB")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#3B82F6")}
            >
              Calculate Estimated Tax
            </button>
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#6B7280",
                  fontSize: "14px",
                }}
              >
                <span>Estimated Tax</span>
                <span style={{ color: "#111827", fontWeight: 700 }}>
                  ₹{Number(estimatedTax).toFixed(2)}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#6B7280" }}>
                Demo calculation using a simple rate based on filing status.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Calendar */}
      <div className="content-container" style={{ padding: "20px", marginLeft : "-21px", }}>
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
            const taxData = JSON.parse(
              localStorage.getItem("taxEstimate") || "{}"
            );
            if (!taxData.quarter) {
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

            const reminderDate = new Date(taxData.reminderDate);
            const dueDate = new Date(taxData.dueDate);
            const monthNames = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];

            return (
              <>
                <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>
                  {monthNames[reminderDate.getMonth()]}{" "}
                  {reminderDate.getFullYear()}
                </h2>
                <div
                  className="event-card"
                  style={{
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    color: "#1E293B",
                    padding: "16px",
                    marginBottom: "16px",
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
                      Reminder: {taxData.quarter} Estimated Tax Payment
                    </span>
                    <span
                      className="badge reminder"
                      style={{
                        background: "#0088FF",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      Reminder
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
                    {reminderDate.toLocaleDateString()}
                  </div>
                  <div className="event-desc" style={{ color: "#374151" }}>
                    Reminder for upcoming tax payment of ₹
                    {Number(taxData.estimatedTax).toFixed(2)} due on{" "}
                    {dueDate.toLocaleDateString()}
                  </div>
                </div>

                <div
                  className="event-card"
                  style={{
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    padding: "16px",
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
                    <span>{taxData.quarter} Estimated Tax Payment</span>
                    <span
                      className="badge payment"
                      style={{
                        background: "#00C0E8",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      Payment
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
                    {dueDate.toLocaleDateString()}
                  </div>
                  <div className="event-desc" style={{ color: "#374151" }}>
                    {taxData.quarter} estimated tax payment of ₹
                    {Number(taxData.estimatedTax).toFixed(2)} is due
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default TaxEstimator;
