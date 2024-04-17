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
import Swal from "sweetalert2";
import { getAllMurids, deleteMurid } from "./api_murid";
import axios from "axios";

const Murid = () => {
  const [murids, setMurids] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [jurusan, setJurusan] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [muridsPerPage, setMuridsPerPage] = useState(10);

  useEffect(() => {
    const fetchMurids = async () => {
      try {
        let data = await getAllMurids();
        data = data.sort((a, b) => b.id - a.id);
        setMurids(data);
      } catch (error) {
        console.error("Failed to fetch Murids: ", error);
      }
    };
    fetchMurids();
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

  const handleDeleteMurid = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data murid akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMurid(id);
          const updatedMurids = murids.filter((murid) => murid.id !== id);
          setMurids(updatedMurids);
          Swal.fire({
            title: "Berhasil",
            text: "Murid berhasil dihapus",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Failed to delete Murid: ", error);
          let errorMessage = "Gagal menghapus murid. Silakan coba lagi.";
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
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
    setMuridsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const indexOfLastMurid = currentPage * muridsPerPage;
  const indexOfFirstMurid = indexOfLastMurid - muridsPerPage;
  const filteredMurids = murids.filter((murid) => {
    const nikString = murid.nik && murid.nik.toString();
    const nisnString = murid.nisn && murid.nisn.toString();
    const umurString = murid.umur && murid.umur.toString();
    const kelasNama =
      murid.kelasId && kelas.find((k) => k.id === murid.kelasId)?.nama;
    const jurusanNama =
      murid.kelasId && jurusan.find((j) => j.id === murid.kelasId)?.jurusan;
    return (
      (murid.nama &&
        murid.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (murid.lahir &&
        murid.lahir.toString().includes(searchTerm.toLowerCase())) ||
      (umurString &&
        umurString.toString().includes(searchTerm.toLowerCase())) ||
      umurString.includes(searchTerm.toLowerCase()) ||
      umurString.includes(`(${searchTerm.toLowerCase()} tahun)`) ||
      (nikString &&
        nikString.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (nisnString &&
        nisnString.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (kelasNama &&
        kelasNama.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (jurusanNama &&
        jurusanNama.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (murid.alamat &&
        murid.alamat.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const currentMurids = filteredMurids.slice(
    indexOfFirstMurid,
    indexOfLastMurid
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-3">
      <h2>Murid</h2>
      <a
        href="/add_murid"
        className="btn btn-success text-decoration-none mb-3 mb-md-0"
      >
        Tambah Murid
      </a>
      <br />
      <br />
      <Row className="mb-3">
        <Col xs={3} md={5} lg={1}>
          <FormSelect value={muridsPerPage} onChange={handleSelectChange}>
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
          maxHeight: filteredMurids.length > 5 ? "320px" : "auto",
          overflowY: filteredMurids.length > 5 ? "scroll" : "auto",
        }}
      >
        <Table striped bordered hover responsive>
          <thead>
            <tr className="text-center">
              <th>No.</th>
              <th>Nama</th>
              <th>Tanggal Lahir</th>
              <th>Umur</th>
              <th>Alamat</th>
              <th>NIK</th>
              <th>NISN</th>
              <th>Kelas</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentMurids.map((murid, index) => (
              <tr key={index}>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>{indexOfFirstMurid + index + 1 + "."}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>{murid.nama}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>{murid.lahir}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>{murid.umur}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>{murid.alamat}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>{murid.nik}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>{murid.nisn}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {murid.kelasId &&
                    `${
                      kelas.find((kelas) => kelas.id === murid.kelasId)?.kelas
                    } ${
                      jurusan.find((kelas) => kelas.id === murid.kelasId)
                        ?.jurusan
                    }`}
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                  <a
                    href={`/edit_murid/${murid.id}`}
                    className="btn btn-primary text-decoration-none me-2"
                  >
                    Edit
                  </a>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteMurid(murid.id)}
                  >
                    Hapus
                  </Button>
                  </div>
                </td>
              </tr>
            ))}
            {currentMurids.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center">
                  Tidak ada data murid yang ditemukan.
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
            Menampilkan {currentMurids.length} dari {filteredMurids.length} data
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
              { length: Math.ceil(filteredMurids.length / muridsPerPage) },
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
                currentPage === Math.ceil(filteredMurids.length / muridsPerPage)
              }
            />
          </Pagination>
        </Col>
      </Row>
    </div>
  );
};

export default Murid;
