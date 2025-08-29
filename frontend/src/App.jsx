
import SignIn from './Sign in.jsx';
import SignUp from "./Sign Up.jsx";

import OtpInput from './Otp.jsx';
import ResetPassword from './resetPassword.jsx';
import SetNewPassword from './SetNewPassword.jsx';
import { VerifyEmail } from './VerifyEmail.jsx';
import Dashboard from './Dashboard.jsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/otp" element={<OtpInput />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
