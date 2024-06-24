import axios from "axios";
const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL,
});

export async function createLocation(locationData) {
  try {
    console.log("Create Location - Sending location data:", locationData);
    const token = localStorage.getItem("token");
    const response = await instance.post(
      "/camera/createLocation",
      {
        location: locationData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response from server:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error creating location:", error);
    throw error;
  }
}

