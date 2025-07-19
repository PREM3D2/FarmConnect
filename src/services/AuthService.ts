import axios from 'axios';

const API_BASE_URL = 'http://ip.novusapl.com:8080/agaate/api/authenticate/app1000'; // Replace with your actual API base URL

const AuthService = {
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/app-login`, { username, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (mobile: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, { mobile, email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default AuthService;
