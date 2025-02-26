import { AxiosResponse } from 'axios';

import apiClient from '@/libs/axiosConfig'; // Importa apiClient desde axiosConfig.js

interface AuthenticationResponse {
  status: string;
  result: {
    access_token: string;
    [key: string]: any;
  };
}

interface Credentials {
  email: string;
  password: string;
}

export const authenticateUser = async (credentials: Credentials): Promise<boolean> => {
  try {
    const response: AxiosResponse<AuthenticationResponse> = await apiClient.post('/auth', credentials);

    if (response.data && response.data.result?.access_token) {
      localStorage.setItem('accessToken', response.data.result.access_token);
      return true;
    }

    throw new Error('Error en la autenticación: Token no encontrado');
  } catch (error) {
    console.error('Error al autenticar:', error);
    throw error;
  }
};
