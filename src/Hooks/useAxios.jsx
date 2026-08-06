import axios from 'axios';
import React from 'react';

const axiosInstance = axios.create({
    baseURL: 'https://sd2-server.vercel.app',
    // baseURL: "http://localhost:3000",
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;