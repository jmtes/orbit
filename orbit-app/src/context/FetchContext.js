import React, { createContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const FetchContext = createContext();
const { Provider } = FetchContext;

const FetchProvider = ({ children }) => {
  const { authState } = useAuth();

  const authAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  authAxios.interceptors.request.use(
    config => {
      config.headers.Authorization = `Bearer ${authState.token}`;
      return config;
    },
    error => Promise.reject(error)
  );

  return (
    <Provider
      value={{
        authAxios,
      }}
    >
      {children}
    </Provider>
  );
};

export { FetchContext, FetchProvider };
