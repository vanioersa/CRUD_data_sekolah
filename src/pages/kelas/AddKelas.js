import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { createKelas } from "./api_kelas";

const AddKelas = () => {
  const [kelas, setKelas] = useState({
    kelas: "",
    jurusan: "",
    jumlah: "",
    tahunAjaran: new Date().getFullYear().toString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKelas((prevKelas) => ({
      ...prevKelas,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createKelas(kelas);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kelas berhasil ditambahkan",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        window.history.back();
      });
      setKelas({
        kelas: "",
        jurusan: "",
        jumlah: "",
        tahunAjaran: new Date().getFullYear().toString(),
      });
    } catch (error) {
      console.error("Failed to add Kelas: ", error);
      let errorMessage = "Gagal menambahkan kelas. Silakan coba lagi.";
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

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i.toString());
  }

  return (
    <div style={{ marginTop: "8%" }} className="container text-center">
      <h2 className="text-center mb-5">Tambah Kelas</h2>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="kelas">
                  <Form.Label>Kelas</Form.Label>
                  <Form.Select
                    name="kelas"
                    value={kelas.kelas}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  >
                    <option value="">Pilih Kelas</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="jurusan">
                  <Form.Label>Jurusan</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan nama jurusan"
                    name="jurusan"
                    value={kelas.jurusan}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="jumlah">
                  <Form.Label>Jumlah Murid</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukkan jumlah murid"
                    name="jumlah"
                    value={kelas.jumlah}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </Form.Group>
                </Col>
                <Col>
                <Form.Group className="mb-3" controlId="tahunAjaran">
                  <Form.Label>Tahun Ajaran</Form.Label>
                  <Form.Select
                    name="tahunAjaran"
                    value={kelas.tahunAjaran}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  >
                    <option value="">Pilih Tahun Ajaran</option>
                    {years.map((year) => {
                      const nextYear = parseInt(year) + 1;
                      return (
                        <option key={year} value={`${year}-${nextYear}`}>
                          {year} - {nextYear}
                        </option>
                      );
                    })}
                  </Form.Select>
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

export default AddKelas;
