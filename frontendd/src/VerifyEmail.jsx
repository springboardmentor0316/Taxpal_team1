import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from './config';

export function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const testOtp = params.get('testOtp');
    
    if (emailParam) {
      setEmail(emailParam);
    }
    
    
    if (testOtp) {
      setOtp(testOtp);
      console.log('Pre-filled OTP for testing:', testOtp);
    }
  }, [location]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      toast.error("Email and OTP are required");
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { email, otp });
      console.log("OTP verification response:", res.data);
      
      if (res.data.success) {
        toast.success("Email verified successfully!");
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast.error(res.data.message || "OTP verification failed");
        setLoading(false);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      toast.error(err.response?.data?.message || "OTP verification failed");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }
    
    setResendLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/resend-otp`, { email });
      console.log("Resend OTP response:", res.data);
     
      if (res.data.emailPreview) {
        toast.info(
          <div>
            <p>Test email sent! Click to view:</p>
            <a 
              href={res.data.emailPreview} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{color: 'white', textDecoration: 'underline'}}
            >
              View OTP Email
            </a>
          </div>,
          { autoClose: false }
        );
      } else {
        toast.success(res.data.message || "OTP resent successfully");
      }
      
      if (res.data.testOtp) {
        setOtp(res.data.testOtp);
        console.log('Using test OTP from resend:', res.data.testOtp);
      }
      
      setResendLoading(false);
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error(err.response?.data?.message || "Failed to resend OTP");
      setResendLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "-2px",
      backgroundImage: "linear-gradient(to bottom, #f5f7fa, #e4e7eb)",
    }}>
      <div className="container">
        <div className="head">
          <img src="img/taxpal1.png" alt="TaxPal Logo" className="logo" />
          <p className="para">Your trusted tax partner</p>
        </div>
        
        <div className="form-container">
          <form
            onSubmit={handleVerify}
            style={{
              backgroundColor: "white",
              padding: "36px 53px 28px",
              borderRadius: "5px",
              flexDirection: "column",
              alignItems: "stretch"
            }}
          >
            <h2 style={{
              marginBottom: "18px",
              textAlign: "center",
              color: "#207ED0",
              fontSize: "1.6rem",
              fontWeight: 700,
              letterSpacing: 1,
              color: "black"
            }}>
              Verify Your Email
            </h2>
            <p style={{
              fontSize: "14px",
              color: "#555",
              marginBottom: "20px",
              textAlign: "center",
            }}>
              Please enter the verification code sent to your email address.
            </p>
            
            <div className="form-group">
              <label style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "14px",
                color: "#333",
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                readOnly={!!email}
                style={{
                  width: "100%",
                  padding: "13px",
                  marginBottom: "15px",
                  borderRadius: "14px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                }}
                required
              />
            </div>
            
            <div className="form-group">
              <label style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "14px",
                color: "#333",
              }}>
                OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP code"
                style={{
                  width: "100%",
                  padding: "13px",
                  marginBottom: "15px",
                  borderRadius: "14px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  letterSpacing: "0.25em",
                }}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "107%",
                padding: "12px",
                backgroundColor: loading ? "#6ca2d9" : "#207ED0",
                border: "none",
                borderRadius: "14px",
                color: "white",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                marginBottom: "15px",
              }}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
            
            <p style={{ fontSize: "14px", color: "#555", textAlign: "center" }}>
              Didn't receive OTP? <a href="#" onClick={(e) => {
                e.preventDefault();
                if (!resendLoading) {
                  handleResendOtp();
                }
              }} style={{
                color: resendLoading ? "#6ca2d9" : "#207ED0",
                textDecoration: "none",
                fontWeight: "500",
                cursor: resendLoading ? "not-allowed" : "pointer",
              }}>
                {resendLoading ? "Resending..." : "Resend OTP"}
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;