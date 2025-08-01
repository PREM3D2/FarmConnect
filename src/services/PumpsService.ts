
import axios from 'axios';
import store from '../store/store';

const API_BASE_URL = "http://ip.novusapl.com:8080/agaate/api/app1000"; // Replace with your actual API base URL

const getJwtToken = () => store.getState().auth.token;


const PumpService = {
  getPumpsbyprojectid: async (projectId: number) => {
    try {
      const token = getJwtToken();
      const response = await axios.get(
        `${API_BASE_URL}/pump/${projectId}`,
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

  getPumpbyPumpid: async (PumpId: string) => {
    try {
      const token = getJwtToken();
      const response = await axios.get(`${API_BASE_URL}/pump/edit/${PumpId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API", response.data.result)
      return response.data.result
    } catch (error) {
      throw error;
    }
  },

  addPump: async (PumpData: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.post(`${API_BASE_URL}/pump`, PumpData,
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

  updatePump: async (projectData: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.put(`${API_BASE_URL}/pump`, projectData,
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

  mapVenturiesToPump: async (requestBody: any) => {
    try {
      const token = getJwtToken();
      console.log("requestBody", requestBody)
      const response = await axios.put(`${API_BASE_URL}/pump/venturi/map`, requestBody,
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

  deletePump: async (PumpId:any) => {
   try {
      const bearerToken = getJwtToken();
      const response = await axios.delete(`${API_BASE_URL}/pump`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
        data: {"code":PumpId}, // Pass the request body within the 'data' property of the config object
      });
    } catch (error) {
      console.error('Error during delete request:', error);
    }
  }
};

export default PumpService;
