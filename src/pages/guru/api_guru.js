// api_guru.js
import axios from "axios";

const apiUrl = "http://localhost:8080/tugas_akhir/api/guru";

export const getAllGurus = async () => {
  try {
    const response = await axios.get(`${apiUrl}/all`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Gurus: ", error);
    throw error;
  }
};

export const getGuruById = async (id, isPublic = false) => {
  try {
    let config = {};
    if (!isPublic) {
      const token = localStorage.getItem("token");
      config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
    const response = await axios.get(`${apiUrl}/by-id/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch Guru with id ${id}: `, error);
    throw error;
  }
};

export const createGuru = async (GuruData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${apiUrl}/add`, GuruData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create Guru: ", error);
    throw error;
  }
};

export const updateGuru = async (id, GuruData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${apiUrl}/ubah/${id}`, GuruData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update Guru with id ${id}: `, error);
    throw error;
  }
};

export const deleteGuru = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${apiUrl}/hapus/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to delete Guru with id ${id}: `, error);
    throw error;
  }
};
