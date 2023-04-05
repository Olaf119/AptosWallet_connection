import axios from "axios";

const API_URL = "http://127.0.0.1:5000/";

export const register = (username: string, email: string, password: string) => {
  return axios.post(API_URL + "api/users/register", {
    name: username,
    email,
    password,
    password2: password
  });
};

export const login = (email: string, password: string, account: object) => {
  return axios
    .post(API_URL + "api/users/login", {
      email,
      password,
      account
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  return null;
};
