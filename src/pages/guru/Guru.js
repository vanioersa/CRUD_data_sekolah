import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Pagination,
  Form,
  FormControl,
  FormSelect,
} from "react-bootstrap";
import { getAllGurus, deleteGuru } from "./api_guru";
import Swal from "sweetalert2";
import axios from "axios";

const Guru = () => {
  const [gurus, setGurus] = useState([]);
  const [mapels, setMapels] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [jurusan, setJurusan] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [gurusPerPage, setGurusPerPage] = useState(10);

  useEffect(() => {
    const fetchGurus = async () => {
      try {
        const data = await getAllGurus();
        setGurus(data);
      } catch (error) {
        console.error("Failed to fetch Gurus: ", error);
      }
    };
    fetchGurus();
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

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/tugas_akhir/api/kelas/all"
        );
        setKelas(response.data);
      } catch (error) {
        console.error("Failed to fetch Kelas and Jurusan: ", error);
      }
    };
    fetchKelas();
  }, []);

  useEffect(() => {
    const fetchjurusan = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/tugas_akhir/api/kelas/all"
        );
        setJurusan(response.data);
      } catch (error) {
        console.error("Failed to fetch Kelas and Jurusan: ", error);
      }
    };
    fetchjurusan();
  }, []);

  const handleDeleteGuru = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data guru akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteGuru(id);
          // Jika penghapusan berhasil, perbarui daftar guru
          const updatedGurus = gurus.filter((guru) => guru.id !== id);
          setGurus(updatedGurus);
          Swal.fire({
            title: "Berhasil",
            text: "Guru berhasil dihapus",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Failed to delete Guru: ", error);
          let errorMessage = "Gagal menghapus guru. Silakan coba lagi.";
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            // Jika server mengirimkan pesan kesalahan yang spesifik
            errorMessage = error.response.data.message;
          }
          Swal.fire("Gagal", errorMessage, "error");
        }
      }
    });
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSelectChange = (event) => {
    setGurusPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const indexOfLastGuru = currentPage * gurusPerPage;
  const indexOfFirstGuru = indexOfLastGuru - gurusPerPage;
  const filteredGurus = gurus.filter((guru) => {
    const telfonString = guru.telfon && guru.telfon.toString();
    const kelasNama =
      guru.walikelasId && kelas.find((k) => k.id === guru.walikelasId)?.nama;
    const jurusanNama =
      guru.walikelasId &&
      jurusan.find((j) => j.id === guru.walikelasId)?.jurusan;
    return (
      (guru.nama &&
        guru.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (guru.mapelId &&
        mapels
          .find((mapel) => mapel.id === guru.mapelId)
          ?.nama.toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (guru.alamat &&
        guru.alamat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (telfonString &&
        telfonString.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (kelasNama &&
        kelasNama.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (jurusanNama &&
        jurusanNama.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const currentGurus = filteredGurus.slice(indexOfFirstGuru, indexOfLastGuru);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-3">
      <h2>Guru</h2>
      <a
        href="/add_guru"
        variant="success"
        className=" text-decoration-none btn btn-success mb-3 mb-md-0"
      >
        Tambah guru
      </a>
      <br />
      <br />
      <Row className="mb-3">
        <Col xs={3} md={5} lg={1}>
          <FormSelect value={gurusPerPage} onChange={handleSelectChange}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </FormSelect>
        </Col>
        <Col></Col>
        <Col xs={4} md={8} lg={3}>
          <Form>
            <FormControl
              type="text"
              placeholder="Cari...."
              className="mr-sm-2"
              value={searchTerm}
              onChange={handleChange}
            />
          </Form>
        </Col>
      </Row>
      <div
        style={{
          maxHeight: filteredGurus.length > 5 ? "320px" : "auto",
          overflowY: filteredGurus.length > 5 ? "scroll" : "auto",
        }}
      >
        <Table striped bordered hover responsive>
          <thead>
            <tr className="text-center">
              <th>No.</th>
              <th>Nama</th>
              <th>Guru Mapel</th>
              <th>No. Telfon</th>
              <th>Alamat</th>
              <th>Walikelas</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentGurus.map((guru, index) => (
              <tr key={guru.id}>
                <td>{indexOfFirstGuru + index + 1 + "."}</td>
                <td>{guru.nama}</td>
                <td>
                  {mapels.find((mapel) => mapel.id === guru.mapelId)?.nama}
                </td>
                <td>{guru.telfon}</td>
                <td>{guru.alamat}</td>
                <td>
                  {guru.walikelasId &&
                    `${
                      kelas.find((kelas) => kelas.id === guru.walikelasId)
                        ?.kelas
                    } ${
                      jurusan.find((kelas) => kelas.id === guru.walikelasId)
                        ?.jurusan
                    }`}
                </td>
                <td style={{ justifyContent: "center" }} className="d-flex">
                  <a
                    href={`/edit_guru/${guru.id}`}
                    className="btn btn-primary text-decoration-none me-3"
                  >
                    Edit
                  </a>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteGuru(guru.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {currentGurus.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">
                  Tidak ada data guru yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <br />
      <Row>
        <Col xs={5} md={4} lg={5}>
          <p>
            Menampilkan {currentGurus.length} dari {filteredGurus.length} data
          </p>
        </Col>
        <Col></Col>
        <Col xs={5} md={3} lg={2}>
          <Pagination className="justify-content-end">
            <Pagination.Prev
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {Array.from(
              { length: Math.ceil(filteredGurus.length / gurusPerPage) },
              (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              )
            )}
            <Pagination.Next
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredGurus.length / gurusPerPage)
              }
            />
          </Pagination>
        </Col>
      </Row>
    </div>
  );
};

export default Guru;
