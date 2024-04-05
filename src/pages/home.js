import React, { useState, useEffect } from "react";
import { Card, Col, Row, Table, Form } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faChalkboardTeacher,
  faBookOpen,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  const [data, setData] = useState({
    murids: [],
    kelas: [],
    guru: [],
    mapel: [],
  });

  const [searchTermMurid, setSearchTermMurid] = useState("");
  const [searchTermGuru, setSearchTermGuru] = useState("");
  const [searchTermKelas, setSearchTermKelas] = useState("");
  const [searchTermMapel, setSearchTermMapel] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const muridsResponse = await axios.get(
          "http://localhost:8080/tugas_akhir/api/murid/all"
        );
        const kelasResponse = await axios.get(
          "http://localhost:8080/tugas_akhir/api/kelas/all"
        );
        const guruResponse = await axios.get(
          "http://localhost:8080/tugas_akhir/api/guru/all"
        );
        const mapelResponse = await axios.get(
          "http://localhost:8080/tugas_akhir/api/mapel/all"
        );

        setData({
          murids: muridsResponse.data,
          kelas: kelasResponse.data,
          guru: guruResponse.data,
          mapel: mapelResponse.data,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const filterMurids = data.murids
    .sort((a, b) => new Date(b.id) - new Date(a.id))
    .filter((murid) =>
      Object.values(murid).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTermMurid.toLowerCase())
      )
    );

  const filterGuru = data.guru
    .sort((a, b) => new Date(b.id) - new Date(a.id))
    .filter((guru) =>
      Object.values(guru).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTermGuru.toLowerCase())
      )
    );

  const filterKelas = data.kelas
    .sort((a, b) => new Date(b.id) - new Date(a.id))
    .filter((kelas) =>
      Object.values(kelas).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTermKelas.toLowerCase())
      )
    );

  const filterMapel = data.mapel
    .sort((a, b) => new Date(b.id) - new Date(a.id))
    .filter((mapel) =>
      Object.values(mapel).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTermMapel.toLowerCase())
      )
    );

  return (
    <div className="container mt-3">
      <h2 className="mb-4">Dashboard</h2>
      <Row xs={1} md={2} lg={4} className="g-3">
        <Col>
          <a href="/murid" className="text-decoration-none">
            <Card className="p-3 bg-primary text-white shadow-sm">
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon={faUsers} className="me-2" />
                  Murid
                </Card.Title>
                <Card.Text>Jumlah: {data.murids.length}</Card.Text>
              </Card.Body>
            </Card>
          </a>
        </Col>

        <Col>
          <a href="/guru" className="text-decoration-none">
            <Card className="p-3 bg-success text-white shadow-sm">
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Guru
                </Card.Title>
                <Card.Text>Jumlah: {data.guru.length}</Card.Text>
              </Card.Body>
            </Card>
          </a>
        </Col>

        <Col>
          <a href="/kelas" className="text-decoration-none">
            <Card className="p-3 bg-info text-white shadow-sm">
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon
                    icon={faChalkboardTeacher}
                    className="me-2"
                  />
                  Kelas
                </Card.Title>
                <Card.Text>Jumlah: {data.kelas.length}</Card.Text>
              </Card.Body>
            </Card>
          </a>
        </Col>

        <Col>
          <a href="/mapel" className="text-decoration-none">
            <Card className="p-3 bg-danger text-white shadow-sm">
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                  Mapel
                </Card.Title>
                <Card.Text>Jumlah: {data.mapel.length}</Card.Text>
              </Card.Body>
            </Card>
          </a>
        </Col>
      </Row>

      <hr
        style={{
          marginTop: "50px",
          marginBottom: "10px",
          borderTop: "5px solid black",
        }}
      />

      <Row className="mb-4">
        <Col xs={12} md={6}>
          {/* Tabel untuk Murid */}
          <h3 className="mt-4">Daftar Murid</h3>
          <Card
            style={{
              height: "330px",
              marginBottom: "20px",
              paddingBottom: "5px",
            }}
          >
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Cari Murid..."
                  value={searchTermMurid}
                  onChange={(e) => setSearchTermMurid(e.target.value)}
                />
              </Form.Group>
              <Table striped bordered hover responsive className="table-custom">
                <thead>
                  <tr>
                    <th>NO.</th>
                    <th>Nama</th>
                    <th>Tanggal Lahir</th>
                    <th>Alamat</th>
                  </tr>
                </thead>
                <tbody>
                  {filterMurids.length > 0 ? (
                    filterMurids.slice(0, 5).map((murid, index) => (
                      <tr key={index}>
                        <td>{index + 1 + "."}</td>
                        <td>{murid.nama}</td>
                        <td>{murid.lahir}</td>
                        <td>{murid.alamat}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="text-center" colSpan="4">
                        Data Murid tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          {/* Tabel untuk Guru */}
          <h3 className="mt-4">Daftar Guru</h3>
          <Card
            style={{
              height: "330px",
              marginBottom: "20px",
              paddingBottom: "5px",
            }}
          >
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Cari Guru..."
                  value={searchTermGuru}
                  onChange={(e) => setSearchTermGuru(e.target.value)}
                />
              </Form.Group>
              <Table striped bordered hover responsive className="table-custom">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Nama</th>
                    <th>Mapel</th>
                    <th>Alamat</th>
                  </tr>
                </thead>
                <tbody>
                  {filterGuru.length > 0 ? (
                    filterGuru.slice(0, 5).map((guru, index) => (
                      <tr key={index}>
                        <td>{index + 1 + "."}</td>
                        <td>{guru.nama}</td>
                        <td>{guru.mapel}</td>
                        <td>{guru.alamat}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="text-center" colSpan="4">
                        Data Guru tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6}>
          {/* Tabel untuk Kelas */}
          <h3 className="mt-4">Daftar Kelas</h3>
          <Card
            style={{
              height: "330px",
              marginBottom: "20px",
              paddingBottom: "5px",
            }}
          >
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Cari Kelas..."
                  value={searchTermKelas}
                  onChange={(e) => setSearchTermKelas(e.target.value)}
                />
              </Form.Group>
              <Table striped bordered hover responsive className="table-custom">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Kelas</th>
                    <th>Jurusan</th>
                    <th>Tahun Ajaran</th>
                  </tr>
                </thead>
                <tbody>
                  {filterKelas.length > 0 ? (
                    filterKelas.slice(0, 5).map((kelas, index) => (
                      <tr key={index}>
                        <td>{index + 1 + "."}</td>
                        <td>{kelas.kelas}</td>
                        <td>{kelas.jurusan}</td>
                        <td>{kelas.tahunAjaran}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="text-center" colSpan="4">
                        Data Kelas tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          {/* Tabel untuk Mapel */}
          <h3 className="mt-4">Daftar Mapel</h3>
          <Card
            style={{
              height: "330px",
              marginBottom: "20px",
              paddingBottom: "5px",
            }}
          >
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Cari Mapel..."
                  value={searchTermMapel}
                  onChange={(e) => setSearchTermMapel(e.target.value)}
                />
              </Form.Group>
              <Table striped bordered hover responsive className="table-custom">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Nama</th>
                    <th>Kurikulum</th>
                    <th>Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {filterMapel.length > 0 ? (
                    filterMapel.slice(0, 5).map((mapel, index) => (
                      <tr key={index}>
                        <td>{index + 1 + "."}</td>
                        <td>{mapel.nama}</td>
                        <td>{mapel.kurikulum}</td>
                        <td>{mapel.semester}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="text-center" colSpan="4">
                        Data Mapel tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="botttom" />
      <style>
        {`
          .table-custom {
            border-collapse: collapse;
            width: 100%;
          }

          .table-custom th {
            border: none;
            padding: 8px;
            text-align: center;
            background-color: #078bf0;
            color: white;
          }
      
          .table-custom td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }

          .table-custom tr:nth-child(even) {
            background-color: #f2f2f2;
          }

          .table-custom tr:hover {
            background-color: #ddd;
          }

          .card {
            margin-bottom: 0;
          }

          .botttom {
            margin-top: 30px;
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard;
