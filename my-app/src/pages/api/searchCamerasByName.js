import axios from "axios";

const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL,
});

export async function searchCamerasByName(name){
    try{
      console.log("Name Searched:",name);
        const token = localStorage.getItem("token");
        const response = await instance.get("/camera/searchCamerasByName",{
            params:{            
              name:name
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
        });
        console.log("Searched Cameraaaa: ",response.data);
        return response.data;
    }
    catch(error){
        throw error;
    }
}
