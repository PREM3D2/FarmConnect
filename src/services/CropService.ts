
import axios from 'axios';
import store from '../store/store';

const API_BASE_URL = "http://ip.novusapl.com:8080/agaate/api/app1000"; // Replace with your actual API base URL

const getJwtToken = () => store.getState().auth.token;


const CropService = {
  getcropsbyprojectid: async (projectId: number) => {
    try {
      const token = getJwtToken();
      const response = await axios.get(
        `${API_BASE_URL}/plotcrop?projectCode=${projectId}`,
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

  getcropbycropid: async (cropId: string) => {
    try {
      const token = getJwtToken();
      const response = await axios.get(`${API_BASE_URL}/crop/edit/${cropId}`,
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

  getcropDetailbycropid: async (projectId:number ,cropId: number) => {
    try {
      const token = getJwtToken();
      const response = await axios.get(`${API_BASE_URL}/plotcrop/edit?projectCode=${projectId}&plotCropCode=${cropId}`,
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

  getallCropOptions: async () => {
    try {
      const token = getJwtToken();
      const response = await axios.get(`${API_BASE_URL}/crops`,
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


  getAllSoils: async () => {
    try {
      const token = getJwtToken();
      const response = await axios.get(`${API_BASE_URL}/soils`,
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

  addcrop: async (cropData: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.post(`${API_BASE_URL}/crop`, cropData,
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

  updatecrop: async (projectData: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.put(`${API_BASE_URL}/crop`, projectData,
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

  deletecrop: async (cropId:any) => {
   try {
      const bearerToken = getJwtToken();
      const response = await axios.delete(`${API_BASE_URL}/crop`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
        data: {"code":cropId}, // Pass the request body within the 'data' property of the config object
      });
    } catch (error) {
      console.error('Error during delete request:', error);
    }
  }
};

export default CropService;
