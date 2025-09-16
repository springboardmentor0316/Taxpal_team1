import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "./config";
import { useEffect } from "react";
function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [income, setIncome] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!country) {
      toast.error("Please select your country");
      return;
    }

    if (!income) {
      toast.error("Please select your income bracket");
      return;
    }

    setLoading(true);
    try {
      console.log("Submitting data:", {
        name,
        email,
        password,
        country,
        income,
      });

      // Try backend first
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
        country,
        income,
      });

      console.log("Registration response:", res.data);

      if (res.data.success !== false) {
        toast.success(
          res.data.message ||
            "Registration successful! Please verify your email."
        );

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setCountry("");
        setIncome("");

        if (res.data.emailPreview) {
          toast.info(
            <div>
              <p>Test email sent! Click to view:</p>
              <a
                href={res.data.emailPreview}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "white", textDecoration: "underline" }}
              >
                View OTP Email
              </a>
            </div>,
            { autoClose: false }
          );
        }

        let redirectUrl = `/verify-email?email=${encodeURIComponent(email)}`;
        if (res.data.testOtp) {
          redirectUrl += `&testOtp=${res.data.testOtp}`;
          console.log("Using test OTP for development:", res.data.testOtp);
        }

        navigate(redirectUrl);
      } else {
        toast.error(res.data.message || "Registration failed");
        setLoading(false);
      }
    } catch (err) {
      console.error("Registration error:", err);
      console.log("Backend unavailable, using localStorage fallback...");
      
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
          toast.error("User already exists with this email");
          setLoading(false);
          return;
        }

        const newUser = {
          id: Date.now(),
          name,
          email,
          password, 
          country,
          income,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        toast.success("Registration successful! You can now sign in.");

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setCountry("");
        setIncome("");

        navigate("/");
      } catch (localErr) {
        console.error("Local storage error:", localErr);
        toast.error("Registration failed. Please try again.");
      }
      setLoading(false);
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
        <img src="img/taxpal1.png" alt="hello" className="logo" />
        <p className="para">Your trusted tax partner</p>
      </div>

      <div className="form-container">
        <h2
          style={{
            marginBottom: "-9%",
            textAlign: "center",
            color: "#333",
            marginLeft: "-15%",
            marginTop: "4%",
          }}
        >
          Sign Up
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "white",
            padding: "34px",
            marginRight: "98px",
            borderRadius: "40px",
            boxShadow: "10px 10px 5px rgba(170, 168, 168, 0.5)",
            width: "420px",
            height: "580px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#555",
              marginBottom: "21px",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            Please enter your to create account.
          </p>
          <div className="form-group">
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                marginTop: "-13px",
                letterSpacing: "1.3px",
                fontSize: "16px",
                color: "#333",
              }}
            >
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "92%",
                padding: "10px 38px 10px 10px",
                borderRadius: "14px",
                border: "1px solid #070707",
                fontSize: "14px",
                color: "black",
                backgroundColor: "white",
              }}
            />
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <label
              style={{
                fontSize: "16px",
                color: "#333333",
                marginBottom: "5px",
                marginTop: "-13px",
                display: "block",
              }}
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "92%",
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
                top: 25,
                cursor: "pointer",
                color: "#888",
                fontSize: 18,
              }}
              tabIndex={0}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <label
              style={{
                fontSize: "16px",
                color: "#333333",
                marginBottom: "5px",
                marginTop: "-13px",
                display: "block",
              }}
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "92%",
                padding: "10px 38px 10px 10px",
                borderRadius: "14px",
                border: "1px solid #070707",
                fontSize: "14px",
                color: "black",
                backgroundColor: "white",
              }}
            />
            <span
              onClick={() => setShowConfirmPassword((v) => !v)}
              style={{
                position: "absolute",
                right: 12,
                top: 25,
                cursor: "pointer",
                color: "#888",
                fontSize: 18,
              }}
              tabIndex={0}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="form-group">
            <label
              style={{
                fontSize: "16px",
                color: "#333333",
                marginTop: "-15px",
                marginBottom: "5px",
                display: "block",
              }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "99%",
                padding: "10px",
                marginBottom: "13px",
                borderRadius: "14px",
                border: "1px solid #070707",
                fontSize: "14px",
                color: "black",
                backgroundColor: "white",
              }}
            />
          </div>

          <div className="form-group">
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                marginTop: "-13px",
                fontSize: "16px",
                color: "#333",
              }}
            >
              Select Your Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              style={{
                width: "105%",
                padding: "11px",
                borderRadius: "15px",
                border: "1px solid #07070",
                fontSize: " 14px",
                color: "black",
                backgroundColor: "white",
              }}
            >
              <option
                value=""
                disabled
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  aligItems: "center",
                  marginBottom: "15px",
                  fontSize: "14px",
                }}
              >
                Select your country
              </option>
              <option value="india">India</option>
              <option value="usa">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="canada">Canada</option>
              <option value="australia">Australia</option>
              <option value="germany">Germany</option>
              <option value="france">France</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label
              style={{
                display: "block",
                marginBottom: "9px",
                marginTop: "13px",
                fontSize: "16px",
                marginTop: "-10px",
                color: "#333",
              }}
            >
              Select your Income Bracket
            </label>
            <select
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              required
              style={{
                width: "104.7%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "15px",
                border: "1px solid #07070",
                fontSize: " 14px",
                color: "black",
                backgroundColor: "white",
              }}
            >
              <option
                value=""
                disabled
                style={{
                  width: "105%",
                  padding: "12px",
                  marginBottom: "15px",
                  borderRadius: "15px",
                  border: "1px solid #07070",
                  fontSize: " 14px",
                  color: "black",
                  backgroundColor: "white",
                }}
              >
                Select your income bracket (optional)
              </option>
              <option value="low">Below $20,000</option>
              <option value="mid">20,000 - 50,000</option>
              <option value="high">50,000 - 100,000</option>
              <option value="very-high">Above 100,000</option>
            </select>
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
            {loading ? "Processing..." : "Sign Up"}
          </button>
          <p
            style={{
              marginTop: "8px",
              textAlign: "center",
              color: "black",
            }}
          >
            Already have an account?{" "}
            <Link to="/" className="auth-link">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
