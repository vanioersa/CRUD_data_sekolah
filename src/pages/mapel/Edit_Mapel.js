import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { getMapelById, updateMapel } from "./api_mapel";
import Swal from "sweetalert2";

const EditMapel = () => {
  const { id } = useParams();
  const history = useHistory();
  const [mapel, setMapel] = useState({
    guru: "",
    nama: "",
    deskripsi: "",
    tingkat: "",
    semester: "",
    jamPelajaran: "",
    kurikulum: "",
  });

  // State untuk modals dan custom input
  const [showTingkatModal, setShowTingkatModal] = useState(false);
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [showJamPelajaranModal, setShowJamPelajaranModal] = useState(false);
  const [showKurikulumModal, setShowKurikulumModal] = useState(false);
  const [customTingkat, setCustomTingkat] = useState("");
  const [customSemester, setCustomSemester] = useState("");
  const [customJamPelajaran, setCustomJamPelajaran] = useState("");
  const [customKurikulum, setCustomKurikulum] = useState("");
  const [tingkatOptions, setTingkatOptions] = useState([
    { value: "SD", label: "SD" },
    { value: "SMP", label: "SMP" },
    { value: "SMA", label: "SMA" },
    { value: "SMK", label: "SMK" },
  ]);
  const [semesterOptions, setSemesterOptions] = useState([
    { value: "Ganjil", label: "Ganjil" },
    { value: "Genap", label: "Genap" },
  ]);
  const [jamPelajaranOptions, setJamPelajaranOptions] = useState([
    { value: "Pagi", label: "Pagi" },
    { value: "Siang", label: "Siang" },
    { value: "Sore", label: "Sore" },
    { value: "Malam", label: "Malam" },
  ]);
  const [kurikulumOptions, setKurikulumOptions] = useState([
    { value: "Kurikulum KTSP 2006", label: "Kurikulum KTSP 2006" },
    { value: "Kurikulum K-13", label: "Kurikulum K-13" },
    { value: "Kurikulum Merdeka", label: "Kurikulum Merdeka" },
  ]);

  useEffect(() => {
    const fetchMapel = async () => {
      try {
        const data = await getMapelById(id);
        setMapel(data);
      } catch (error) {
        console.error("Gagal mengambil data Mapel: ", error);
      }
    };
    fetchMapel();
  }, [id]);

  useEffect(() => {
    if (
      mapel.tingkat &&
      !tingkatOptions.find((option) => option.value === mapel.tingkat)
    ) {
      setTingkatOptions((prevOptions) => [
        ...prevOptions,
        { value: mapel.tingkat, label: mapel.tingkat },
      ]);
    }
  
    if (
      mapel.semester &&
      !semesterOptions.find((option) => option.value === mapel.semester)
    ) {
      setSemesterOptions((prevOptions) => [
        ...prevOptions,
        { value: mapel.semester, label: mapel.semester },
      ]);
    }
  
    if (
      mapel.jamPelajaran &&
      !jamPelajaranOptions.find((option) => option.value === mapel.jamPelajaran)
    ) {
      setJamPelajaranOptions((prevOptions) => [
        ...prevOptions,
        { value: mapel.jamPelajaran, label: mapel.jamPelajaran },
      ]);
    }
  
    if (
      mapel.kurikulum &&
      !kurikulumOptions.find((option) => option.value === mapel.kurikulum)
    ) {
      setKurikulumOptions((prevOptions) => [
        ...prevOptions,
        { value: mapel.kurikulum, label: mapel.kurikulum },
      ]);
    }
  }, [mapel, tingkatOptions, semesterOptions, jamPelajaranOptions, kurikulumOptions]);
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "tingkat" && value === "Lainnya") {
      setShowTingkatModal(true);
    } else if (name === "semester" && value === "Lainnya") {
      setShowSemesterModal(true);
    } else if (name === "jamPelajaran" && value === "Lainnya") {
      setShowJamPelajaranModal(true);
    } else if (name === "kurikulum" && value === "Lainnya") {
      setShowKurikulumModal(true);
    } else {
      setMapel({
        ...mapel,
        [name]: value,
      });
    }
  };

  const handleTingkatSubmit = () => {
    setTingkatOptions([
      ...tingkatOptions,
      { value: customTingkat, label: customTingkat },
    ]);
    setMapel((prevMapel) => ({
      ...prevMapel,
      tingkat: customTingkat,
    }));
    setShowTingkatModal(false);
  };

  const handleSemesterSubmit = () => {
    setSemesterOptions([
      ...semesterOptions,
      { value: customSemester, label: customSemester },
    ]);
    setMapel((prevMapel) => ({
      ...prevMapel,
      semester: customSemester,
    }));
    setShowSemesterModal(false);
  };

  const handleJamPelajaranSubmit = () => {
    setJamPelajaranOptions([
      ...jamPelajaranOptions,
      { value: customJamPelajaran, label: customJamPelajaran },
    ]);
    setMapel((prevMapel) => ({
      ...prevMapel,
      jamPelajaran: customJamPelajaran,
    }));
    setShowJamPelajaranModal(false);
  };

  const handleKurikulumSubmit = () => {
    setKurikulumOptions([
      ...kurikulumOptions,
      { value: customKurikulum, label: customKurikulum },
    ]);
    setMapel((prevMapel) => ({
      ...prevMapel,
      kurikulum: customKurikulum,
    }));
    setShowKurikulumModal(false);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const initialMapelData = await getMapelById(id);

    const isDataChanged =
      initialMapelData.nama !== mapel.nama ||
      initialMapelData.deskripsi !== mapel.deskripsi ||
      initialMapelData.tingkat !== mapel.tingkat ||
      initialMapelData.semester !== mapel.semester ||
      initialMapelData.jamPelajaran !== mapel.jamPelajaran ||
      initialMapelData.kurikulum !== mapel.kurikulum;

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

    const deskripsiValue =
    mapel.deskripsi.trim() === "" ? "-" : mapel.deskripsi;
    try {
      await updateMapel(id,{ ...mapel, deskripsi: deskripsiValue});
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data mapel berhasil diupdate",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        history.goBack();
      });
    } catch (error) {
      console.error("Failed to update mapel data: ", error);
      Swal.fire("Gagal", "Gagal mengupdate data mapel", "error");
    }
  };

  return (
    <div style={{ marginTop: "6%" }} className="container text-center">
      <h2 className="text-center mb-5">Edit Mapel</h2>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <Form onSubmit={handleEdit}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="nama">
                  <Form.Label>Nama Mapel</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan nama mapel"
                    name="nama"
                    value={mapel.nama}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="deskripsi">
                  <Form.Label>Deskripsi</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Masukkan deskripsi mapel(optional)"
                    name="deskripsi"
                    value={mapel.deskripsi}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="tingkat">
                  <Form.Label>Tingkat</Form.Label>
                  <Form.Select
                    name="tingkat"
                    value={mapel.tingkat}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  >
                    <option value="">Pilih Tingkat</option>
                    {tingkatOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                    <option onClick={() => setShowTingkatModal(true)}>
                      Lainnya
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="kurikulum">
                  <Form.Label>Kurikulum</Form.Label>
                  <Form.Select
                    name="kurikulum"
                    value={mapel.kurikulum}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  >
                    <option value="">Pilih Kurikulum</option>
                    {kurikulumOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                    <option onClick={() => setShowKurikulumModal(true)}>
                      Lainnya
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="semester">
                  <Form.Label>Semester</Form.Label>
                  <Form.Select
                    name="semester"
                    value={mapel.semester}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  >
                    <option value="">Pilih Semester</option>
                    {semesterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                    <option onClick={() => setShowSemesterModal(true)}>
                      Lainnya
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="jamPelajaran">
                  <Form.Label>Jam</Form.Label>
                  <Form.Select
                    name="jamPelajaran"
                    value={mapel.jamPelajaran}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  >
                    <option value="">Pilih Jam</option>
                    {jamPelajaranOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                    <option onClick={() => setShowJamPelajaranModal(true)}>
                      Lainnya
                    </option>
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
        show={showTingkatModal}
        onHide={() => setShowTingkatModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tambah Tingkat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Masukkan tingkat baru"
            value={customTingkat}
            onChange={(e) => setCustomTingkat(e.target.value)}
            autoComplete="off"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowTingkatModal(false)}
            style={{ marginRight: "auto" }}
          >
            Batal
          </Button>
          <Button variant="primary" onClick={handleTingkatSubmit}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSemesterModal}
        onHide={() => setShowSemesterModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tambah Semester</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Masukkan semester baru"
            value={customSemester}
            onChange={(e) => setCustomSemester(e.target.value)}
            autoComplete="off"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSemesterModal(false)}
            style={{ marginRight: "auto" }}
          >
            Batal
          </Button>
          <Button variant="primary" onClick={handleSemesterSubmit}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showJamPelajaranModal}
        onHide={() => setShowJamPelajaranModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tambah Jam Pelajaran</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Masukkan jam pelajaran baru"
            value={customJamPelajaran}
            onChange={(e) => setCustomJamPelajaran(e.target.value)}
            autoComplete="off"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowJamPelajaranModal(false)}
            style={{ marginRight: "auto" }}
          >
            Batal
          </Button>
          <Button variant="primary" onClick={handleJamPelajaranSubmit}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showKurikulumModal}
        onHide={() => setShowKurikulumModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tambah Kurikulum</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Masukkan kurikulum baru"
            value={customKurikulum}
            onChange={(e) => setCustomKurikulum(e.target.value)}
            autoComplete="off"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowKurikulumModal(false)}
            style={{ marginRight: "auto" }}
          >
            Batal
          </Button>
          <Button variant="primary" onClick={handleKurikulumSubmit}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditMapel;
