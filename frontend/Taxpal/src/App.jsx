import SignIn from './Sign in.jsx';
import SignUp from "./Sign Up.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
