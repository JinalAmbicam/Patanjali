import axios from "axios";

const baseURL = "http://192.168.0.103:3000";
const instance = axios.create({
  baseURL: baseURL,
});

export async function getCameraCounts(){
    try{
        const token = localStorage.getItem("token");
        const response = await instance.get("/camera/getCounts");
        // console.log("Cam Count:",response.data);
        return response.data;
    }
    catch(error){
        throw error;
    }
}