import axios from 'axios';
import { parseStringPromise } from 'xml2js';

// const baseURL = 'https://octopus-app-gl75w.ondigitalocean.app'; 
const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL
});

export async function deleteCamera(cameraId,deviceId) {
  try {
    const token = localStorage.getItem('token');
    const response = await instance.delete(`/camera/deletecamera`, {
      params:{
        id:cameraId,
        deviceid:deviceId
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },

    });
   
    return response.data;

  } catch (error) {
    throw error;
  }
}