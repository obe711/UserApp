import axios from "axios";
import { dbUrl, authUrl } from "../config.json";
import http from "./httpService";
import jwtDecode from "jwt-decode";
import { logError } from "../services/errorService";

const apiAuthEndpoint = "/auth";
const apiConfirmEndpoint = "/confirm";

const tokenKey = "token";

http.setJwt(getJwt());

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.error("Logging the error", error);
    logError("authService - axios", error, this.state, this.props);

    //toast.error("An unexpected error occurred");
  }

  return Promise.reject(error);
});

function authorizeCaller() {
  //GET WEBTOKEN FROM LOCAL STORAGE
  const jwt = getJwt();

  //RETURN AXIOS AUTHORIZED HTTP CALLER
  return axios.create({
    withCredentials: false,
    baseURL: `${authUrl}`,
    headers: {
      common: {
        "x-auth-token": jwt
      }
    }
  });
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  //localStorage.removeItem(tokenKey);
  localStorage.clear();
  window.location = "/";
}

export function login(user) {
  const http = axios.create({
    withCredentials: false
  });

  return http.post(`${authUrl}${apiAuthEndpoint}`, {
    email: user.email,
    password: user.password
  });
}

export function confirm(user) {
  const http = axios.create({
    withCredentials: false
  });

  return http.post(`${authUrl}${apiConfirmEndpoint}/register`, {
    email: user.email,
    password: user.password,
    token: user.token
  });
}

export function passwordReset(email) {
  const http = axios.create({
    withCredentials: false
  });

  return http.post(`${authUrl}${apiConfirmEndpoint}/xres`, {
    email
  });
}

export function getUserFromDB() {
  setJwt();

  const http = authorizeCaller();

  return http.get(`/users/me`);
}

export function changePassword(password, repeatPassword) {
  const http = authorizeCaller();

  return http.put(`${apiAuthEndpoint}`, {
    password: password,
    repeatPassword: repeatPassword
  });
}

export function newUser(name, email, last, password, job) {
  const http = authorizeCaller();

  return http.post(`${dbUrl}/users`, {
    email,
    name,
    last,
    password,
    job
  });
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export function setJwt() {
  axios.defaults.headers.common["x-auth-token"] = getJwt();
}

export function userIsAdmin() {
  if (getCurrentUser().isAdmin) {
    return true;
  } else {
    return false;
  }
}
export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
  setJwt,
  getUserFromDB,
  changePassword,
  userIsAdmin,
  confirm
};
