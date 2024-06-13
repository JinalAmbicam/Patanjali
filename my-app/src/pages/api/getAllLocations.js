import axios from "axios";

const baseURL = "http://192.168.0.103:3000";
const instance = axios.create({
  baseURL: baseURL,
});

// const enterpriseId = localStorage.getItem('enterpriseId')
export async function getAllLocations() {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get("/camera/getAllLocations");
    // console.log("Locationsssssssss: ",response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
}

