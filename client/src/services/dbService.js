import { getJwt } from "./authService";
import axios from "axios";
import { dbUrl } from "../config.json";
import { logError } from "../services/errorService";

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.error("Logging the error", error);
    logError("dbService - axios", error, this.state, this.props);
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
    baseURL: `${dbUrl}`,
    headers: {
      common: {
        "x-auth-token": jwt
      }
    }
  });
}

export async function db_get(endPoint) {
  const http = authorizeCaller();

  const { data: response } = await http.get(endPoint);
  return response;
}

export async function db_post(endPoint, body) {
  const http = authorizeCaller();

  const { data: response } = await http.post(endPoint, body);
  return response;
}

export async function db_put(endPoint, body) {
  const http = authorizeCaller();

  const { data: response } = await http.put(endPoint, body);
  return response;
}

export async function db_delete(endPoint) {
  const http = authorizeCaller();

  const { data: response } = await http.delete(endPoint);
  return response;
}

export default {
  db_get,
  db_post,
  db_put,
  db_delete
};
