// src/api/api.ts
import axios from 'axios';
import BASE_URL from '../lib/baseUrl'; // Import your centralized base URL

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces
export interface House {
  _id: string;
  houseLocation: string;
  houseSize: string;
  damageDescription: string;
  damageTime: string;
  damageType: string;
  reportedBy: string;
  contactInfo?: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHouseData {
  houseLocation: string;
  houseSize: string;
  damageDescription: string;
  damageTime: string;
  damageType: string;
  reportedBy: string;
  contactInfo?: string;
  images?: File[];
}

// Houses API
export const housesApi = {
  // Get all houses
  getAll: async (): Promise<House[]> => {
    const response = await api.get('/houses');
    return response.data;
  },

  // Get house by ID
  getById: async (id: string): Promise<House> => {
    const response = await api.get(`/houses/details/${id}`);
    return response.data;
  },

  // Create a house report
  create: async (data: CreateHouseData): Promise<House> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file) => formData.append('images', file));
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.post('/houses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.house;
  },

  // Update house report
  update: async (id: string, data: Partial<CreateHouseData>): Promise<House> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file) => formData.append('images', file));
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.put(`/houses/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.house;
  },

  // Delete house report
  delete: async (id: string): Promise<void> => {
    await api.delete(`/houses/${id}`);
  },

  // Replace images
  replaceImages: async (id: string, images: File[]): Promise<House> => {
    const formData = new FormData();
    images.forEach((file) => formData.append('images', file));

    const response = await api.put(`/houses/${id}/replace-images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.house;
  },
};

export default api;
