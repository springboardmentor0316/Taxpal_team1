import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";



function ChangePassword() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3000/api/auth/change-password", {
        email,
        oldPassword: "", 
        newPassword
      });
      toast.success(res.data.message || "Password changed successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    }
  };

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
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          padding: "30px",
          marginRight: "98px",
          borderRadius: "40px",
          boxShadow: "10px 10px 5px rgba(170, 168, 168, 0.5)",
          width: "420px",
          height: "425px",
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

        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "16px", color: "#333" }}>
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ flex: 1, padding: "8px", borderRadius: "14px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "16px", color: "#333" }}>
            New Password
          </label>
          <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            <input
              type={showNew ? "text" : "password"}
              placeholder="Enter your password"
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ flex: 1, padding: "8px 35px 8px 8px", borderRadius: "14px", border: "1px solid #ccc" }}
            />
            <img
              src={showNew ? "/img/eye-open.png" : "/img/eye-closed.png"}
              alt="toggle"
              onClick={() => setShowNew(!showNew)}
              style={{ position: "absolute", right: "10px", cursor: "pointer", width: "20px", height: "20px" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "16px", color: "#333" }}>
            Confirm Password
          </label>
          <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{ flex: 1, padding: "8px 35px 8px 8px", borderRadius: "14px", border: "1px solid #ccc" }}
            />
            <img
              src={showConfirm ? "/img/eye-open.png" : "/img/eye-closed.png"}
              alt="toggle"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{ position: "absolute", right: "10px", cursor: "pointer", width: "20px", height: "20px" }}
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
