
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/send-reset-otp", { email });
      toast.success(res.data.message || "OTP sent to your email");
      navigate("/set-new-password", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
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
            height: "405px",
            marginTop: "17%",
        }}
      >
        <h2
          style={{ 
            marginBottom: "19px", 
            textAlign: "left", 
            color: "#333",
            marginTop: "75px",
          }}
        >
          Reset your Password
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "#555",
            marginBottom: "1px",
            marginTop: "-13px",
            textAlign: "left",
          }}
        >
          Enter the email address associated with <br /> your account and we’ll send
          you a reset link.
        </p>

        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="email"
            style={{
             display: "block",
              marginTop: "9px",
              marginBottom: "5px",
              marginLeft:"2px",
              fontSize: "16px",
              color: "#333",
            }}
          >
            E-mail Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "95%",
              padding: "10px",
              borderRadius: "14px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          style={{
            width: "100%",
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
          Continue
        </button>

        <p style={{ color: "#333", textAlign: "center", marginTop: "10px", fontSize: "15px",}}>
          Back to{" "}
          <Link to="/" className="auth-link">
            Sign In
          </Link>
        </p>

        <p style={{ color: "#333", textAlign: "center", marginTop: "60px" }}>
          Don’t have an account?{" "}
          <Link to="/signup" className="auth-link">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;
