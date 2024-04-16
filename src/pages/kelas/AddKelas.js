import React, { useState } from "react";
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { createKelas } from "./api_kelas";

const AddKelas = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i.toString());
  }

  const [kelas, setKelas] = useState({
    kelas: "",
    jurusan: "",
    jumlah: "",
    tahunAjaran: `${currentYear}-${currentYear + 1}`,
  });

  const [kelasOptions, setKelasOptions] = useState([
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
    { label: "Lainnya", value: "" },
  ]);

  const [showKelasModal, setShowKelasModal] = useState(false);
  const [customKelas, setCustomKelas] = useState("");
  const [lainnyaAdded, setLainnyaAdded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKelas((prevKelas) => ({
      ...prevKelas,
      [name]: value,
    }));
  };

  const handleKelasSubmit = () => {
    setKelas((prevKelas) => ({
      ...prevKelas,
      kelas: customKelas,
    }));
    setShowKelasModal(false);
    setKelasOptions((prevOptions) => {
      if (!lainnyaAdded) {
        return [
          ...prevOptions.slice(0, prevOptions.length - 1),
          { label: customKelas, value: customKelas },
        ];
      }
      return prevOptions.map((option) =>
        option.value === "" ? { label: customKelas, value: customKelas } : option
      );
    });
    setLainnyaAdded(true);
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
      // Reset the state after successful submission
      setKelas({
        kelas: "",
        jurusan: "",
        jumlah: "",
        tahunAjaran: `${currentYear}-${currentYear + 1}`,
      });
    } catch (error) {
      console.error("Failed to add Kelas: ", error);
      let errorMessage = "Gagal menambahkan kelas. Silakan coba lagi.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      Swal.fire("Gagal", errorMessage, "error");
    }
  };

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
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setShowKelasModal(true);
                      } else {
                        handleChange(e);
                      }
                    }}
                    autoComplete="off"
                    required
                  >
                    <option value="">Pilih Kelas</option>
                    {kelasOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
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

      <Modal
        show={showKelasModal}
        onHide={() => setShowKelasModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tambah Kelas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Masukkan kelas baru"
            value={customKelas}
            onChange={(e) => setCustomKelas(e.target.value)}
            autoComplete="off"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowKelasModal(false)}
            style={{ marginRight: "auto" }}
          >
            Batal
          </Button>
          <Button variant="primary" onClick={handleKelasSubmit}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddKelas;
