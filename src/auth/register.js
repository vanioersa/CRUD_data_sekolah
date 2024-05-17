import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./css/Register.css";

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
  const [email, setEmail] = useState("");
  const [role] = useState("admin");

  const handleRegister = async (e) => {
    e.preventDefault();
    // Validasi jika username, email, atau password kosong
    if (!username && !email && !password) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Username, email, dan password harus diisi",
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
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Email harus diisi",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (!validateEmail(email)) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Email tidak valid",
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
        email,
        password,
        role,
      });
      if (response && response.data) {
        Swal.fire({
          icon: "success",
          title: "Daftar Berhasil!",
          text: "Anda telah berhasil Mendaftar.",
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

  const validateEmail = (email) => {
    // Regex untuk validasi email sederhana
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <div className="register-container">
      <div className="header">
        <div className="text">Daftar</div>
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

        <div className="input">
          <img src={userIcon} alt="Email Icon" className="icon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <p className="fs-6 m-4">
        Jika sudah punya akun{" "}
        <a
          href="/login"
          style={{ textDecoration: "none" }}
          className="fs-6 fst-italic"
        >
          Klik disini
        </a>
      </p>

      <button className="submit gray" onClick={handleRegister}>
        Daftar
      </button>
    </div>
  );
};

export default Register;
