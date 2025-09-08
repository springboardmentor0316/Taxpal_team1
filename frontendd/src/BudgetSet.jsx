 import { Link} from "react-router-dom";
 import React from "react"
 import './Dashboard.css'

function Budget() {
  return (
    <div>
<div className="navbar">
        <div className="logo">
          <img src="/img/taxpal1.png" alt="Taxpal Logo" />
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
            <li className="active">
              <i className="fa-solid fa-bars"></i>
              <span className="text">Dashboard</span>
            </li>
            <li>
              <i className="fa-solid fa-check"></i>
              <span className="text">Transactions</span>
            </li>
            <li>
              <i className="fa-solid fa-money-bill"></i>
              <span className="text">Budget</span>
            </li>
            <li>
              <i className="fa-solid fa-money-bill-trend-up"></i>
              <span className="text">Tax Estimator</span>
            </li>
            <li>
              <i className="fa-solid fa-file"></i>
              <span className="text">Reports</span>
            </li>
          </ul>
        </nav>
        <div className="sidebar-bottom">
          <button className="settings-btn">
            <i style={{width: "30px"}} className="fa-solid fa-gear"></i>
            <span style={{marginLeft: "19px",}}>Settings</span>
          </button>
          <div className="dark-mode-toggle">
            <i style={{width: "20px"}} className="fa-solid fa-moon"></i>
            <span style={{marginLeft: "21px",}}>Dark Mode</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
      <div className="modal">
        <h2>Create New Budget</h2>

        <div className="form-row">
          <div className="form-group">
            <label style={{marginLeft: "30px"}}>Category</label>
            <select style={{width: "87%", marginLeft: "30px"}}>
              <option>Select Category</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{marginLeft: "40px"}}>Budget Amount</label>
            <input
              style={{width: "83%", marginLeft: "39px"}}
              type="text"
              placeholder="$ 0.00"
            />
          </div>
        </div>

        <div className="form-group">
          <label style={{marginLeft: "30px"}}>Month</label>
          <input
            style={{width: "41.6%", marginLeft: "30px"}}
            type="text"
            value="May, 2025"
          />
        </div>

        <div className="form-group">
          <label style={{marginLeft: "30px"}}>Description (Optional)</label>
          <textarea placeholder="e.g web design project"></textarea>
        </div>

        <div className="actions">
          <button className="btn btn-cancel">Cancel</button>
          <button className="btn btn-primary">Create Budget</button>
        </div>
        <div className="budget-table">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Food</td>
                <td>$500</td>
                <td>$200</td>
                <td>$300</td>
                <td>Active</td>
                <td>
                  <button>Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Budget;