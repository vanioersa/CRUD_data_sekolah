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
import { getAllMapels, deleteMapel } from "./api_mapel";
import Swal from "sweetalert2";

const Mapel = () => {
  const [mapels, setMapels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mapelsPerPage, setMapelsPerPage] = useState(10);

  useEffect(() => {
    const fetchMapels = async () => {
      try {
        let data = await getAllMapels();
        data = data.sort((a, b) => b.id - a.id);
        setMapels(data);
      } catch (error) {
        console.error("Failed to fetch Mapels: ", error);
      }
    };
    fetchMapels();
  }, []);

  const handleDeleteMapel = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data mapel akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMapel(id);
          const updatedMapels = mapels.filter((mapel) => mapel.id !== id);
          setMapels(updatedMapels);
          Swal.fire({
            title: "Berhasil",
            text: "Mapel berhasil dihapus",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Failed to delete Mapel: ", error);
          let errorMessage = "Gagal menghapus mapel. Silakan coba lagi.";
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
    setMapelsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const indexOfLastMapel = currentPage * mapelsPerPage;
  const indexOfFirstMapel = indexOfLastMapel - mapelsPerPage;
  const filteredMapels = mapels.filter(
    (mapel) =>
      mapel.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapel.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapel.kurikulum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapel.tingkat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapel.semester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapel.jamPelajaran.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMapels = filteredMapels.slice(
    indexOfFirstMapel,
    indexOfLastMapel
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-3">
      <h2>Mapel</h2>
      <a
        href="/add_mapel"
        className="btn btn-success text-decoration-none mb-3 mb-md-0"
      >
        Tambah Mapel
      </a>
      <br />
      <br />
      <Row className="mb-3">
        <Col xs={3} md={5} lg={1}>
          <FormSelect value={mapelsPerPage} onChange={handleSelectChange}>
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
          maxHeight: filteredMapels.length > 5 ? "320px" : "auto",
          overflowY: filteredMapels.length > 5 ? "scroll" : "auto",
        }}
      >
        <Table striped bordered hover responsive>
          <thead>
            <tr className="text-center">
              <th>No.</th>
              <th>Nama Mapel</th>
              <th>Tingkat</th>
              <th>Deskripsi</th>
              <th>Kurikulum</th>
              <th>Semester</th>
              <th>Jam</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentMapels.map((mapel, index) => (
              <tr key={mapel.id}>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {indexOfFirstMapel + index + 1 + "."}
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {mapel.nama}
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {mapel.tingkat}
                </td>
                <td
                  style={{
                    maxWidth: "200px",
                    width: "30%",

                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  {mapel.deskripsi}
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {mapel.kurikulum}
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {mapel.semester}
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {mapel.jamPelajaran}
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
                      href={`/edit_mapel/${mapel.id}`}
                      className="btn btn-primary me-2"
                      style={{ width: "70px" }}
                    >
                      Edit
                    </a>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteMapel(mapel.id)}
                      style={{ width: "70px" }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {currentMapels.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center">
                  Tidak ada data mapel yang ditemukan.
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
            Menampilkan {currentMapels.length} dari {filteredMapels.length} data
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
              { length: Math.ceil(filteredMapels.length / mapelsPerPage) },
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
                currentPage === Math.ceil(filteredMapels.length / mapelsPerPage)
              }
            />
          </Pagination>
        </Col>
      </Row>
    </div>
  );
};

export default Mapel;
