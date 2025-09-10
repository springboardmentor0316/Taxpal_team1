import "./Dashboard.css";

function Income({ onClose, onSave }) {
  return (
    <div>
      <div className="body-expin">
        <div className="modal-expin">
          <div className="modal-header">
            <h2>Record New Income</h2>
            <span className="close" onClick={onClose}>
              &times;
            </span>
          </div>
          <p className="subtitle">
            Add details about your income to track your finance
          </p>

          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const description = form.querySelector('input[name="description"]').value.trim();
            const amount = form.querySelector('input[name="amount"]').value.trim();
            const category = form.querySelector('input[name="category"]').value.trim();
            const date = form.querySelector('input[name="date"]').value;
            const notes = form.querySelector('textarea[name="notes"]').value.trim();
            if (!description || !amount || !category || !date) return;
            onSave && onSave({ description, amount: parseFloat(amount), category, date, notes });
          }}>
            <h3>Add Income</h3>
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
                <input name="description" type="text" placeholder="e.g web design project" />
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
                <input name="amount" type="number" step="0.01" placeholder="e.g 5000" />
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
                <input name="category" type="text" placeholder="e.g freelance" />
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
                placeholder="e.g web design project"
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

export default Income;
