import apiClient from '@/libs/axiosConfig';

// Obtener datos de Suppliers
export const getHeadByAdvertiserID = async () => {
  try {
    const response = await apiClient.get('/campaignshead?CampaignHeadID=&AdvertiserID=253&StatusID=&consultaAll=0', {
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
