import axios from "axios";

const baseURL = "http://192.168.0.103:3000/user";

const instance = axios.create({
  baseURL: baseURL,
});

// const enterpriseId = localStorage.getItem('enterpriseId')
export async function updateUserRoleByMail(email,roleId) {
  try {
      
    const token = localStorage.getItem("token");
    const response = await instance.put("/admin/updateUserRole", {
      email:email,
      roleId:roleId,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}