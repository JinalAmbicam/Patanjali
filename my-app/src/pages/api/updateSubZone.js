import axios from "axios";

const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL,
});

export async function updateSubZone(subZoneId, subZoneData) {
  try {
    console.log("Update SubZone - Sending SubZone data:", subZoneId, subZoneData);
    const token = localStorage.getItem("token");
    const response = await instance.put("/camera/updateSubZone", {
      id: subZoneId, // Assuming your backend expects 'id' for locationId
      subZone:subZoneData, // Spread locationData to send all properties
    });
    console.log("Response from server:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error updating subZone:", error);
    throw error;
  }
}
