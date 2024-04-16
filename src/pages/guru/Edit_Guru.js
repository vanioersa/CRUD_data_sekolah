import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { getGuruById, updateGuru } from "./api_guru";
import { useHistory } from "react-router-dom";
import axios from "axios";

const EditGuru = ({ match }) => {
  const [formData, setFormData] = useState({
    nama: "",
    mapelId: "",
    telfon: "",
    alamat: "",
    walikelasId: "",
  });
  const [mapels, setMapels] = useState([]);
  const [kelasJurusan, setKelasJurusan] = useState([]);
  const history = useHistory();
  const [isDataChanged, setIsDataChanged] = useState(false);

  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const guruData = await getGuruById(match.params.id);
        setFormData({
          nama: guruData.nama,
          mapelId: guruData.mapelId,
          telfon: guruData.telfon,
          alamat: guruData.alamat,
          walikelasId: guruData.walikelasId,
        });
      } catch (error) {
        console.error("Failed to fetch guru data: ", error);
      }
    };
    fetchGuru();
  }, [match.params.id]);

  useEffect(() => {
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
    fetchMapels();
  }, []);

  useEffect(() => {
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
    fetchKelasJurusan();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsDataChanged(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDataChanged) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Minimal satu data harus diubah",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const guruData = {
      nama: formData.nama,
      mapelId: formData.mapelId,
      telfon: formData.telfon,
      alamat: formData.alamat,
      walikelasId: formData.walikelasId,
    };
    try {
      await updateGuru(match.params.id, guruData);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data guru berhasil diupdate",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        history.goBack();
      });
    } catch (error) {
      console.error("Failed to update guru data: ", error);
      Swal.fire("Gagal", "Gagal mengupdate data guru", "error");
    }
  };

  return (
    <div style={{ marginTop: "8%" }} className="container text-center">
      <h2 className="text-center mb-5">Edit Guru</h2>
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
                <Form.Group className="mb-3" controlId="mapelId">
                  <Form.Label>Guru Mapel</Form.Label>
                  <Form.Control
                    as="select"
                    name="mapelId"
                    value={formData.mapelId}
                    onChange={handleChange}
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
                <Form.Group className="mb-3" controlId="walikelasId">
                  <Form.Label>Walikelas</Form.Label>
                  <Form.Control
                    as="select"
                    name="walikelasId"
                    value={formData.walikelasId}
                    onChange={handleChange}
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

export default EditGuru;
