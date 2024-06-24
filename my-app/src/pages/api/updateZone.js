import axios from "axios";

const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL,
});

export async function updateZone(zoneId, zoneData) {
  try {
    console.log("Update zone - Sending zone data:", zoneId, zoneData);
    const token = localStorage.getItem("token");
    const response = await instance.put("/camera/updateZone", {
      id: zoneId,
      zone:zoneData, 
    });
    console.log("Response from server:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error updating zone:", error);
    throw error;
  }
}
