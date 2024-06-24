import axios from "axios";

const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL,
});

export async function deleteSubZone(subZoneId) {
  try {
    console.log("Delete subzone - Sending location ID:", subZoneId);
    const token = localStorage.getItem("token");
    const response = await instance.delete("/camera/deleteSubZone", {
        data:{
          id: subZoneId,
        } 
      });
    console.log("Response from server:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error Deleting SubZone:", error);
    throw error;
  }
}
