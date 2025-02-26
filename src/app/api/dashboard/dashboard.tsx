import apiClient from '@/libs/axiosConfig';

export const getDashboardData = async (params: Record<string, any> = {}) => {
  try {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0].replace(/-/g, ''); // Formato YYYYMMDD

    // Configurar parámetros predeterminados
    const defaultParams = {
      datefrom: formattedDate,
      dateto: formattedDate,
      Adjustment: 0,
      AccountManagerID: 0,
    };

    // Combinar parámetros predeterminados con los proporcionados
    const finalParams = { ...defaultParams, ...params };

    // Convertir todos los valores del objeto a strings
    const finalParamsAsStrings = Object.keys(finalParams).reduce((acc, key) => {
      const typedKey = key as keyof typeof finalParams; // Forzar tipo de clave
      acc[key] = String(finalParams[typedKey]);
      return acc;
    }, {} as Record<string, string>);

    // Crear query string
    const queryString = new URLSearchParams(finalParamsAsStrings).toString();

    // Realizar la solicitud
    const response = await apiClient.get(`/reports/dashboard?${queryString}`, {
      headers: {
        'Access-Token': localStorage.getItem('accessToken'),
      },
    });

    return response;
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    throw error;
  }
};
