import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./components/Sign Up.jsx";
import SignIn from "./components/Sign in.jsx";
import OtpInput from "./components/Otp.jsx";
import VerifyEmail from "./components/VerifyEmail.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ResetPassword from "./components/resetPassword.jsx";
import SetNewPassword from "./components/SetNewPassword.jsx";
import Budget from "./components/BudgetSet.jsx"
import SettingPage from "./components/SettingPage.jsx"
import "./App.css";
import TaxEstimator from "./components/TaxEstimator.jsx";
import Report from "./components/Report.jsx";
import Transactions from "./components/Transactions.jsx";

function App() {
  
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} limit={1} newestOnTop closeOnClick />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otp" element={<OtpInput />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/setting-page" element={<SettingPage />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/tax-estimator" element={<TaxEstimator />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route path="/report" element={<Report />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
