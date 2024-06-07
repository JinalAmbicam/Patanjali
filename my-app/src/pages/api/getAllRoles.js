import axios from "axios";

const baseURL = "http://192.168.1.26:3000/user";

const instance = axios.create({
  baseURL: baseURL,
});

// const enterpriseId = localStorage.getItem('enterpriseId')
export async function getAllRoles() {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get("/admin/getAllRoles");
    return response.data;
  } catch (error) {
    throw error;
  }
}
