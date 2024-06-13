import axios from "axios";

const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL,
});

export async function updateCameraLocation(cameraid, locationId, zoneId, subZoneId) {
    try {
      const token = localStorage.getItem("token");
      console.log("Calledd",cameraid,locationId,zoneId,subZoneId)
      const response = await instance.put('/camera/updateCamera', {
        cameraid:cameraid,
        locationId:locationId,
        zoneId:zoneId,
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