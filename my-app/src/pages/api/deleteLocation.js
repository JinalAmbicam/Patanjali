// import axios from "axios";

// const baseURL = "http://192.168.0.103:3000";

// const instance = axios.create({
//   baseURL: baseURL,
// });

// export async function deleteLocation(locationId) {
//   try {
//     console.log("Delete Location - Sending location ID:", locationId);
//     const token = localStorage.getItem("token");
//     const response = await instance.delete(`/camera/deleteLocation/${locationId}`, {
//         id: locationId,
//       });
//     console.log("Response from server:", response.data);

//     return response.data;
//   } catch (error) {
//     console.error("Error Deleting location:", error);
//     throw error;
//   }
// }


import axios from "axios";

const baseURL = "http://192.168.0.103:3000";

const instance = axios.create({
  baseURL: baseURL,
});

export async function deleteLocation(locationId) {
  try {
    console.log("Delete Location - Sending location ID:", locationId);
    const token = localStorage.getItem("token");
    const response = await instance.delete("/camera/deleteLocation", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        id: locationId,
      },
    });
    console.log("Response from server:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error Deleting location:", error);
    throw error;
  }
}
