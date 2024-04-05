import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { getGuruById, updateGuru } from "./api_guru";

const EditGuru = () => {
  const { id } = useParams();
  const history = useHistory();
  const [guru, setGuru] = useState({
    nama: "",
    mapel: "",
    telfon: "",
    alamat: "",
  });

  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const guruData = await getGuruById(id);
        setGuru(guruData);
      } catch (error) {
        console.error("Failed to fetch guru data: ", error);
      }
    };
    fetchGuru();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuru((prevGuru) => ({
      ...prevGuru,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const initialGuruData = await getGuruById(id);
    const isDataChanged =
      initialGuruData.nama !== guru.nama ||
      initialGuruData.mapel !== guru.mapel ||
      initialGuruData.telfon !== guru.telfon ||
      initialGuruData.alamat !== guru.alamat;

    if (!isDataChanged) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Minimal satu data harus diubah',
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    try {
      await updateGuru(id, guru);
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
    <div style={{marginTop: "8%"}} className="container text-center">
      <h2 className="text-center mb-5">Edit Guru</h2>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="nama">
                  <Form.Label>Nama Guru</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan nama guru"
                    name="nama"
                    value={guru.nama}
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
                    placeholder="Masukkan mata pelajaran"
                    name="mapel"
                    value={guru.mapel}
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
                  <Form.Label>Nomor Telepon</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan nomor telepon"
                    name="telfon"
                    value={guru.telfon}
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
                    placeholder="Masukkan alamat"
                    name="alamat"
                    value={guru.alamat}
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

export default EditGuru;
