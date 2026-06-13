import { HttpException } from '@nestjs/common';
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

export const recommendation_api = axios.create({
  baseURL: 'http://localhost:3002/api/recommendation',
  timeout: 1000,
});

recommendation_api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['x-internal-secret'] = 'rahasia';

    return config;
  },
  (error) =>
    Promise.reject(
      error instanceof Error ? error : new Error(String(error)),
    ),
);

recommendation_api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = error.response?.data;
    const status = error.response?.status;

    if (status && message) {
      throw new HttpException(message, status);
    }

    throw new HttpException('Internal Error', 500);
  },
);