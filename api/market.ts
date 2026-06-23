import { httpClient } from './client';

export const getAllStocks = async (symbol: string, range = '1y') => {
  try {
    const response = await httpClient.get('/market/stacks', {
      params: { stock: symbol, range },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
};