import SignIn from './Sign in.jsx';
import SignUp from "./Sign Up.jsx";
import ChangePassword from './changePassword.jsx';
import OtpInput from './Otp.jsx';
import ResetPassword from './resetPassword.jsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/change-password" element={<ChangePassword/>} />
          <Route path="/Otp" element={<OtpInput/>}/>
          <Route path="/verify-email" element={<ResetPassword/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
