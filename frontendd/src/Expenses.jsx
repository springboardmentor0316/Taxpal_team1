import "./Dashboard.css";

function Expenses({ onClose }) {
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

          <form>
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
                <input type="text" placeholder="e.g groceries, rent" />
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
                <input type="text" placeholder="e.g 2000" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label
                  style={{
                    fontSize: "15px",
                    marginBottom: "5px",
                    marginTop: "-20px",
                    fontWeight: "600",
                  }}
                >
                  Category
                </label>
                <input type="text" placeholder="e.g food, utilities" />
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
                <input type="date" />
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
