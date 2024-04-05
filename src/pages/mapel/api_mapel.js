import axios from "axios";

const apiUrl = "http://localhost:8080/tugas_akhir/api/mapel";

export const getAllMapels = async () => {
    try {
      const response = await axios.get(`${apiUrl}/all`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch Mapel: ", error);
      throw error;
    }
  };
  
  export const getMapelById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch Mapel with id ${id}: `, error);
      throw error;
    }
  };
  
  export const createMapel = async (MapelData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${apiUrl}/add`, MapelData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create Mapel: ", error);
      throw error;
    }
  };
  
  export const updateMapel = async (id, MapelData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${apiUrl}/ubah/${id}`, MapelData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to update Mapel with id ${id}: `, error);
      throw error;
    }
  };
  
  export const deleteMapel = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${apiUrl}/hapus/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to delete Mapel with id ${id}: `, error);
      throw error;
    }
  };
  