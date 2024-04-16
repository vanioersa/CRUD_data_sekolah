import React, { useState, useEffect } from "react";
import { Card, Col, Row, Table, Form, Pagination } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faChalkboardTeacher,
  faBookOpen,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  const [mapels, setMapels] = useState([]);
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

  const [currentPageMurid, setCurrentPageMurid] = useState(1);
  const [currentPageGuru, setCurrentPageGuru] = useState(1);
  const [currentPageKelas, setCurrentPageKelas] = useState(1);
  const [currentPageMapel, setCurrentPageMapel] = useState(1);

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

  const filterMurids = data.murids
    .sort((a, b) => new Date(b.id) - new Date(a.id))
    .filter((murid) => {
      const lowerCaseSearchTerm = searchTermMurid.toLowerCase();
      return (
        murid.nama.toLowerCase().includes(lowerCaseSearchTerm) ||
        murid.lahir.toString().includes(lowerCaseSearchTerm) ||
        murid.alamat.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });

  const filterGuru = data.guru
    .sort((a, b) => new Date(b.id) - new Date(a.id))
    .filter((guru) => {
      const lowerCaseSearchTerm = searchTermGuru.toLowerCase();
      const mapelName = mapels
        .find((mapel) => mapel.id === guru.mapelId)
        ?.nama.toLowerCase();
      return (
        guru.nama.toLowerCase().includes(lowerCaseSearchTerm) ||
        (mapelName && mapelName.includes(lowerCaseSearchTerm)) ||
        guru.alamat.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });

  const filterKelas = data.kelas
    .sort((a, b) => new Date(b.id) - new Date(a.id))
    .filter((kelas) => {
      const lowerCaseSearchTerm = searchTermKelas.toLowerCase();
      return (
        (typeof kelas.kelas === "string" &&
          kelas.kelas.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (typeof kelas.jurusan === "string" &&
          kelas.jurusan.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (typeof kelas.tahunAjaran === "string" &&
          kelas.tahunAjaran.includes(lowerCaseSearchTerm))
      );
    });

  const filterMapel = data.mapel
    .sort((a, b) => new Date(b.id) - new Date(a.id))
    .filter((mapel) => {
      const lowerCaseSearchTerm = searchTermMapel.toLowerCase();
      return Object.values(mapel).some(
        (value) =>
          (typeof value === "string" &&
            value.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (typeof value === "number" &&
            value.toString().includes(lowerCaseSearchTerm))
      );
    });

  const perPage = 5;

  const startIndexMurid = (currentPageMurid - 1) * perPage;
  const endIndexMurid = startIndexMurid + perPage;
  const paginatedMurids = filterMurids.slice(startIndexMurid, endIndexMurid);

  const startIndexGuru = (currentPageGuru - 1) * perPage;
  const endIndexGuru = startIndexGuru + perPage;
  const paginatedGuru = filterGuru.slice(startIndexGuru, endIndexGuru);

  const startIndexKelas = (currentPageKelas - 1) * perPage;
  const endIndexKelas = startIndexKelas + perPage;
  const paginatedKelas = filterKelas.slice(startIndexKelas, endIndexKelas);

  const startIndexMapel = (currentPageMapel - 1) * perPage;
  const endIndexMapel = startIndexMapel + perPage;
  const paginatedMapel = filterMapel.slice(startIndexMapel, endIndexMapel);

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
      <br />
      <br />

      <Row className="mb-4">
        <Col xs={12} md={6}>
          <h3 className="mt-4">Daftar Murid</h3>
          <Card
            style={{
              maxHeight: "575px",
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
                    <th>Nama Murid</th>
                    <th>Tanggal Lahir</th>
                    <th>Alamat</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMurids.length > 0 ? (
                    paginatedMurids.map((murid, index) => (
                      <tr key={index}>
                        <td>{startIndexMurid + index + 1 + "."}</td>
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
              <Card.Text className="mt-auto mx-1 mb-3">
                Menampilkan {paginatedMurids.length} data dari total{" "}
                {filterMurids.length} data
              </Card.Text>
            </Card.Body>
            <div className="pagination justify-content-center">
              <Pagination>
                <Pagination.First
                  onClick={() => setCurrentPageMurid(1)}
                  disabled={currentPageMurid === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPageMurid(currentPageMurid - 1)}
                  disabled={currentPageMurid === 1}
                />
                {[
                  ...Array(Math.ceil(filterMurids.length / perPage)).keys(),
                ].map((number) => (
                  <Pagination.Item
                    key={number + 1}
                    active={number + 1 === currentPageMurid}
                    onClick={() => setCurrentPageMurid(number + 1)}
                  >
                    {number + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => setCurrentPageMurid(currentPageMurid + 1)}
                  disabled={endIndexMurid >= filterMurids.length}
                />
                <Pagination.Last
                  onClick={() =>
                    setCurrentPageMurid(
                      Math.ceil(filterMurids.length / perPage)
                    )
                  }
                  disabled={
                    currentPageMurid ===
                    Math.ceil(filterMurids.length / perPage)
                  }
                />
              </Pagination>
            </div>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <h3 className="mt-4">Daftar Guru</h3>
          <Card
            style={{
              maxHeight: "575px",
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
                    <th>Nama Guru</th>
                    <th>Mapel</th>
                    <th>Alamat</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedGuru.length > 0 ? (
                    paginatedGuru.map((guru, index) => (
                      <tr key={index}>
                        <td>{startIndexGuru + index + 1 + "."}</td>
                        <td>{guru.nama}</td>
                        <td>
                          {
                            mapels.find((mapel) => mapel.id === guru.mapelId)
                              ?.nama
                          }
                        </td>
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
              <Card.Text className="mt-auto mx-1 mb-3">
                Menampilkan {paginatedGuru.length} data dari total{" "}
                {filterGuru.length} data
              </Card.Text>
            </Card.Body>
            <div className="pagination justify-content-center">
              <Pagination>
                <Pagination.First
                  onClick={() => setCurrentPageGuru(1)}
                  disabled={currentPageGuru === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPageGuru(currentPageGuru - 1)}
                  disabled={currentPageGuru === 1}
                />
                {[...Array(Math.ceil(filterGuru.length / perPage)).keys()].map(
                  (number) => (
                    <Pagination.Item
                      key={number + 1}
                      active={number + 1 === currentPageGuru}
                      onClick={() => setCurrentPageGuru(number + 1)}
                    >
                      {number + 1}
                    </Pagination.Item>
                  )
                )}
                <Pagination.Next
                  onClick={() => setCurrentPageGuru(currentPageGuru + 1)}
                  disabled={endIndexGuru >= filterGuru.length}
                />
                <Pagination.Last
                  onClick={() =>
                    setCurrentPageGuru(Math.ceil(filterGuru.length / perPage))
                  }
                  disabled={
                    currentPageGuru === Math.ceil(filterGuru.length / perPage)
                  }
                />
              </Pagination>
            </div>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6}>
          <h3 className="mt-4">Daftar Kelas</h3>
          <Card
            style={{
              maxHeight: "575px",
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
                  {paginatedKelas.length > 0 ? (
                    paginatedKelas.map((kelas, index) => (
                      <tr key={index}>
                        <td>{startIndexKelas + index + 1 + "."}</td>
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
              <Card.Text className="mt-auto mx-1 mb-3">
                Menampilkan {paginatedKelas.length} data dari total{" "}
                {filterKelas.length} data
              </Card.Text>
            </Card.Body>
            <div className="pagination justify-content-center">
              <Pagination>
                <Pagination.First
                  onClick={() => setCurrentPageKelas(1)}
                  disabled={currentPageKelas === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPageKelas(currentPageKelas - 1)}
                  disabled={currentPageKelas === 1}
                />
                {[...Array(Math.ceil(filterKelas.length / perPage)).keys()].map(
                  (number) => (
                    <Pagination.Item
                      key={number + 1}
                      active={number + 1 === currentPageKelas}
                      onClick={() => setCurrentPageKelas(number + 1)}
                    >
                      {number + 1}
                    </Pagination.Item>
                  )
                )}
                <Pagination.Next
                  onClick={() => setCurrentPageKelas(currentPageKelas + 1)}
                  disabled={endIndexKelas >= filterKelas.length}
                />
                <Pagination.Last
                  onClick={() =>
                    setCurrentPageKelas(Math.ceil(filterKelas.length / perPage))
                  }
                  disabled={
                    currentPageKelas === Math.ceil(filterKelas.length / perPage)
                  }
                />
              </Pagination>
            </div>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <h3 className="mt-4">Daftar Mapel</h3>
          <Card
            style={{
              maxHeight: "575px",
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
                    <th>Nama Mapel</th>
                    <th>Kurikulum</th>
                    <th>Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMapel.length > 0 ? (
                    paginatedMapel.map((mapel, index) => (
                      <tr key={index}>
                        <td>{startIndexMapel + index + 1 + "."}</td>
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
              <Card.Text className="mt-auto mx-1 mb-3">
                Menampilkan {paginatedMapel.length} data dari total{" "}
                {filterMapel.length} data
              </Card.Text>
            </Card.Body>
            <div className="pagination justify-content-center">
              <Pagination>
                <Pagination.First
                  onClick={() => setCurrentPageMapel(1)}
                  disabled={currentPageMapel === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPageMapel(currentPageMapel - 1)}
                  disabled={currentPageMapel === 1}
                />
                {[...Array(Math.ceil(filterMapel.length / perPage)).keys()].map(
                  (number) => (
                    <Pagination.Item
                      key={number + 1}
                      active={number + 1 === currentPageMapel}
                      onClick={() => setCurrentPageMapel(number + 1)}
                    >
                      {number + 1}
                    </Pagination.Item>
                  )
                )}
                <Pagination.Next
                  onClick={() => setCurrentPageMapel(currentPageMapel + 1)}
                  disabled={endIndexMapel >= filterMapel.length}
                />
                <Pagination.Last
                  onClick={() =>
                    setCurrentPageMapel(Math.ceil(filterMapel.length / perPage))
                  }
                  disabled={
                    currentPageMapel === Math.ceil(filterMapel.length / perPage)
                  }
                />
              </Pagination>
            </div>
          </Card>
        </Col>
      </Row>
      <div className="botttom" />
      <style>
        {`
    @media (min-width: 768px) {
      .table-custom {
        border-collapse: collapse;
        width: 100%;
      }

      .table-custom th {
        padding: 8px;
        text-align: center;
        background-color: #fff;
        color: #078bf0;
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
    }

    @media (max-width: 767px) {
      .botttom {
        margin-top: 30px;
      }

      hr {
        display: none;
      }
    }
  `}
      </style>
    </div>
  );
}

export default Dashboard;
