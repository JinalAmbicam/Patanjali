import axios from 'axios';

const backendURL = "http://192.168.0.103:3000";

const backendInstance = axios.create({
  baseURL: backendURL
});

export async function getCameraInfo(customerId, page, resultPerPage) {
  try {
    const response = await backendInstance.get('/camera/getCameraInfo', {
      params: {
        customerid: customerId,
        page: page,
        resultPerPage: resultPerPage
      }
    });
    // console.log("Dataaaaa: ",response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
}
