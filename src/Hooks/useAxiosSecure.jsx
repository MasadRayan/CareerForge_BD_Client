import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "https://sd2-server.vercel.app",
  // baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const { user, logOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && user?.accessToken) {
      const requestInterceptor = axiosSecure.interceptors.request.use(
        async (config) => {
          const token = await user.getIdToken(true);
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        },
      );

      const responseInterceptor = axiosSecure.interceptors.response.use(
        (response) => response,
        (error) => {
          if (
            error?.response?.status === 401 ||
            error?.response?.status === 403
          ) {
            logOut()
              .then(() => console.log("Logged out due to invalid token"))
              .catch(console.error);
          }
          return Promise.reject(error);
        },
      );

      return () => {
        axiosSecure.interceptors.request.eject(requestInterceptor);
        axiosSecure.interceptors.response.eject(responseInterceptor);
      };
    }
  }, [user, loading, logOut]);

  return axiosSecure;
};

export default useAxiosSecure;
