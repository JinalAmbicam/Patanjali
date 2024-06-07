import axios from "axios";

const baseURL = "http://192.168.1.26:3000/user"; // Base URL of your backend server

const instance = axios.create({
    baseURL: baseURL,
    headers: {
        // Include any headers required for authorization or other purposes
        // Example: Authorization: `Bearer ${token}`
    }
});

export async function deleteUser(userId) {
    try {
        console.log("userID:",userId)
        const response = await instance.delete(`/admin/user/${userId}`);
        return response.data; // Return the response data from the server
    } catch (error) {
        throw error; // Throw the error for handling in the calling code
    }
}
