import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Table, Breadcrumb, Modal, Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Mapel() {
    const [mapel, setMapel] = useState([]);
    const [namaMapel, setNamaMapel] = useState("");
    const [guruId, setGuruId] = useState(""); // State untuk menyimpan ID guru terpilih
    const [show, setShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [guruOptions, setGuruOptions] = useState([]); // State untuk menyimpan daftar guru

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getAll = async () => {
        try {
            const response = await axios.get(`http://localhost:3034/mapel/all-guru`);
            setMapel(response.data.data);
        } catch (error) {
            alert("Terjadi Kesalahan" + error);
        }
    };

    // Mengambil daftar guru dari server
    useEffect(() => {
        axios
            .get(`http://localhost:3034/guru/all-guru`)
            .then((response) => {
                setGuruOptions(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching guru options:", error);
            });
    }, []);

    useEffect(() => {
        getAll();
    }, []);

    const add = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3034/mapel", {
                namaMapel: namaMapel,
                guru: guruId, // Menggunakan ID guru terpilih
            });
            setShow(false);
            Swal.fire({
                icon: "success",
                title: "Sukses Menambahkan Data Mapel",
                showConfirmButton: false,
                timer: 1500,
            });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            alert("Terjadi Kesalahan " + error);
        }
    };

    const deleteMapel = async (id) => {
        try {
            await axios.delete(`http://localhost:3034/mapel/` + id);
            Swal.fire({
                icon: "success",
                title: "Dihapus!",
                showConfirmButton: false,
                timer: 1500,
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            alert("Terjadi Kesalahan " + error);
        }
    };

    // Logic for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = mapel.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Search function
    const search = (rows) => {
        return rows.filter(
            (row) =>
                row.namaMapel.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
                row.guru.namaGuru.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        );
    };
    return (
        <div>
            <div className='container mt-5'>
                <Breadcrumb>
                    <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                    <Breadcrumb.Item active>Mapel</Breadcrumb.Item>
                </Breadcrumb>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                    <Button onClick={handleShow} className="btn btn-primary" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <FontAwesomeIcon icon={faPlus} /> Tambah
                    </Button>
                    <input
                        className='rounded-2 p-1'
                        type="text"
                        placeholder="Cari..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Table style={{ border: "2px" }} striped bordered hover responsive className='shadow-sm'>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Mapel</th>
                            <th>Guru Pengampu</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {search(currentItems).map((mapel, index) => {
                            return (
                                <tr key={index}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>{mapel.namaMapel}</td>
                                    <td>{mapel.guru.namaGuru}</td>
                                    <td>
                                        <Button variant="info" size="xs" className="me-2" href={`/editMapel/${mapel.id}`}>
                                            <FontAwesomeIcon icon={faEdit} /> Edit
                                        </Button>
                                        <Button onClick={() => deleteMapel(mapel.id)} variant="danger" size="xs">
                                            <FontAwesomeIcon icon={faTrash} /> Hapus
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                <Pagination>
                    <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                    {Array.from({ length: Math.ceil(mapel.length / itemsPerPage) }, (_, i) => (
                        <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(mapel.length / itemsPerPage)} />
                </Pagination>
                {/* Modal Tambah Mapel */}
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton className="text-dark">
                        <Modal.Title className="text-lg font-bold">Tambah Mapel</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={add}>
                            <div className="mb-4">
                                <label style={{ fontFamily: "Verdana" }} className="block text-sm font-medium text-gray-700">Nama Mapel:</label>
                                <input
                                    placeholder="Nama Mapel"
                                    value={namaMapel}
                                    onChange={(e) => setNamaMapel(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Wali Kelas:</label>
                                <select
                                    className="input-field"
                                    value={guruId}
                                    onChange={(e) => setGuruId(e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Wali Kelas</option>
                                    {guruOptions.map((guru) => (
                                        <option key={guru.id} value={guru.id}>{guru.namaGuru}</option>
                                    ))}
                                </select>
                            </div>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>Batal</Button>
                                <Button variant="primary" type="submit">Simpan</Button>
                            </Modal.Footer>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}

export default Mapel;