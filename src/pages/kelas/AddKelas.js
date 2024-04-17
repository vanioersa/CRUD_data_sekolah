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
  ]);

  const [jurusanOptions, setJurusanOptions] = useState([
    { label: "TKJ", value: "TKJ" },
    { label: "TB", value: "TB" },
    { label: "TBSM", value: "TBSM" },
    { label: "AKL", value: "AKL" },
  ]);

  const [tahunAjaranOptions, setTahunAjaranOptions] = useState([
    `${currentYear} - ${currentYear + 1}`,
  ]);

  const [showKelasModal, setShowKelasModal] = useState(false);
  const [showJurusanModal, setShowJurusanModal] = useState(false);
  const [showTahunAjaranModal, setShowTahunAjaranModal] = useState(false);
  const [customKelas, setCustomKelas] = useState("");
  const [customJurusan, setCustomJurusan] = useState("");
  const [customTahunAjaran, setCustomTahunAjaran] = useState(
    `${currentYear}-${currentYear + 1}`
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "kelas" && value === "Lainnya") {
      setCustomKelas(true);
    } else if (name === "jurusan" && value === "Lainnya") {
      setCustomJurusan(true);
    } else {
      setKelas((prevKelas) => ({
        ...prevKelas,
        [name]: value,
      }));
    }
  };

  const handleKelasSubmit = () => {
    setKelasOptions((prevOptions) => [
      ...prevOptions,
      { label: customKelas, value: customKelas },
    ]);
    setKelas((prevKelas) => ({
      ...prevKelas,
      kelas: customKelas,
    }));
    setShowKelasModal(false);
  };

  const handleJurusanSubmit = () => {
    setJurusanOptions((prevOptions) => [
      ...prevOptions,
      { label: customJurusan, value: customJurusan },
    ]);
    setKelas((prevKelas) => ({
      ...prevKelas,
      jurusan: customJurusan,
    }));
    setShowJurusanModal(false);
  };

  const handleTahunAjaranSubmit = () => {
    const [startYear, endYear] = customTahunAjaran.split("-").map(Number);
    const currentYear = new Date().getFullYear();

    if (startYear < currentYear - 25 || endYear > currentYear + 1) {
      Swal.fire({
        icon: "error",
        title: "Batas Tahun Ajaran",
        text: "Mohon maaf, tahun ajaran hanya dapat diatur dalam rentang 25 tahun ke belakang dan 1 tahun ke depan.",
        timer: 3000,
        showConfirmButton: false
      });
      
      return;
    }

    setTahunAjaranOptions((prevOptions) => [...prevOptions, customTahunAjaran]);
    setKelas((prevKelas) => ({
      ...prevKelas,
      tahunAjaran: customTahunAjaran,
    }));
    setShowTahunAjaranModal(false);
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
        tahunAjaran: `${currentYear}-${currentYear + 1}`,
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
                      if (value === "Lainnya") {
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
                    <option value="Lainnya">Lainnya</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="jurusan">
                  <Form.Label>Jurusan</Form.Label>
                  <Form.Select
                    name="jurusan"
                    value={kelas.jurusan}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "Lainnya") {
                        setShowJurusanModal(true);
                      } else {
                        handleChange(e);
                      }
                    }}
                    autoComplete="off"
                    required
                  >
                    <option value="">Pilih Jurusan</option>
                    {jurusanOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                    <option value="Lainnya">Lainnya</option>
                  </Form.Select>
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
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "Lainnya") {
                        setShowTahunAjaranModal(true);
                      } else {
                        handleChange(e);
                      }
                    }}
                    autoComplete="off"
                    required
                  >
                    <option value="">Pilih Tahun Ajaran</option>
                    {tahunAjaranOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                    <option value="Lainnya">Lainnya</option>
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

      <Modal
        show={showJurusanModal}
        onHide={() => setShowJurusanModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tambah Jurusan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Masukkan jurusan baru"
            value={customJurusan}
            onChange={(e) => setCustomJurusan(e.target.value)}
            autoComplete="off"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowJurusanModal(false)}
            style={{ marginRight: "auto" }}
          >
            Batal
          </Button>
          <Button variant="primary" onClick={handleJurusanSubmit}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showTahunAjaranModal}
        onHide={() => setShowTahunAjaranModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tambah Tahun Ajaran</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Masukkan tahun ajaran baru"
            value={customTahunAjaran}
            onChange={(e) => setCustomTahunAjaran(e.target.value)}
            autoComplete="off"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowTahunAjaranModal(false)}
            style={{ marginRight: "auto" }}
          >
            Batal
          </Button>
          <Button variant="primary" onClick={handleTahunAjaranSubmit}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddKelas;
