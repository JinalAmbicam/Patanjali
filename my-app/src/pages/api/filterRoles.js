import axios from "axios";

const baseURL = "http://192.168.194.167:3000/user";

const instance = axios.create({
  baseURL: baseURL,
});

export async function filterRoles(page, resultPerPage, searchQuery, enterpriseId) {
    try {
      const token = localStorage.getItem("token");
      console.log("resultPerPage",resultPerPage)
      console.log("searchQuery",searchQuery)
      console.log("enterpriseId",enterpriseId)
      const response = await instance.post("/admin/users", {
        page: page,
        resultPerPage: resultPerPage,
        searchQuery: searchQuery,
        enterpriseId: enterpriseId // Send enterpriseId in the request body
      });
      console.log("BackEnd Response: ",response.data
        
      )
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  