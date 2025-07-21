
import axios from 'axios';
import store from '../store/store';

const API_BASE_URL = "http://ip.novusapl.com:8080/agaate/api/app1000"; // Replace with your actual API base URL

const getJwtToken = () => store.getState().auth.token;


const LandService = {
  getplotsbyprojectid: async (projectId: number) => {
    try {
      const token = getJwtToken();
      const response = await axios.get(
        `${API_BASE_URL}/plot/${projectId}`,
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

  getplotbyplotid: async (plotId: string) => {
    try {
      const token = getJwtToken();
      const response = await axios.get(`${API_BASE_URL}/plot/edit/${plotId}`,
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

  addPlot: async (projectData: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.post(`${API_BASE_URL}/plot`, projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePlot: async (projectData: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.put(`${API_BASE_URL}/plot`, projectData,
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

  deletePlot: async (plotId:number) => {
    try {
      const token = getJwtToken();
      const response = await axios.delete(`${API_BASE_URL}/plot/${plotId}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default LandService;
