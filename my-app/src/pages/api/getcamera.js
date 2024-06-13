import axios from 'axios';
import { parseStringPromise } from 'xml2js';

// const baseURL = 'https://octopus-app-gl75w.ondigitalocean.app'; 
const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL
});

function getUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const shareId = urlParams.get('shareId');
  const contentId = urlParams.get('contentId');
  return { shareId, contentId };
}

export async function getCustomerCameraList(customerId,page,resultPerPage) {
  const gg = getUrlParameters();
  try {

    const token = localStorage.getItem('token');
    const response = await instance.get('/camera', {
      params: {
        customerid: customerId,
        page: page,
        resultPerPage:resultPerPage,
        shareId : gg.shareId,
        contentId :gg.contentId
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
