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
import { getAllKelas, deleteKelas } from "./api_kelas";
import Swal from "sweetalert2";

const Kelas = () => {
  const [kelas, setKelas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [kelasPerPage, setKelasPerPage] = useState(10);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        let data = await getAllKelas();
        data = data.sort((a, b) => b.id - a.id);
        setKelas(data);
      } catch (error) {
        console.error("Failed to fetch Kelas: ", error);
      }
    };
    fetchKelas();
  }, []);

  const handleDeleteKelas = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data kelas akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteKelas(id);
          const updatedKelas = kelas.filter((kelas) => kelas.id !== id);
          setKelas(updatedKelas);
          Swal.fire({
            title: "Berhasil",
            text: "Kelas berhasil dihapus",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Failed to delete Kelas: ", error);
          let errorMessage = "Gagal menghapus kelas. Silakan coba lagi.";
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
    setKelasPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const indexOfLastKelas = currentPage * kelasPerPage;
  const indexOfFirstKelas = indexOfLastKelas - kelasPerPage;
  const filteredKelas = kelas.filter(
    (kelas) =>
      (kelas.kelas &&
        kelas.kelas
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (kelas.jurusan &&
        kelas.jurusan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (kelas.jumlah &&
        kelas.jumlah
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (kelas.tahunAjaran &&
        kelas.tahunAjaran.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentKelas = filteredKelas.slice(indexOfFirstKelas, indexOfLastKelas);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-3">
      <h2>Kelas</h2>
      <a
        href="/add_kelas"
        className="text-decoration-none btn btn-success mb-3 mb-md-0"
      >
        Tambah Kelas
      </a>
      <br />
      <br />
      <Row className="mb-3">
        <Col xs={3} md={5} lg={1}>
          <FormSelect value={kelasPerPage} onChange={handleSelectChange}>
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
          maxHeight: filteredKelas.length > 5 ? "320px" : "auto",
          overflowY: filteredKelas.length > 5 ? "scroll" : "auto",
        }}
      >
        <Table striped bordered hover responsive>
          <thead>
            <tr className="text-center">
              <th>No.</th>
              <th>Kelas</th>
              <th>Jurusan</th>
              <th>Jumlah Murid</th>
              <th>Tahun Ajaran</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentKelas.map((kelas, index) => (
              <tr key={kelas.id}>
                <td>{indexOfFirstKelas + index + 1 + "."}</td>
                <td>{kelas.kelas}</td>
                <td>{kelas.jurusan}</td>
                <td>{kelas.jumlah}</td>
                <td>{kelas.tahunAjaran}</td>
                <td style={{ justifyContent: "center" }} className="d-flex">
                  <a
                    href={`/edit_kelas/${kelas.id}`}
                    className="text-decoration-none btn btn-primary me-3"
                  >
                    Edit
                  </a>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteKelas(kelas.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {currentKelas.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  Tidak ada data kelas yang ditemukan.
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
            Menampilkan {currentKelas.length} dari {filteredKelas.length} data
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
              { length: Math.ceil(filteredKelas.length / kelasPerPage) },
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
                currentPage === Math.ceil(filteredKelas.length / kelasPerPage)
              }
            />
          </Pagination>
        </Col>
      </Row>
    </div>
  );
};

export default Kelas;
