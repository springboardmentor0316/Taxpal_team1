import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      console.log("Login response:", res.data);

      toast.success(res.data.message || "Login successful", { toastId: "loginSuccess" });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      console.log("Backend unavailable, using localStorage fallback...");

      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          const mockToken = 'local_' + Date.now();
          const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            country: user.country,
            income: user.income
          };
          
          localStorage.setItem("token", mockToken);
          localStorage.setItem("user", JSON.stringify(userData));
          
          toast.success("Login successful!", { toastId: "loginSuccess" });
          navigate("/dashboard");
        } else {
          toast.error("Invalid email or password", { toastId: "invalidCreds" });
          setLoading(false);
        }
      } catch (localErr) {
        console.error("Local storage error:", localErr);
        toast.error("Login failed. Please try again.", { toastId: "loginFailed" });
        setLoading(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <>
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
              marginBottom: "15px",
              textAlign: "center",
              color: "#333",
              marginTop: "20px",
            }}
          >
            Sign in
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#555",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            Please enter your details to sign in.
          </p>
          <div>
            <label
              style={{
                display: "block",
                marginTop: "2px",
                marginBottom: "5px",
                fontSize: "16px",
                color: "#333",
              }}
            >
              Email or Username:
            </label>
            <input
              type="text"
              placeholder="Email or Username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{ position: "relative" }}>
            <label
              style={{
                fontSize: "16px",
                color: "#333333",
                marginBottom: "5px",
                display: "block",
              }}
            >
              Password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "89%",
                padding: "10px 38px 10px 10px",
                borderRadius: "14px",
                border: "1px solid #070707",
                fontSize: "14px",
                color: "black",
                backgroundColor: "white",
              }}
            />
            <span
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute",
                right: 12,
                top: 38,
                cursor: "pointer",
                color: "#888",
                fontSize: 18,
              }}
              tabIndex={0}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            <div className="inline">
              <Link
                to="/reset-password"
                style={{
                  color: "#207ED0",
                  fontSize: "16px",
                  textDecoration: "none",
                  marginLeft: "70%",
                }}
              >
                Forgot password?
              </Link>
            </div>
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p style={{ textAlign: "center", marginTop: "3px", color: "black" }}>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default SignIn;
