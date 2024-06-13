import axios from 'axios';
import { parseStringPromise } from 'xml2js';

// const baseURL = 'https://octopus-app-gl75w.ondigitalocean.app'; 
const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL
});

export async function addCamera(deviceid,cameraname,customerId,email) {
  try {
    const token = localStorage.getItem('token');
    const response = await instance.post('/camera/addcamera', {
      name: cameraname,
      cameraID: deviceid,
      customerid: customerId,
      email: email,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
   
    return response.data;

  } catch (error) {
    throw error;
  }
}
