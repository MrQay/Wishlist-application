import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { login, register } from '../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import '../css/Auth.css';

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoginActive, setIsLoginActive] = useState(true);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      if (data.status === 200) {
        toast.success("Logged in.");
        setEmail("");
        setPassword("");
        Cookies.set("authToken", data.data.authToken);
        window.location.href = "/wishlist";
      }
    } catch (e: any) {
      const errorMessage = e.response && e.response.data && e.response.data.message ? e.response.data.message : "An unexpected error occurred";
      toast.error(errorMessage);
    }

  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!(confirmPassword === password)) {
      toast.error("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password length should be at least 8.");
      return;
    }
    try {
      const data = await register(email, password);

      if (data.status === 200) {
        toast.success("User created successfully.");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsLoginActive(true);
      }
    } catch (e: any) {
      const errorMessage = e.response && e.response.data && e.response.data.message ? e.response.data.message : "An unexpected error occurred";
      toast.error(errorMessage);
    }

  };

  return (
    <div className="auth-container">
      <div className="auth-box shadow-lg">
        <div className="switcher">
          <button data-testid="login-switch" className={`btn-switch ${isLoginActive ? 'active' : ''}`} onClick={() => setIsLoginActive(true)}>Login</button>
          <button data-testid="register-switch" className={`btn-switch ${!isLoginActive ? 'active' : ''}`} onClick={() => setIsLoginActive(false)}>Register</button>
        </div>
        <form className="auth-form" onSubmit={isLoginActive ? handleLogin : handleRegister}>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <input type="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faLock} className="icon" />
            <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} />
          </div>
          {!isLoginActive && (
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faLock} className="icon" />
              <input type="password" placeholder="Confirm Password" value={confirmPassword} required onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          )}
          <button data-testid="auth-submit" type="submit" className="submit-btn">
            {isLoginActive ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;