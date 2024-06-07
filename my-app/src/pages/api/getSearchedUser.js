//​http://192.168.1.26:3000/user/admin/users
//​http://192.168.1.26:3000/user/getAllRoles

import axios from "axios";

const baseURL = "http://192.168.1.26:3000/user";

const instance = axios.create({
  baseURL: baseURL,
});

// const enterpriseId = localStorage.getItem('enterpriseId')
export async function getSearchedUser(searchQuery, enterpriseId) {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.post("/admin/users", {
      searchQuery: searchQuery,
      enterpriseId: enterpriseId // Send enterpriseId in the request body
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}
