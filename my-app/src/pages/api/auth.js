import axios from 'axios';

// const baseURL = 'https://octopus-app-gl75w.ondigitalocean.app/user'; 
const baseURL = 'http://192.168.1.26:3000/user'

const instance = axios.create({
  baseURL: baseURL
});



export const login = async (email, password,enterpriseId) => {
  try {
    
    const response = await instance.post('/login', {
      email: email,
      password: password,
      enterpriseId:enterpriseId,
    });

    return response.data;
  } catch (error) {
    // Handle errors, and include an error message in the response
    return { success: false, message: error.response.data.message };
  }
};

export const logout = async () => {
  try {
    const response = await instance.get('/logout', {
     
    });

    return response.data;
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};

export const signup = async (email, password,enterpriseId) => {
  try {
    const response = await instance.post('/register', {
      email: email,
      password: password,
      enterpriseId:enterpriseId,
    });

    return response.data;
  } catch (error) {
    // Handle errors, and include an error message in the response
    return { success: false, message: error.response.data.message };
  }
}

export const verify = async (emails, otpValue) => {
  console.log(otpValue,emails)
  try {
    const response = await instance.put('/activate', {
      email: emails,
      activationcode: otpValue,
    });

    return response.data;
  } catch (error) {
    // Handle errors, and include an error message in the response
    return { success: false, message: error.response.data.message };
  }
}

export const reverify = async (emails) => {
  try {
    const response = await instance.post('/resendotp', {
      email: emails,
    });

    return response.data;
  } catch (error) {
    // Handle errors, and include an error message in the response
    return { success: false, message: error.response.data.message };
  }
}

export const forgotPassword = async (email) => {
  try {
    const response = await instance.post('/password/forgot', {
      email: email,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export const resetPassword = async (password, confirmPassword, token) => {
  try {
    const response = await instance.put(`/password/reset/${token}`, {
      password: password,
      confirmPassword: confirmPassword,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updatePassword = async (password, token) => {
  try {
    const response = await instance.post('/password/update', {
      password: password,
      token: token,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

