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
  const [usernameOrEmail, setusernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!usernameOrEmail && !password) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Email atau Username dan Password harus diisi.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    if (!usernameOrEmail) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Email atau Username harus diisi.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    if (!password) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Password harus diisi.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/login`, {
        usernameOrEmail,
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
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Data respons tidak ada.");
      }
    } catch (error) {
      console.error(error);
      let errorMessage = "Terjadi kesalahan";
      if (error.response?.status === 401) {
        errorMessage = "Email atau Username, atau Password salah";
      } else {
        errorMessage = error.response?.data?.message || "Terjadi kesalahan";
      }

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
    <div className="login-container">
      <div className="header">
        <div className="text">Masuk</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={userIcon} alt="User Icon" className="icon" />
          <input
            type="text"
            placeholder="Email atau Username"
            value={usernameOrEmail}
            onChange={(e) => setusernameOrEmail(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <img src={passwordIcon} alt="Password" className="icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <img
            alt="Toggle visibility"
            src={showPassword ? showIcon : hideIcon}
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

      <p className="fs-6 m-4">
        Jika belum daftar akun{" "}
        <a
          href="/register"
          style={{ textDecoration: "none" }}
          className="fs-6 fst-italic"
        >
          Klik disini
        </a>
      </p>

      <button className="submit gray" onClick={handleLogin}>
        Masuk
      </button>
    </div>
  );
};

export default Login;
