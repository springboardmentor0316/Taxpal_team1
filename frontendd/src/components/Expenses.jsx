import "../Dashboard.css";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useState, useEffect } from "react";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function Expenses({ onClose, onSave }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const savedCategories = localStorage.getItem('expenseCategories');
    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories);
        setCategories(parsedCategories);
      } catch (e) {
        console.error('Error parsing expense categories:', e);
      }
    }
  }, []);

  return (
    <div>
      <div className="body-expin">
        <div className="modal-expin">
          <div className="modal-header">
            <h2>Record New Expenses</h2>
            <span className="close" onClick={onClose}>
              &times;
            </span>
          </div>
          <p style={{}} className="subtitle">
            Add details about your expenses to track your finance
          </p>

          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const description = form.querySelector('input[name="description"]').value.trim();
            const amount = form.querySelector('input[name="amount"]').value.trim();
            const category = form.querySelector('select[name="category"]').value;
            const date = form.querySelector('input[name="date"]').value;
            const notes = form.querySelector('textarea[name="notes"]').value.trim();
            if (!description || !amount || !category || !date) return;

            try {
              const res = await axios.post(
                `${API_BASE_URL}/transactions`,
                { type: "expense", description, amount: parseFloat(amount), category, date, notes },
                { headers: { ...getAuthHeaders() } }
              );
              const item = res.data?.item || { description, amount: parseFloat(amount), category, date, notes, type: "expense" };
              onSave && onSave(item);
              onClose && onClose();
            } catch (err) {
              onSave && onSave({ description, amount: parseFloat(amount), category, date, notes, type: "expense" });
              onClose && onClose();
            }
          }}>
            <h3>Add Expenses</h3>
            <div className="form-row-expin">
              <div className="form-group-expin">
                <label
                  style={{
                    fontSize: "15px",
                    marginBottom: "5px",
                    fontWeight: "500",
                  }}
                >
                  Description
                </label>
                <input name="description" type="text" placeholder="e.g groceries, rent" />
              </div>
              <div className="form-group">
                <label
                  style={{
                    fontSize: "15px",
                    marginBottom: "5px",
                    marginTop: "-15px",
                    fontWeight: "600",
                  }}
                >
                  Amount
                </label>
                <input name="amount" type="number" step="0.01" placeholder="e.g 2000" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label
                  style={{
                    fontSize: "15px",
                    marginBottom: "5px",
                    marginTop: "-19px",
                    fontWeight: "600",
                  }}
                >
                  Category
                </label>
                <select 
                  name="category" 
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "20px",
                    fontSize: "14px",
                    background: "#fff"
                  }}
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
                <label
                  style={{
                    fontSize: "15px",
                    marginBottom: "5px",
                    marginTop: "-20px",
                    fontWeight: "600",
                  }}
                >
                  Date
                </label>
                <input name="date" type="date" />
              </div>
            </div>

            <div className="form-group full-width">
              <label
                style={{
                  fontSize: "15px",
                  marginBottom: "5px",
                  marginTop: "-5px",
                  fontWeight: "600",
                }}
              >
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                style={{
                  resize: "none",
                  height: "80px",
                  width: "97.3%",
                  marginLeft: "1px",
                }}
                placeholder="e.g paid via credit card"
              ></textarea>
            </div>

            <div className="actions-btn">
              <button type="button" className="cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Expenses;
