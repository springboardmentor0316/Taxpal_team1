import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "./config";
import { useLocation } from "react-router-dom";

function OtpInput() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    const testOtp = params.get("testOtp");
    if (emailParam) setEmail(emailParam);
    if (testOtp && testOtp.length === 6) {
      setOtp(testOtp.split(""));
    }
  }, [location]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return; 
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        email,
        otp: otp.join("")
      });
      toast.success(res.data.message || "OTP verified!");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email to resend OTP");
      return;
    }
    try {
      setResendLoading(true);
      const res = await axios.post(`${API_BASE_URL}/auth/resend-otp`, { email });
      if (res.data.emailPreview) {
        toast.info("OTP resent. Check the test email preview link in console.");
        if (res.data.emailPreview) console.log("Ethereal preview:", res.data.emailPreview);
      } else {
        toast.success(res.data.message || "OTP resent successfully");
      }
      if (res.data.testOtp) {
        setOtp(res.data.testOtp.split(""));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
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
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, color: "#333" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: "93%",
                padding: "10px",
                borderRadius: "14px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
              required
            />
          </div>
          <h3 style={{ marginBottom: "20px",  textAlign: "center",color: "#333", marginTop: "90px", }}>Enter Your OTP</h3>
           <p
          style={{
            fontSize: "14px",
            color: "#555",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          Please enter your OTP.
        </p>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                width: "30px",
                marginTop: "15px",
                height: "30px",
                textAlign: "center",
                fontSize: "18px",
                borderRadius: "14px",
                border: "1px solid #ccc",
              }}
            />
          ))}
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#207ED0",
            border: "none",
            color: "white",
            borderRadius: "14px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "-5%",
          }}
        >
          Submit
        </button>

          <p style={{ marginTop: "90px",  textAlign: "center",fontSize: "15px", color: "#555" }}>
            Didn’t receive an OTP?{" "}
            <span onClick={resendLoading ? undefined : handleResend} style={{ color: resendLoading ? "#6ca2d9" : "#207ED0", cursor: resendLoading ? "not-allowed" : "pointer" }}>
              {resendLoading ? "Resending..." : "Resend"}
            </span>
          </p>
        </form>
      </div>
    
  );
}

export default OtpInput;
