import { useState } from "react";
import { Link } from "react-router-dom";

function ResetPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Reset link will be sent to: ${email}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Left Logo/Brand */}
      <div className="head">
        <img src="/img/taxpal1.png" alt="taxpal" className="logo" />
        <p className="para">Your trusted tax partner</p>
      </div>

      {/* Right Card */}
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
          style={{ 
            marginBottom: "14px", 
            textAlign: "left", 
            color: "#333",
            marginTop: "95px",
          }}
        >
          Reset your Password
        </h2>

        <p
          style={{
            fontSize: "14px",
            marginTop: "5px",
            color: "#555",
            marginBottom: "1px",
            marginTop: "-14px",
            textAlign: "left",
          }}
        >
          Enter the email address associated with <br /> your account and we’ll send
          you a reset link.
        </p>

        {/* Email Input */}
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="email"
            style={{
             display: "block",
              marginTop: "2px",
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
           <Link to="/otp" className="auth-link">
             Continue
            </Link>
        </button>

        <p style={{ color: "#333", textAlign: "center", marginTop: "10px", fontSize: "15px",}}>
          Back to{" "}
          <Link to="/signin" className="auth-link">
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
