import React from "react";
import "./css/auth.css";

const Auth = () => {
  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="login-box">
          <div className="login-title">ADMIN PANEL</div>

          <div className="login-form">
            <form>
              <label>USERNAME</label>
              <input type="text" className="input-field" />
              <label>PASSWORD</label>
              <input type="password" className="input-field" />

              <div className="login-button">
                <button type="submit" className="btn btn-outline-primary">
                  LOGIN
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
