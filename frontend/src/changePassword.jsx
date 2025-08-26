import { useState } from "react";
import { Link } from "react-router-dom";

function ChangePassword() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="head">
        <img src="/img/taxpal1.png" alt="taxpal" className="logo" />
        <p className="para">Your trusted tax partner</p>
      </div>

      <form
        style={{
          backgroundColor: "white",
          padding: "30px",
          marginRight: "40px",
          borderRadius: "40px",
          boxShadow: "10px 10px 5px rgba(170, 168, 168, 0.5)",
          width: "420px",
          height: "460px",
        }}
      >
        <h2
          style={{ marginBottom: "15px", textAlign: "center", color: "#333" }}
        >
          Change Password
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "#555",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          Please reset your Password.
        </p>

        {/* New Password */}
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              letterSpacing: "1.3px",
              fontSize: "16px",
              color: "#333",
            }}
          >
            New Password
          </label>
          <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            <input
              type={showNew ? "text" : "password"}
              placeholder="Enter your password"
              required
              style={{
                flex: 1,
                padding: "8px 35px 8px 8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <img
              src={showNew ? "/img/eye-open.png" : "/img/eye-closed.png"}
              alt="toggle"
              onClick={() => setShowNew(!showNew)}
              style={{
                position: "absolute",
                right: "10px",
                cursor: "pointer",
                width: "20px",
                height: "20px",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              letterSpacing: "1.3px",
              fontSize: "16px",
              color: "#333",
            }}
          >
            Confirm Password
          </label>
          <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your password"
              required
              style={{
                flex: 1,
                padding: "8px 35px 8px 8px", 
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <img
              src={showConfirm ? "/img/eye-open.png" : "/img/eye-closed.png"}
              alt="toggle"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: "absolute",
                right: "10px",
                cursor: "pointer",
                width: "20px",
                height: "20px",
              }}
            />
          </div>
        </div>

        <button
          style={{
            width: "105%",
            padding: "10px",
            backgroundColor: "#207ED0",
            border: "none",
            color: "white",
            borderRadius: "14px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          type="submit"
        >
          Change Password
        </button>

        <p style={{ color: "#333", textAlign: "center", marginTop: "15px" }}>
          Back to{" "}
          <Link to="/" className="auth-link">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ChangePassword;
