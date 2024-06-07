import axios from 'axios';
import { parseStringPromise } from 'xml2js';

// const baseURL = 'https://octopus-app-gl75w.ondigitalocean.app'; 
const baseURL = "http://192.168.1.26:3000";

const instance = axios.create({
  baseURL: baseURL
});

export async function getSharecameraname(email) {
  try {
    
    const token = localStorage.getItem('token');
    const response = await instance.get('/camera/sharecameraList', {
      params: {
        email: email,
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

