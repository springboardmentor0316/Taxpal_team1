import { useState } from "react";

function OtpInput() {
  const [otp, setOtp] = useState(new Array(4).fill(""));

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return; // allow only numbers
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // auto move to next
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Entered OTP: " + otp.join(""));
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
        style={{
          backgroundColor: "white",
          padding: "30px",
          marginRight: "40px",
          borderRadius: "40px",
          boxShadow: "10px 10px 5px rgba(170, 168, 168, 0.5)",
          width: "420px",
          height: "460px",
           textAlign: "center"
        }}
      >
          <h3 style={{ marginBottom: "20px",  textAlign: "center",color: "#333" }}>Enter Your OTP</h3>
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
                  width: "40px",
                  height: "40px",
                  textAlign: "center",
                  fontSize: "18px",
                  borderRadius: "8px",
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
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Verify
          </button>

          <p style={{ marginTop: "15px",  textAlign: "center",fontSize: "13px", color: "#555" }}>
            Didn’t receive an OTP?{" "}
            <span style={{ color: "#207ED0", cursor: "pointer" }}>Resend</span>
          </p>
        </form>
      </div>
    
  );
}

export default OtpInput;
