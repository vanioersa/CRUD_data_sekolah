import axios from "axios";

const apiUrl = "http://localhost:8080/tugas_akhir/api/kelas";

export const getAllKelas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/all`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch Kelas: ", error);
      throw error;
    }
  };
  
  export const getKelasById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch Murid with id ${id}: `, error);
      throw error;
    }
  };
  
  export const createKelas = async (KelasData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${apiUrl}/add`, KelasData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create Kelas: ", error);
      throw error;
    }
  };
  
  export const updateKelas = async (id, KelasData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${apiUrl}/ubah/${id}`, KelasData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to update Kelas with id ${id}: `, error);
      throw error;
    }
  };
  
  export const deleteKelas = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${apiUrl}/hapus/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to delete Kelas with id ${id}: `, error);
      throw error;
    }
  };
  