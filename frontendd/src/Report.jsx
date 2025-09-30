import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  getNotifications,
  markNotificationAsRead,
  getUnreadCount
} from "./config/notificationService";
import { API_BASE_URL } from "./config";
import "./Dashboard.css";
import logo from "../img/taxpal1.png";

function Report() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Initialize notifications and user data
  useEffect(() => {
    setNotifications(getNotifications());
    setUnreadCount(getUnreadCount());
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [reports, setReports] = useState(() => {
    const savedReports = localStorage.getItem('reports');
    return savedReports ? JSON.parse(savedReports) : [];
  });
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    reportType: "Income Statement",
    period: "Current Month",
    format: "CSV",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData({
      reportType: "Income Statement",
      period: "Current Month",
      format: "PDF",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      // Create a new report entry with current timestamp
      const newReport = {
        ...formData,
        fileName: `${formData.reportType.toLowerCase().replace(/\\s+/g, '_')}_${Date.now()}.csv`,
        generatedAt: new Date().toISOString()
      };
      
      // Create sample CSV content
      const csvContent = 'Date,Description,Amount,Type\\n' +
        '2025-09-30,Salary,5000,Income\\n' +
        '2025-09-29,Rent,-1000,Expense';
      
      // Create and save the blob
      const blob = new Blob([csvContent], { type: 'text/csv' });
      
      // Add the new report to the list
      const updatedReports = [newReport, ...reports];
      setReports(updatedReports);
      localStorage.setItem('reports', JSON.stringify(updatedReports));
      toast.success('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (report) => {
    try {
      let csvContent = '';
      const currentDate = new Date().toISOString().split('T')[0];

      if (report.reportType === 'Income Statement') {
        csvContent = `Date,Description,Amount,Type\n${currentDate},Salary,5000,Income\n${currentDate},Rent,-1000,Expense`;
      } else if (report.reportType === 'Balance Sheet') {
        csvContent = `Account,Balance,Date\nCash,10000,${currentDate}\nAccounts Receivable,3000,${currentDate}`;
      } else {
        csvContent = `Category,Inflow,Outflow,Date\nOperating,5000,2000,${currentDate}\nInvesting,1000,3000,${currentDate}`;
      }

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', report.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
      console.error('Error downloading report:', error);
    }
  };

  const handleDelete = (fileName) => {
    try {
      const updatedReports = reports.filter(report => report.fileName !== fileName);
      setReports(updatedReports);
      localStorage.setItem('reports', JSON.stringify(updatedReports));
      toast.success('Report deleted successfully');
    } catch (error) {
      toast.error('Failed to delete report');
      console.error('Error deleting report:', error);
    }
  };

  return (
    <div>
      {/* Navbar */}
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
                className={`search-input ${searchActive ? 'active' : ''}`}
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i 
                className="fas fa-search search-icon" 
                onClick={() => setSearchActive(!searchActive)}
              ></i>
            </div>
            {searchActive && (
              <div className="search-results">
                {searchQuery ? (
                  reports.filter(report => 
                    report.reportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    report.period.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length > 0 ? (
                    reports
                      .filter(report => 
                        report.reportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        report.period.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map(report => (
                        <div key={report.fileName} className="search-result-item">
                          <i className="fas fa-file-alt"></i>
                          <span>{report.reportType} - {report.period}</span>
                        </div>
                      ))
                  ) : (
                    <div className="search-result-item">
                      <span>No reports found</span>
                    </div>
                  )
                ) : (
                  <div className="search-result-item">
                    <span>Recent Reports</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="notification-container" style={{ position: 'relative' }}>
            <i 
              className="fa fa-bell" 
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
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
                    <i className="fas fa-cog"></i>
                    Settings
                  </Link>
                  <div className="profile-menu-item">
                    <i className="fas fa-user"></i>
                    Profile
                  </div>
                  <div
                    className="profile-menu-item"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      toast.info("Logged out successfully");
                      navigate("/");
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
            <li>
              <i className="fa-solid fa-check"></i>
              <span className="text">Transactions</span>
            </li>
            <li>
              <Link to="/budget">
                <i className="fa-solid fa-money-bill"></i>
                <span style={{ marginLeft: "16px" }}>Budget</span>
              </Link>
            </li>
            <li>
              <Link to="/tax-estimator">
                <i className="fa-solid fa-money-bill-trend-up"></i>
                <span className="text">Tax Estimator</span>
              </Link>
            </li>
            <li className="active">
              <i className="fa-solid fa-file"></i>
              <span style={{ marginLeft: "23px" }}>Reports</span>
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

      {/* Main content */}
      <div style={{ marginTop: "72px" }}>
        <header
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            padding: "16px 20px",
            width: "96.6%",
            marginRight: "900px",
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
              Financial Reports
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#64748B",
                margin: "4px 0 0 0",
              }}
            >
              Generate and download your financial reports
            </p>
          </div>
        </header>

        <div className="container">
          <div className="report-box">
            <h2 className="h2-report">Generate Report</h2>
            <form className="report-form" onSubmit={handleSubmit}>
              {/* Report Type */}
              <div className="form-group-report">
                <label className="form-label">Report Type</label>
                <select
                  name="reportType"
                  value={formData.reportType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option>Income Statement</option>
                  <option>Balance Sheet</option>
                  <option>Cash Flow</option>
                </select>
              </div>

              {/* Period */}
              <div className="form-group-report">
                <label className="form-label">Period</label>
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option>Current Month</option>
                  <option>Last Month</option>
                  <option>Year to Date</option>
                </select>
              </div>

              {/* Format */}
              <div className="form-group-report">
                <label className="form-label">Format</label>
                <select 
                  className="form-select" 
                  value="CSV" 
                  disabled
                >
                  <option>CSV</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="button-group">
                <button 
                  type="submit" 
                  className="generate-btn"
                  disabled={generating}
                >
                  {generating ? (
                    <><i className="fas fa-spinner fa-spin"></i> Generating...</>
                  ) : (
                    'Generate Report'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="report-table">
          <table>
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Date and Time</th>
                <th>Period</th>
                <th>Format</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    No reports generated yet. Use the form above to generate a report.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.fileName}>
                    <td>{report.reportType}</td>
                    <td>{new Date(report.generatedAt).toLocaleString()}</td>
                    <td>{report.period}</td>
                    <td>{report.format}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                          className="action-btn"
                          onClick={() => handleDownload(report)}
                          title="Download Report"
                        >
                          <i className="fas fa-download" style={{ color: '#333' }}></i>
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => handleDelete(report.fileName)}
                          title="Delete Report"
                        >
                          <i className="fas fa-trash" style={{ color: '#333' }}></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Report;
