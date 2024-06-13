import axios from "axios";

const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL,
});

export async function updateCameraZone(cameraid,zoneId) {
    try {
      const token = localStorage.getItem("token");
      console.log("Calledd",cameraid,zoneId)
      const response = await instance.put('/camera/updateCamera', {
        cameraid:cameraid,
        zoneId:zoneId,
      });
      console.log("Resulttttt: ",response.data)
      return response.data;
    } catch (error) {
      console.error('Error updating camera location:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  }