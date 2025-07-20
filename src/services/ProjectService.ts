import axios from 'axios';

const API_BASE_URL = "http://ip.novusapl.com:8080/agaate/api/app1000"; // Replace with your actual API base URL

const ProjectService = {
  getProjects: async (jwtToken: string, userCode: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/projects/${userCode}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
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
