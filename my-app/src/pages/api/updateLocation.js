import axios from "axios";

const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL,
});

export async function updateLocation(locationId, locationData) {
  try {
    console.log("Update Location - Sending location data:", locationId, locationData);
    const token = localStorage.getItem("token");
    const response = await instance.put("/camera/updateLocation", {
      id: locationId,
      location:locationData, 
    });
    console.log("Response from server:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error updating location:", error);
    throw error;
  }
}
