import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function SetNewPassword() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/auth/reset-password", {
        email,
        otp,
        newPassword
      });
      toast.success(res.data.message || "Password reset successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
          minHeight: "425px",
        }}
      >
        <h2 style={{ marginBottom: "4px", textAlign: "center", color: "#333", marginTop: "13px" }}>
          Set New Password
        </h2>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: "5px", fontSize: "16px", color: "#333" }}>
            E-mail Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "95%", padding: "10px", borderRadius: "14px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="otp" style={{ display: "block", marginBottom: "5px", fontSize: "16px", color: "#333" }}>
            OTP
          </label>
          <input
            id="otp"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={{ width: "95%", padding: "10px", borderRadius: "14px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "20px", position: "relative" }}>
          <label htmlFor="newPassword" style={{ display: "block", marginBottom: "5px", fontSize: "16px", color: "#333" }}>
            New Password
          </label>
          <input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: "90%", padding: "10px", borderRadius: "14px", border: "1px solid #ccc", paddingRight: "38px" }}
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: "18px",
              top: "38px",
              cursor: "pointer",
              color: "#888",
              fontSize: "18px"
            }}
            tabIndex={0}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div style={{ marginBottom: "20px", position: "relative" }}>
          <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "5px", fontSize: "16px", color: "#333" }}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: "90%", padding: "10px", borderRadius: "14px", border: "1px solid #ccc", paddingRight: "38px" }}
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: "18px",
              top: "38px",
              cursor: "pointer",
              color: "#888",
              fontSize: "18px"
            }}
            tabIndex={0}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: loading ? "#6ca2d9" : "#207ED0",
            border: "none",
            color: "white",
            borderRadius: "14px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          type="submit"
          disabled={loading}
        >
          {loading ? "Processing..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default SetNewPassword;
