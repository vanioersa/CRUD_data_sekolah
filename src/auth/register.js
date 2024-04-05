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

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("admin");

  const handleRegister = async (e) => {
    e.preventDefault();
    // Validasi jika username atau password kosong
    if (!username && !password) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Username dan password harus diisi",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (!username) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Username harus diisi",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (!password) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Password harus diisi",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    // Validasi panjang password
    if (password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Password harus terdiri dari minimal 8 karakter",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    // Validasi password harus mengandung angka dan huruf
    if (!password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])/)) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Password harus terdiri dari angka dan huruf",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    // Validasi huruf pertama username harus kapital
    if (!username.charAt(0).match(/^[A-Z]$/)) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Huruf pertama username harus kapital",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/register`, {
        username,
        password,
        role,
      });
      if (response && response.data) {
        Swal.fire({
          icon: "success",
          title: "Registrasi Berhasil!",
          text: "Anda telah berhasil registrasi.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          history.goBack();
        });
      } else {
        throw new Error("Data respons tidak ada.");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan";
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
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
        <div className="text">Registrasi</div>
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
        <button className="submit gray" onClick={handleRegister}>
          Register
        </button>
        <button
          className="submit gray"
          onClick={() => history.goBack()}
        >
          Kembali Masuk
        </button>
      </div>
    </div>
  );
};

export default Register;
