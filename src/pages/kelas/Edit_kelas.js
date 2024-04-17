import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
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

  const [showKelasModal, setShowKelasModal] = useState(false);
  const [showJurusanModal, setShowJurusanModal] = useState(false);
  const [showTahunAjaranModal, setShowTahunAjaranModal] = useState(false);
  const [customKelas, setCustomKelas] = useState("");
  const [customJurusan, setCustomJurusan] = useState("");
  const [customTahunAjaran, setCustomTahunAjaran] = useState("");
  const [kelasOptions, setKelasOptions] = useState([
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
  ]);
  const [jurusanOptions, setJurusanOptions] = useState([
    { value: "TKJ", label: "TKJ" },
    { value: "TB", label: "TB" },
    { value: "TBSM", label: "TBSM" },
    { value: "AKL", label: "AKL" },
  ]);
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const currentTahunAjaran = `${currentYear} - ${nextYear}`;
  const [tahunAjaranOptions, setTahunAjaranOptions] = useState([]);

  useEffect(() => {
    setTahunAjaranOptions((prevOptions) => {
      if (!prevOptions.find((option) => option.value === currentTahunAjaran)) {
        return [
          ...prevOptions,
          { value: currentTahunAjaran, label: currentTahunAjaran },
        ];
      }
      return prevOptions;
    });
  }, [currentTahunAjaran]);
  
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const data = await getKelasById(id);
        setKelas(data);
      } catch (error) {
        console.error("Gagal mengambil data Kelas: ", error);
      }
    };
    fetchKelas();
  }, [id]);

  useEffect(() => {
    if (
      kelas.kelas &&
      !kelasOptions.find((option) => option.value === kelas.kelas)
    ) {
      setKelasOptions((prevOptions) => [
        ...prevOptions,
        { value: kelas.kelas, label: kelas.kelas },
      ]);
    }

    if (
      kelas.jurusan &&
      !jurusanOptions.find((option) => option.value === kelas.jurusan)
    ) {
      setJurusanOptions((prevOptions) => [
        ...prevOptions,
        { value: kelas.jurusan, label: kelas.jurusan },
      ]);
    }

    if (
      kelas.tahunAjaran &&
      !tahunAjaranOptions.find((option) => option.value === kelas.tahunAjaran)
    ) {
      setTahunAjaranOptions((prevOptions) => [
        ...prevOptions,
        { value: kelas.tahunAjaran, label: kelas.tahunAjaran },
      ]);
    }
  }, [kelas, kelasOptions, jurusanOptions, tahunAjaranOptions]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "kelas" && value === "Lainnya") {
      setShowKelasModal(true);
    } else if (name === "jurusan" && value === "Lainnya") {
      setShowJurusanModal(true);
    } else if (name === "tahunAjaran" && value === "Lainnya") {
      setShowTahunAjaranModal(true);
    } else {
      setKelas({
        ...kelas,
        [name]: value,
      });
    }
  };

  const handleKelasSubmit = () => {
    setKelasOptions([
      ...kelasOptions,
      { value: customKelas, label: customKelas },
    ]);
    setKelas((prevKelas) => ({
      ...prevKelas,
      kelas: customKelas,
    }));
    setShowKelasModal(false);
  };

  const handleJurusanSubmit = () => {
    setJurusanOptions([
      ...jurusanOptions,
      { value: customJurusan, label: customJurusan },
    ]);
    setKelas((prevKelas) => ({
      ...prevKelas,
      jurusan: customJurusan,
    }));
    setShowJurusanModal(false);
  };

  const handleTahunAjaranSubmit = () => {
    setTahunAjaranOptions([
      ...tahunAjaranOptions,
      { value: customTahunAjaran, label: customTahunAjaran },
    ]);
    setKelas((prevKelas) => ({
      ...prevKelas,
      tahunAjaran: customTahunAjaran,
    }));
    setShowTahunAjaranModal(false);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const initialKelasData = await getKelasById(id);

    const isDataChanged =
      initialKelasData.kelas !== kelas.kelas ||
      initialKelasData.jurusan !== kelas.jurusan ||
      initialKelasData.jumlah !== kelas.jumlah ||
      initialKelasData.tahunAjaran !== kelas.tahunAjaran

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
      console.error("Gagal mengupdate kelas: ", error);
      Swal.fire("Gagal", "Gagal mengupdate kelas", "error");
    }
  };

  return (
    <div style={{ marginTop: "6%" }} className="container text-center">
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  >
                    <option value="">Pilih Tahun Ajaran</option>
                    {tahunAjaranOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
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

export default EditKelas;
