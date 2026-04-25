import axios from 'axios';

const API_BASE_URL = "/api/auth";

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: email,
        password: password
      });

      // Store user info in localStorage (no JWT)
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Login failed';
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Registration failed';
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        return null;
      }
      
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  }
};

export default authService;