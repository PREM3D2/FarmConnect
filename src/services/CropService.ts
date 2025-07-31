
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

  getcropDetailbycropid: async (projectId: number, cropId: number) => {
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

   getCropFailureReasons: async () => {
    try {
      const token = getJwtToken();
      const response = await axios.get(`${API_BASE_URL}/crop-failure-reasons`,
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
      const response = await axios.post(`${API_BASE_URL}/plotcrop`, cropData,
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


  addCropProtectionDate: async (requestBody: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.post(`${API_BASE_URL}/plotcrop/protection-expected`, requestBody,
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
      const response = await axios.put(`${API_BASE_URL}/plotcrop`, projectData,
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

  updatecropNurseryDate: async (requestBody: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.put(`${API_BASE_URL}/plotcrop/nursery-status`, requestBody,
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

  updatecropStackingDate: async (requestBody: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.put(`${API_BASE_URL}/plotcrop/stacking-status`, requestBody,
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

  updateProtectionActualDate: async (requestBody: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.put(`${API_BASE_URL}/plotcrop/protection-actual`, requestBody,
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

  updateCultivationExpectedDate: async (requestBody: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.put(`${API_BASE_URL}/plotcrop/cultivation-expected`, requestBody,
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

  updateCultivationActualDate: async (requestBody: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.put(`${API_BASE_URL}/plotcrop/cultivation-actual`, requestBody,
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

   updateharveststartexpectedDate: async (requestBody: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.put(`${API_BASE_URL}/plotcrop/harvest-start-expected`, requestBody,
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

  updateharveststartactualDate: async (requestBody: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.put(`${API_BASE_URL}/plotcrop/harvest-start-actual`, requestBody,
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

  updateharvestendexpectedDate: async (requestBody: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.put(`${API_BASE_URL}/plotcrop/harvest-end-expected`, requestBody,
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

  updateharvestendactualDate: async (requestBody: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.put(`${API_BASE_URL}/plotcrop/harvest-end-actual`, requestBody,
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

  addUpdateCropHarvest: async (requestBody: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.post(`${API_BASE_URL}/plotcrop/harvest`, requestBody,
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

  updateUprootExpectedDate: async (requestBody: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.put(`${API_BASE_URL}/plotcrop/uproot-expected`, requestBody,
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

  updateUprootActualDate: async (requestBody: any) => {
    try {
      const token = getJwtToken();
      const response = await axios.put(`${API_BASE_URL}/plotcrop/uproot-actual`, requestBody,
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

  deletecrop: async (cropId: any) => {
    try {
      const bearerToken = getJwtToken();
      const response = await axios.delete(`${API_BASE_URL}/crop`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
        data: { "code": cropId }, // Pass the request body within the 'data' property of the config object
      });
    } catch (error) {  
    }
  },

  deleteCropProtectionExpected: async (protectionId: any) => {
    try {
      const bearerToken = getJwtToken();
      const response = await axios.delete(`${API_BASE_URL}/plotcrop/protection-expected`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
        data: { "code": protectionId }, // Pass the request body within the 'data' property of the config object
      });
    } catch (error) {
      
    }
  },

   deleteYield: async (id: any) => {
    try {
      const bearerToken = getJwtToken();
      const response = await axios.delete(`${API_BASE_URL}/plotcrop/harvest`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
        data: { "code": id }, // Pass the request body within the 'data' property of the config object
      });
    } catch (error) {
      
    }
  }
};

export default CropService;
