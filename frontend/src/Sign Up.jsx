import { Link } from "react-router-dom";

function SignUp() {
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
          style={{ marginBottom: "-9%", textAlign: "center", color: "#333", marginLeft: "-15%", }}
        >
          Sign Up
        </h2>
        <form
          style={{
            backgroundColor: "white",
            padding: "34px",
            marginRight: "98px",
            borderRadius: "40px",
            boxShadow: "10px 10px 5px rgba(170, 168, 168, 0.5)",
            width: "420px",
          height: "565px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#555",
              marginBottom: "15px",
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
                marginTop: "-18px",
                letterSpacing: "1.3px",
                fontSize: "16px",
                color: "#333",
              }}
            >
              Username
            </label>
            <input type="text" placeholder="Username" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Password" required />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="text" placeholder="Confirm Password" required />
            
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="text" placeholder="Email" required />
          </div>

          <div className="form-group">
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "16px",
                color: "#333",
              }}
            >
              Select Your Country
            </label>
            <select
              defaultValue=""
              required
              style={{
                width: "100%",
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
                  fontSize: "14px"
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
                color: "#333",
              }}
            >
              Select your Income Bracket
            </label>
            <select
              defaultValue=""
              required
              style={{
                width: "100%",
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
              backgroundColor: "#207ED0",
              border: "none",
              color: "white",
              borderRadius: "14px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            type="submit"
          >
            Sign Up
          </button>
          <p style={{
            marginTop: "8px",
            textAlign: "center",
          }}>
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
