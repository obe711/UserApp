import axios from "axios";
import { dbUrl } from "../config.json";
import { getCurrentUser } from "./authService";

axios.interceptors.response.use(null, error => {
  //const expectedError =
  //  error.response &&
  //  error.response.status >= 400 &&
  //  error.response.status < 500;
  //
  //if (!expectedError) {
  //  console.error("Logging the error", error);
  //  //logger.log(error);
  //  toast.error("An unexpected error occurred");
  //}

  return; //Promise.reject(error);
});

function authorizeCaller() {
  return axios.create({
    withCredentials: false,
    baseURL: `${dbUrl}`
  });
}

export async function logError(origin, message, state, props) {
  const http = authorizeCaller();

  const user = getCurrentUser();

  const err = { user, origin, message, state, props };

  const { data: response } = await http.post("/errors/new", err);
  return response;
}

export default {
  logError
};
