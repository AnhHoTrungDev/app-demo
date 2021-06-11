import { axiosClient } from "..";

const login = (username: string, password: string) => {
  return axiosClient.post(`/auth/login`, {
    username,
    password,
  });
};

const refreshToken = () => {
  // console.clear();
  console.log("refresh token");
  return axiosClient.get(`/auth/refresh/token`, {});
};

const log = (log: string | number) => {
  console.log("log :>> ", log);
  return axiosClient.get(`/users/log`, {
    params: {
      log,
    },
  });
};

export { login, refreshToken, log };
