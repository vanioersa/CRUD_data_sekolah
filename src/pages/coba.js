import React, { useEffect, useState } from 'react';
import { Button, Table, Breadcrumb, Modal, Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

function Mapel() {
    const [mapel, setMapel] = useState([]);
    const [namaMapel, setNamaMapel] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [tingkat, setTingkat] = useState("");
    const [semester, setSemester] = useState("");
    const [jamPelajaran, setJamPelajaran] = useState("");
    const [kurikulum, setKurikulum] = useState("");
    const [guruId, setGuruId] = useState("");
    const [show, setShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [guruOptions, setGuruOptions] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getAll = async () => {
        try {
            const response = await axios.get("http://tugas_akhir/api/mapel/all");
            const data = response.data.data.map(item => ({
                ...item,
                deskripsi: item.deskripsi || "-",
                tingkat: item.tingkat || "-",
                semester: item.semester || "-",
                jamPelajaran: item.jamPelajaran || "-",
                kurikulum: item.kurikulum || "-"
            }));
            setMapel(data);
        } catch (error) {
            alert("Terjadi Kesalahan" + error);
        }
    };

    useEffect(() => {
        axios
            .get("http://localhost:8080/tugas_akhir/api/guru/all")
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
            await axios.post("http://localhost:8080/tugas_akhir/api/mapel/mapel", {
                namaMapel: namaMapel,
                deskripsi: deskripsi,
                tingkat: tingkat,
                semester: semester,
                jamPelajaran: jamPelajaran,
                kurikulum: kurikulum,
                guru: guruId,
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
            await axios.delete("http://localhost:8080/tugas_akhir/api/mapel/by-id/" + id);
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = mapel.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                <Table style={{ border: "2px" }} striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Mapel</th>
                            <th>Deskripsi</th>
                            <th>Tingkat</th>
                            <th>Semester</th>
                            <th>Jam Pelajaran</th>
                            <th>Kurikulum</th>
                            <th>Guru Pengampu</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {search(currentItems).map((mapel, index) => {
                            return (
                                <tr key={index}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>{mapel.nama}</td>
                                    <td>{mapel.deskripsi}</td>
                                    <td>{mapel.tingkat}</td>
                                    <td>{mapel.semester}</td>
                                    <td>{mapel.jamPelajaran}</td>
                                    <td>{mapel.kurikulum}</td>
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
                                <label style={{ fontFamily: "Verdana" }} className="block text-sm font-medium text-gray-700">Deskripsi:</label>
                                <input
                                    placeholder="Deskripsi"
                                    value={deskripsi}
                                    onChange={(e) => setDeskripsi(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <div className="mb-4">
                                <label style={{ fontFamily: "Verdana" }} className="block text-sm font-medium text-gray-700">Tingkat:</label>
                                <input
                                    placeholder="Tingkat"
                                    value={tingkat}
                                    onChange={(e) => setTingkat(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <div className="mb-4">
                                <label style={{ fontFamily: "Verdana" }} className="block text-sm font-medium text-gray-700">Semester:</label>
                                <input
                                    placeholder="Semester"
                                    value={semester}
                                    onChange={(e) => setSemester(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <div className="mb-4">
                                <label style={{ fontFamily: "Verdana" }} className="block text-sm font-medium text-gray-700">Jam Pelajaran:</label>
                                <input
                                    placeholder="Jam Pelajaran"
                                    value={jamPelajaran}
                                    onChange={(e) => setJamPelajaran(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <div className="mb-4">
                                <label style={{ fontFamily: "Verdana" }} className="block text-sm font-medium text-gray-700">Kurikulum:</label>
                                <input
                                    placeholder="Kurikulum"
                                    value={kurikulum}
                                    onChange={(e) => setKurikulum(e.target.value)}
                                    className="input-field"
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
