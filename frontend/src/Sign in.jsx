import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from './config';

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      
      console.log('Login response:', res.data);
      
      toast.success(res.data.message || "Login successful");
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      
      navigate("/dashboard");
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || "Login failed");
      setLoading(false);
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
            height: "425px",
          }}
        >
          <h2
            style={{ marginBottom: "15px", textAlign: "center", color: "#333", marginTop: "20px" }}
          >
            Sign in
          </h2>
          <p
            style={{ fontSize: "14px", color: "#555", marginBottom: "15px", textAlign: "center" }}
          >
            Please enter your details to sign in.
          </p>
          <div>
            <label
              style={{ display: "block", marginTop: "2px", marginBottom: "5px", fontSize: "16px", color: "#333" }}
            >
              Username:
            </label>
            <input
              type="text"
              placeholder="Username"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: "16px", color: "#333333", marginBottom: "5px", display: "block" }}>Password:</label>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <div className="inline">
              <div className="space">
                <input type="checkbox" />
                <label>Remember me</label>
              </div>
              <a
                style={{ color: "#207ED0", fontSize: "16px", textDecoration: "none", marginLeft: "23%" }}
                id="f"
                href="/verify-email"
              >
                Forgot password?
              </a>
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
          <p style={{ textAlign: "center", marginTop: "3px" }}>
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
