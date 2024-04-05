import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { getMuridById, updateMurid } from "./api_murid";
import { useHistory, useParams } from "react-router-dom";

const formatDateToID = (dateString) => {
  const date = new Date(dateString);
  return [
    ("0" + date.getDate()).slice(-2),
    ("0" + (date.getMonth() + 1)).slice(-2),
    date.getFullYear(),
  ].join("-");
};

const EditMurid = () => {
  const { id } = useParams();
  const history = useHistory();
  const [murid, setMurid] = useState({
    nama: "",
    nik: "",
    nisn: "",
    lahir: "",
    umur: "",
    alamat: "",
  });

  useEffect(() => {
    const fetchMuridData = async () => {
      try {
        const muridData = await getMuridById(id);
        // Ubah format tanggal lahir ke tanggal/bulan/tahun
        const [year, month, day] = muridData.lahir.split("-");
        const formattedBirthDate = `${day}-${month}-${year}`;
        setMurid({ ...muridData, lahir: formattedBirthDate });
      } catch (error) {
        console.error("Failed to fetch murid data: ", error);
      }
    };
    fetchMuridData();
  }, [id]);

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
          umur: (diffYears - 1).toString() + " Tahun",
        }));
      } else {
        setMurid((prevMurid) => ({
          ...prevMurid,
          [name]: value,
          umur: diffYears.toString() + " Tahun",
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
    const initialMuridData = await getMuridById(id);
    const initialFormattedBirthDate = formatDateToID(initialMuridData.lahir);
    const userFormattedBirthDate = formatDateToID(murid.lahir);

    const isDataChanged =
      initialMuridData.nama !== murid.nama ||
      initialMuridData.nik !== murid.nik ||
      initialMuridData.nisn !== murid.nisn ||
      initialFormattedBirthDate !== userFormattedBirthDate ||
      initialMuridData.umur !== murid.umur ||
      initialMuridData.alamat !== murid.alamat;

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

    let updatedUmur = murid.umur;
    if (!updatedUmur.includes("Tahun")) {
      updatedUmur += " Tahun";
    }

    try {
      await updateMurid(id, {
        ...murid,
        lahir: userFormattedBirthDate,
        umur: updatedUmur,
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data murid berhasil diupdate",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        history.goBack();
      });
    } catch (error) {
      console.error("Failed to update murid data: ", error);
      Swal.fire("Gagal", "Gagal mengupdate data murid", "error");
    }
  };

  return (
    <div style={{ marginTop: "5%" }} className="container text-center">
      <h2 className="text-center mb-5">Edit Murid</h2>
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
                    type="text" // Ubah tipe input umur menjadi number
                    placeholder="Masukkan umur murid"
                    name="umur"
                    value={murid.umur}
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
                    type="text"
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

export default EditMurid;
