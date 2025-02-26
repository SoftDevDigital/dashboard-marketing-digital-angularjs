import apiClient from '@/libs/axiosConfig';

// Obtener datos de Suppliers
export const getSuppliers = async () => {
  try {
    const response = await apiClient.get('/suppliers', {
      headers: {
        'Access-Token': localStorage.getItem('accessToken'),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

// Obtener datos de Advertisers
export const getAdvertisers = async () => {
  try {
    const response = await apiClient.get('/advertisers', {
      headers: {
        'Access-Token': localStorage.getItem('accessToken'),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching advertisers:', error);
    throw error;
  }
};
