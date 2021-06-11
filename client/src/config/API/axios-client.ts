import axios, { AxiosResponse } from "axios";
import { BASE_AUTHENTICATION } from "constant";
import { refreshToken } from "./call-api";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_LINK_API || "http://localhost:3001",
  withCredentials: true,
});

let isRefreshToken: null | Promise<AxiosResponse<any>> = null;
const publicRouter = ["/auth/refresh/token", "/auth/login"];

const isPublicRouter = (value: string = "") => {
  return publicRouter.indexOf(value) !== -1;
};

axiosClient.interceptors.request.use(async (config) => {
  const exp = localStorage.getItem("exp");
  const now = new Date().valueOf();
  const isTokenExpired = now - Number(exp) * 1000 > 0;

  const { url } = config;
  if (isTokenExpired && !isPublicRouter(url)) {
    isRefreshToken = isRefreshToken ? isRefreshToken : refreshToken();
    try {
      await isRefreshToken;
    } catch (error) {
      console.log("error :>> ", error);
    }

    isRefreshToken = null;
  }

  const token = localStorage.getItem(BASE_AUTHENTICATION);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    const {
      config: { url },
      data: { token: accessToken, exp },
    } = response;

    if (isPublicRouter(url)) {
      if (accessToken) {
        localStorage.setItem(BASE_AUTHENTICATION, accessToken);
        localStorage.setItem("exp", exp);
      }
    }

    return response?.data;
  },
  (error) => {
    const {
      response: {
        data: { path },
        status,
      },
    } = error;

    if (status === 401) {
      localStorage.removeItem(BASE_AUTHENTICATION);
      if (!isPublicRouter(path)) {
        window.location = "/auth/login" as unknown as Location;
      }
    }
    throw error;
  }
);

export { axiosClient };
