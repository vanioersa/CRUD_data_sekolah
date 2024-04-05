import axios from "axios";

const apiUrl = "http://localhost:8080/tugas_akhir/api/murid";

export const getAllMurids = async () => {
  try {
    const response = await axios.get(`${apiUrl}/all`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Murids: ", error);
    throw error;
  }
};

export const getMuridById = async (id) => {
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

export const createMurid = async (muridData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${apiUrl}/add`, muridData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create murid: ", error);
    throw error;
  }
};

export const updateMurid = async (id, muridData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${apiUrl}/ubah/${id}`, muridData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update Murid with id ${id}: `, error);
    throw error;
  }
};

export const deleteMurid = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${apiUrl}/hapus/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to delete Murid with id ${id}: `, error);
    throw error;
  }
};
