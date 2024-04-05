import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./css/login.css";

import showIcon from "../assets/show.png";
import hideIcon from "../assets/hide.png";
import userIcon from "../assets/user.png";
import passwordIcon from "../assets/password.png";

const apiUrl = "http://localhost:8080";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        username,
        password,
      });
      if (response && response.data) {
        const token = response.data.token;
        const username = response.data.username;

        localStorage.setItem("token", token);
        localStorage.setItem("username", username);

        Swal.fire({
          icon: "success",
          title: "Login Berhasil",
          text: "Anda berhasil login.",
          timer: 2000,
          showConfirmButton: false,
        });

        history.push("/dashboard");
        setTimeout(()=>{
          window.location.reload()
        } , 2000)
      } else {
        throw new Error("Data respons tidak ada.");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan";
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: errorMessage,
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div
      style={{
        marginTop: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      className="container"
    >
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={userIcon} alt="User Icon" className="icon" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input">
          <img src={passwordIcon} alt="Password" className="icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <img
            alt="Toggle visibility"
            src={showPassword ? hideIcon : showIcon}
            onClick={() => setShowPassword(!showPassword)}
            style={{
              cursor: "pointer",
              marginRight: "10px",
              width: "20px",
              height: "18px",
            }}
          />
        </div>
      </div>

      <div className="submit-container">
        <button className="submit gray" onClick={handleLogin}>
          Login
        </button>
        <a className="text-decoration-none submit gray" href="/register">
          Daftar Akun
        </a>
      </div>
    </div>
  );
};

export default Login;
