import axios from "axios";

const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL,
});

export async function searchCamerasByLocation(location){
    try{
        const token = localStorage.getItem("token");
        console.log("Location Queryy:",location)
        const response = await instance.get("/camera/searchCamerasByLocation",{
            params:{            
              location:location,
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
        })
        console.log("Location search:   ",response.data);
        return response.data;
    }
    catch(error){
        throw error;
    }
}