import React, { useState, useEffect } from "react";
import { User, Tag, Bell, Lock, SquarePen, X } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import logo from "../img/taxpal1.png";
import { toast } from "react-toastify";
import {
  getNotifications,
  markNotificationAsRead,
  getUnreadCount,
  clearNotifications
} from "./config/notificationService";

function Settings() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState("User");

  // Load notifications and user info
  useEffect(() => {
    setNotifications(getNotifications());
    setUnreadCount(getUnreadCount());

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

  const [selectedSection, setSelectedSection] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        name: saved.name || '',
        email: saved.email || '',
        country: saved.country || '',
        income: saved.income || '',
      };
    } catch {
      return { name: '', email: '', country: '', income: '' };
    }
  });

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

  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  // Click outside to close notifications and profile
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
      if (!event.target.closest('.avatar') && !event.target.closest('.profile-dropdown')) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                  <div className="profile-menu-item" onClick={() => {
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
                  }}>
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
            <li className={useLocation().pathname === "/transactions" ? "active" : ""}>
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
                onClick={() => setSelectedSection("profile")}
                style={{
                  marginBottom: "15px",
                  padding: "8px",
                  color: "#0000007f",
                  cursor: 'pointer',
                  border: selectedSection === 'profile' ? '1px solid #0000007f' : '1px solid transparent',
                  borderRadius: 8,
                  background: selectedSection === 'profile' ? '#f0f8ff' : 'transparent'
                }}
              >
                <User size={20} color="#999" /> Profile
              </li>
              <li
                onClick={() => setSelectedSection("categories")}
                style={{
                  marginBottom: "15px",
                  padding: "8px",
                  color: "#0000007f",
                  cursor: 'pointer',
                  border: selectedSection === 'categories' ? '1px solid #0000007f' : '1px solid transparent',
                  borderRadius: 8,
                  background: selectedSection === 'categories' ? '#f0f8ff' : 'transparent'
                }}
              >
                <Tag size={20} color="#999" /> Categories
              </li>
              <li
                onClick={() => setSelectedSection("notifications")}
                style={{
                  marginBottom: "15px",
                  padding: "8px",
                  color: "#0000007f",
                  cursor: 'pointer',
                  border: selectedSection === 'notifications' ? '1px solid #0000007f' : '1px solid transparent',
                  borderRadius: 8,
                  background: selectedSection === 'notifications' ? '#f0f8ff' : 'transparent'
                }}
              >
                <Bell size={20} color="#999" /> Notification
              </li>
              <li
                onClick={() => setSelectedSection("security")}
                style={{
                  padding: "8px",
                  color: "#0000007f",
                  cursor: 'pointer',
                  border: selectedSection === 'security' ? '1px solid #0000007f' : '1px solid transparent',
                  borderRadius: 8,
                  background: selectedSection === 'security' ? '#f0f8ff' : 'transparent'
                }}
              >
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
            {selectedSection === 'categories' && (
              <>
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
              </>
            )}

            {selectedSection === 'profile' && (
              <div style={{ color: 'black' }}>
                <h3 style={{ marginTop: 0 }}>Profile</h3>
                {!isEditingProfile ? (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={{ color: '#6b7280' }}>Name</label>
                        <div style={{ padding: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}>{profile.name || '—'}</div>
                      </div>
                      <div>
                        <label style={{ color: '#6b7280' }}>Email</label>
                        <div style={{ padding: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}>{profile.email || '—'}</div>
                      </div>
                      <div>
                        <label style={{ color: '#6b7280' }}>Country</label>
                        <div style={{ padding: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}>{profile.country || '—'}</div>
                      </div>
                      <div>
                        <label style={{ color: '#6b7280' }}>Income Bracket</label>
                        <div style={{ padding: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}>{profile.income || '—'}</div>
                      </div>
                    </div>
                    <button style={{ padding: 12, borderRadius: 8, background: '#207ed0', color: 'white', border: 'none' }} onClick={() => setIsEditingProfile(true)}>Edit</button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label>Name</label>
                        <input type="text" placeholder="Username" value={profile.name} onChange={(e)=>setProfile({ ...profile, name: e.target.value })} style={{ width: '90%', padding: 12, borderRadius: 8, border: '1px solid #ddd', marginBottom: 12 }} />
                      </div>
                      <div>
                        <label>Email</label>
                        <input type="email" placeholder="Email" value={profile.email} onChange={(e)=>setProfile({ ...profile, email: e.target.value })} style={{ width: '90%', padding: 12, borderRadius: 8, border: '1px solid #ddd', marginBottom: 12 }} />
                      </div>
                      <div>
                        <label>Country</label>
                        <select value={profile.country} onChange={(e)=>setProfile({ ...profile, country: e.target.value })} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', marginBottom: 12 }}>
                          <option value="">Select your country</option>
                          <option value="india">India</option>
                          <option value="usa">United States</option>
                          <option value="uk">United Kingdom</option>
                          <option value="canada">Canada</option>
                          <option value="australia">Australia</option>
                        </select>
                      </div>
                      <div>
                        <label>Income Bracket</label>
                        <select value={profile.income} onChange={(e)=>setProfile({ ...profile, income: e.target.value })} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', marginBottom: 12 }}>
                          <option value="">Select your income bracket</option>
                          <option value="low">Below $20,000</option>
                          <option value="mid">20,000 - 50,000</option>
                          <option value="high">50,000 - 100,000</option>
                          <option value="very-high">Above 100,000</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button style={{ padding: 12, borderRadius: 8, background: '#207ed0', color: 'white', border: 'none' }} onClick={() => { 
                        localStorage.setItem('user', JSON.stringify({ ...(JSON.parse(localStorage.getItem('user')||'{}')), ...profile })); 
                        setIsEditingProfile(false);
                        toast.success('Profile updated successfully!');
                      }}>Save Changes</button>
                      <button style={{ padding: 12, borderRadius: 8, background: 'white', color: '#111827', border: '1px solid #ddd' }} onClick={() => setIsEditingProfile(false)}>Cancel</button>
                    </div>
                  </>
                )}
              </div>
            )}

            {selectedSection === 'notifications' && (
              <div style={{ color: 'black' }}>
                <h3 style={{ marginTop: 0 }}>Notifications</h3>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" defaultChecked /> Email alerts</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" /> SMS alerts</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" defaultChecked /> Product updates</label>
                </div>
                <button style={{ padding: 12, borderRadius: 8, background: '#207ed0', color: 'white', border: 'none' }} onClick={() => toast.success('Notification preferences saved!')}>Save Preferences</button>
              </div>
            )}

            {selectedSection === 'security' && (
              <div style={{ color: 'black' }}>
                <h3 style={{ marginTop: 0 }}>Security</h3>
                <p style={{ marginBottom: 12 }}>Review device sessions and sign out from this browser.</p>
                <button style={{ padding: 12, borderRadius: 8, background: '#ef4444', color: 'white', border: 'none' }} onClick={() => {
                  const id = "securityLogoutConfirm";
                  if (toast.isActive(id)) return;
                  toast(
                    ({ closeToast }) => (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, color: '#111827' }}>Confirm Logout</div>
                        <div style={{ color: '#4b5563', fontSize: 14 }}>Are you sure you want to log out of this device?</div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 6, justifyContent: 'center' }}>
                          <button onClick={() => closeToast()} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #d1d5db', background: '#ffffff', cursor: 'pointer' }}>Cancel</button>
                          <button onClick={() => { 
                            closeToast(); 
                            localStorage.removeItem('token'); 
                            localStorage.removeItem('user'); 
                            toast.info('Logged out successfully', { toastId: 'securityLogoutOnce' });
                            navigate('/'); 
                          }} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}>Confirm</button>
                        </div>
                      </div>
                    ),
                    { toastId: id, position: 'top-center', autoClose: false, closeOnClick: false, draggable: false, closeButton: false, hideProgressBar: true, icon: false, style: { width: '360px', margin: '0 auto', textAlign: 'center', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.12)', padding: '16px 20px' } }
                  );
                }}>Log out of this device</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
