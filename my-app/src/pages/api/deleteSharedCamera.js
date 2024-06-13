import axios from "axios";

const baseURL = "http://192.168.0.103:3000"; // Base URL of your backend server

const instance = axios.create({
    baseURL: baseURL,
    headers: {
        // Include any headers required for authorization or other purposes
        // Example: Authorization: `Bearer ${token}`
    }
});

export async function deleteSharedCamera(email, cameraid) {
    try {
      console.log("mail:", email)
      console.log("cameraid:", cameraid)
        const token = localStorage.getItem('token');
        const response = await instance.get('/camera/deletesharedcam', {
            params: {
              email: email,
              cameraid: cameraid,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
      
          });
          console.log("Delete response: ", response.data)
          return response.data;
    } catch (error) {
        throw error; // Throw the error for handling in the calling code
    }
}