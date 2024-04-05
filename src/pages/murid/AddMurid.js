import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { createMurid } from "./api_murid";
import { useHistory } from "react-router-dom";

const AddMurid = () => {
  const [murid, setMurid] = useState({
    nama: "",
    nik: "",
    nisn: "",
    lahir: "",
    umur: "",
    alamat: "",
  });
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lahir") {
      const birthDate = new Date(value);
      const today = new Date();
      const diffYears = today.getFullYear() - birthDate.getFullYear();

      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() < birthDate.getDate())
      ) {
        setMurid((prevMurid) => ({
          ...prevMurid,
          [name]: value,
          umur: (diffYears - 1).toString(),
        }));
      } else {
        setMurid((prevMurid) => ({
          ...prevMurid,
          [name]: value,
          umur: diffYears.toString(),
        }));
      }
    } else {
      setMurid((prevMurid) => ({
        ...prevMurid,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const birthDate = new Date(murid.lahir);
      const formattedBirthDate = `${("0" + birthDate.getDate()).slice(-2)}-${(
        "0" +
        (birthDate.getMonth() + 1)
      ).slice(-2)}-${birthDate.getFullYear()}`;

      await createMurid({ ...murid, lahir: formattedBirthDate, umur: murid.umur + " Tahun" });
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Murid berhasil ditambahkan",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        history.goBack();
      });
      setMurid({
        nama: "",
        nik: "",
        nisn: "",
        lahir: "",
        umur: "",
        alamat: "",
      });
    } catch (error) {
      console.error("Failed to add Murid: ", error);
      let errorMessage = "Gagal menambahkan murid. Silakan coba lagi.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      Swal.fire("Gagal", errorMessage, "error");
    }
  };

  return (
    <div style={{ marginTop: "5%" }} className="container text-center">
      <h2 className="text-center mb-5">Tambah Murid</h2>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="nama">
                  <Form.Label>Nama Murid</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan nama murid"
                    name="nama"
                    value={murid.nama}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="alamat">
                  <Form.Label>Alamat</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan alamat murid"
                    name="alamat"
                    value={murid.alamat}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="lahir">
                  <Form.Label>Tanggal Lahir</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Masukkan tanggal lahir murid"
                    name="lahir"
                    value={murid.lahir}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    max={new Date().toISOString().split("T")[0]}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="umur">
                  <Form.Label>Umur</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Umur"
                    name="umur"
                    value={`${murid.umur} Tahun`}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="nik">
                  <Form.Label>NIK</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukkan NIK murid"
                    name="nik"
                    value={murid.nik}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="nisn">
                  <Form.Label>NISN</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukkan NISN murid"
                    name="nisn"
                    value={murid.nisn}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddMurid;
