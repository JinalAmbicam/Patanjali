import axios from "axios";

const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL,
});

export async function deleteZone(zoneId) {
  try {
    console.log("Delete zone - Sending zone ID:", zoneId);
    const token = localStorage.getItem("token");
    const response = await instance.delete("/camera/deleteZone", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data:{
        id: zoneId,
      }
    });
    console.log("Response from server:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error Deleting zone:", error);
    throw error;
  }
}