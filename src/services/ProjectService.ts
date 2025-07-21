import axios from 'axios';
import store from '../store/store';

const API_BASE_URL = "http://ip.novusapl.com:8080/agaate/api/app1000"; // Replace with your actual API base URL

const getJwtToken = () => store.getState().auth.token;
const getUserCode = () => store.getState().auth.user?.code;

const ProjectService = {
  getProjects: async () => {
    try {
      const token = getJwtToken();
      const userCode = getUserCode();
      const response = await axios.get(
        `${API_BASE_URL}/projects/${userCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProjectDetail: async (projectId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addProject: async (projectData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/projects`, projectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProject: async (projectId: string, projectData: any) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteProject: async (projectId: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ProjectService;
