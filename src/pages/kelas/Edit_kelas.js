import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { getKelasById, updateKelas } from "./api_kelas";
import Swal from "sweetalert2";

const EditKelas = () => {
  const { id } = useParams();
  const history = useHistory();
  const [kelas, setKelas] = useState({
    kelas: "",
    jurusan: "",
    jumlah: "",
    tahunAjaran: "",
  });

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const data = await getKelasById(id);
        setKelas(data);
      } catch (error) {
        console.error("Failed to fetch Kelas: ", error);
        // Handle error
      }
    };
    fetchKelas();
  }, [id]);

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i.toString());
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKelas((prevKelas) => ({
      ...prevKelas,
      [name]: value,
    }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const initialKelasData = await getKelasById(id);
    const isDataChanged =
      initialKelasData.kelas !== kelas.kelas ||
      initialKelasData.jurusan !== kelas.jurusan ||
      initialKelasData.tahunAjaran !== kelas.tahunAjaran ||
      initialKelasData.jumlah !== kelas.jumlah;

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
      await updateKelas(id, kelas);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kelas berhasil diupdate",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        history.goBack();
      });
    } catch (error) {
      console.error("Failed to update Kelas: ", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengupdate kelas",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };
  
  return (
    <div style={{ marginTop: "8%" }} className="container text-center">
      <h2 className="text-center mb-5">Edit Kelas</h2>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <Form onSubmit={handleEdit}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="kelas">
                  <Form.Label>Kelas</Form.Label>
                  <Form.Select
                    name="kelas"
                    value={kelas.kelas}
                    onChange={handleChange}
                    autoComplete="off"
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
                  >
                    {/* Render opsi tahun ajaran */}
                    {years.map((year) => (
                      <option
                        key={year}
                        value={`${year}-${parseInt(year) + 1}`}
                      >
                        {year} - {parseInt(year) + 1}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditKelas;
