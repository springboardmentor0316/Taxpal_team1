import { Link } from "react-router-dom";

function SignIn() {
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
          height: "425px",
        }}
      >
        <h2
          style={{ marginBottom: "15px", textAlign: "center", color: "#333" }}
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
              marginBottom: "5px",
              letterSpacing: "1.3px",
              fontSize: "16px",
              color: "#333",
            }}
          >
            Username:
          </label>
          <input type="Text" placeholder="Username" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="Password" required />
          <div className="inline">
            <div className="space">
              <input type="checkbox" />
              <label>Remember me</label>
            </div>
            <a
              style={{
                color: "#207ED0",
                fontSize: "16px",
                textDecoration: "none",
              }}
              id="f"
              href="/verify-email"
            >
              Forgot password?
            </a>
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
          Sign In
        </button>
        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
