import axios from "axios";

const baseURL = "http://192.168.1.26:3000";

const instance = axios.create({
  baseURL: baseURL,
});

export async function updateCameraSubZone(cameraid,subZoneId) {
    try {
      const token = localStorage.getItem("token");
      console.log("Calledd",cameraid,subZoneId)
      const response = await instance.put('/camera/updateCamera', {
        cameraid:cameraid,
        subZoneId:subZoneId,
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