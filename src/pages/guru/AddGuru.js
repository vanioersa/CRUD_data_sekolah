import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { createGuru } from "./api_guru";
import Swal from "sweetalert2";

const AddGuru = () => {
  const [formData, setFormData] = useState({
    nama: "",
    mapel: "",
    telfon: "",
    alamat: "",
  });
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGuru(formData);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Guru berhasil ditambahkan",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        history.goBack();
      });
      setFormData({
        nama: "",
        mapel: "",
        telfon: "",
        alamat: "",
      });
    } catch (error) {
      console.error("Failed to create Guru: ", error);
      Swal.fire(
        "Gagal!",
        "Gagal menambahkan Guru. Silakan coba lagi.",
        "error"
      );
    }
  };

  return (
    <div style={{ marginTop: "8%" }} className="container text-center">
      <h2 className="text-center mb-5">Tambah Guru</h2>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="nama">
                  <Form.Label>Nama</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="mapel">
                  <Form.Label>Mata Pelajaran</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Mata Pelajaran"
                    name="mapel"
                    value={formData.mapel}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="telfon">
                  <Form.Label>No. Telfon</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukan nomor HP"
                    name="telfon"
                    value={formData.telfon}
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
                    placeholder="Masukan alamat"
                    name="alamat"
                    value={formData.alamat}
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

export default AddGuru;
