import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./Sign Up.jsx";
import SignIn from "./Sign in.jsx";
import OtpInput from "./Otp.jsx";
import VerifyEmail from "./VerifyEmail.jsx";
import Dashboard from "./Dashboard.jsx";
import ResetPassword from "./resetPassword.jsx";
import SetNewPassword from "./SetNewPassword.jsx";
import "./App.css";


function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otp" element={<OtpInput />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
