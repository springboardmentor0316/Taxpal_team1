import React from "react";
import { User, Tag, Bell, Lock, SquarePen, X } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import logo from "../img/taxpal1.png";

function Settings() {
  const categories = [
    { color: "red", name: "Travel" },
    { color: "blue", name: "Marketing" },
    { color: "purple", name: "Software Subscription" },
    { color: "orange", name: "Meals & Entertainment" },
    { color: "brown", name: "Office Rent" },
    { color: "green", name: "Professional Development" },
    { color: "gold", name: "Utilities" },
    { color: "gray", name: "Business Expenses" },
    { color: "gold", name: "Utilities" },
  ];

  return (
    <div style={{ fontFamily: "Aboreto, system-ui", padding: "70px" }}>
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
          <button className="settings-btn">
            <i style={{ width: "30px" }} className="fa-solid fa-gear"></i>
            <span style={{ marginLeft: "19px" }}>Settings</span>
          </button>
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
                style={{
                  border: "1px solid black",
                  padding: "5px 15px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                Expense Categories
              </button>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "black",
                  fontSize: "16px",
                  padding: "5px 0",
                }}
              >
                Income Categories
              </button>
            </div>

            {/* Categories List */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
              {categories.map((cat, idx) => (
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
                    />{" "}
                    <X size={18} color="#999" />
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
