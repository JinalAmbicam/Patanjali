import axios from 'axios';
import { parseStringPromise } from 'xml2js';

// const baseURL = 'https://octopus-app-gl75w.ondigitalocean.app'; 
const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL
});

export async function ShareCamera(useremail,sharecameraname,cameraid,customerid,receiveremail) {
  try {
    const token = localStorage.getItem('token');
    const response = await instance.post('/camera/sharethiscam', {
        useremail: useremail,
        cameraname: sharecameraname,
        cameraid:cameraid,
        customerid:customerid,
        receiveremail:receiveremail
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
   
    return response.data;

  } catch (error) {
    //   throw error;
      return error.response.data;
  }
}

export async function deleteShareCamera(cameraid,email) {
    try {
      const token = localStorage.getItem('token');
     
      const response = await instance.get('/camera/deletesharedcam', {
        params: {
            cameraid: cameraid,
            email: email,
        },
        headers: {
            Authorization: `Bearer ${token}`,
          },
        });
     
      return response.data;
  
    } catch (error) {
      //   throw error;
        return error.response.data;
    }
  }

