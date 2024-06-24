import axios from "axios";
const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL,
});

export async function createZone(zoneData) {
  try {
    console.log("Create Zone - Sending Zone data:", zoneData);
    const token = localStorage.getItem("token");
    const response = await instance.post(
      "/camera/createZone",
      {
        zone: zoneData,
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
    console.error("Error creating Zone:", error);
    throw error;
  }
}

