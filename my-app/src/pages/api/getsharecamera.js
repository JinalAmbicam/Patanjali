import axios from 'axios';
import { parseStringPromise } from 'xml2js';

// const baseURL = 'https://octopus-app-gl75w.ondigitalocean.app'; 
const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL
});

export async function getShareCameraList(resultPerPage,page,email) {
  try {
    const token = localStorage.getItem('token');
    console.log(email,resultPerPage,page)
    const response = await instance.get('/camera/sharecamera', {
      params: {
        email: email,
        page: page,
        resultPerPage:resultPerPage,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },

    });
    console.log("Shareee",response.data)
    return response.data;

  } catch (error) {
    throw error;
  }
}

