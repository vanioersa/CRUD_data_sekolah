import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col, Pagination, Form, FormControl, FormSelect } from "react-bootstrap";
import { getAllGurus, deleteGuru } from "./api_guru";
import Swal from "sweetalert2";

const Guru = () => {
  const [gurus, setGurus] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [gurusPerPage, setGurusPerPage] = useState(10);

  useEffect(() => {
    const fetchGurus = async () => {
      try {
        let data = await getAllGurus();
        data = data.sort((a, b) => b.id - a.id);
        setGurus(data);
      } catch (error) {
        console.error("Failed to fetch Gurus: ", error);
      }
    };
    fetchGurus();
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
    return (
      (guru.nama && guru.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (guru.mapel && guru.mapel.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (guru.alamat && guru.alamat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (telfonString && telfonString.toLowerCase().includes(searchTerm.toLowerCase()))
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
      <div style={{ maxHeight: "325px", overflowY: "scroll" }}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama</th>
              <th>Mapel</th>
              <th>Alamat</th>
              <th>No. Telfon</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentGurus.map((guru, index) => (
              <tr key={guru.id}>
                <td>{indexOfFirstGuru + index + 1 + "."}</td>
                <td>{guru.nama}</td>
                <td>{guru.mapel}</td>
                <td>{guru.alamat}</td>
                <td>{guru.telfon}</td>
                <td className="d-flex">
                  <a
                    href={`/edit_guru/${guru.id}`}
                    className="btn btn-primary text-decoration-none me-2"
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
                <td colSpan="6" className="text-center">
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
