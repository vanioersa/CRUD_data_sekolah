import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { createGuru } from "./api_guru";
import Swal from "sweetalert2";
import axios from "axios";

const AddGuru = () => {
  const [formData, setFormData] = useState({
    nama: "",
    telfon: "",
    alamat: "",
  });
  const [mapels, setMapels] = useState([]);
  const [kelasJurusan, setKelasJurusan] = useState([]);
  const [selectedMapel, setSelectedMapel] = useState("");
  const [selectedKelasJurusan, setSelectedKelasJurusan] = useState("");
  const history = useHistory();

  const fetchMapels = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/tugas_akhir/api/mapel/all"
      );
      setMapels(response.data);
    } catch (error) {
      console.error("Failed to fetch Mapels: ", error);
    }
  };

  const fetchKelasJurusan = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/tugas_akhir/api/kelas/all"
      );
      setKelasJurusan(response.data);
    } catch (error) {
      console.error("Failed to fetch Kelas and Jurusan: ", error);
    }
  };

  useEffect(() => {
    fetchMapels();
    fetchKelasJurusan();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const guruData = {
      nama: formData.nama,
      mapelId: selectedMapel,
      telfon: formData.telfon,
      alamat: formData.alamat,
      walikelasId: selectedKelasJurusan,
    };
    try {
      await createGuru(guruData);
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
                  <Form.Label>Guru Mapel</Form.Label>
                  <Form.Control
                    as="select"
                    name="mapel"
                    value={selectedMapel}
                    onChange={(e) => setSelectedMapel(e.target.value)}
                    required
                  >
                    <option value="">Pilih Mata Pelajaran</option>
                    {mapels.map((mapel) => (
                      <option key={mapel.id} value={mapel.id}>
                        {mapel.nama}
                      </option>
                    ))}
                  </Form.Control>
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

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="walikelas">
                  <Form.Label>Walikelas</Form.Label>
                  <Form.Control
                    as="select"
                    name="walikelas"
                    value={selectedKelasJurusan}
                    onChange={(e) => setSelectedKelasJurusan(e.target.value)}
                    required
                  >
                    <option value="">Pilih Kelas dan Jurusan</option>
                    {kelasJurusan.map((kelas) => (
                      <option key={kelas.id} value={kelas.id}>
                        {`${kelas.kelas} - ${kelas.jurusan}`}
                      </option>
                    ))}
                  </Form.Control>
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
