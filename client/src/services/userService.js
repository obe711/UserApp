import { getJwt } from "./authService";
import axios from "axios";
import { authUrl } from "../config.json";
import { toast } from "react-toastify";
import { logError } from "../services/errorService";

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.error("Logging the error", error);
    logError("dbService - axios", error, this.state, this.props);
    toast.error("An unexpected error occurred");
  }

  return Promise.reject(error);
});

const userEndpoint = `/users`;

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

export function register(user) {
  const http = authorizeCaller();

  return http.post(userEndpoint, user);
}

export async function invite(email) {
  const http = authorizeCaller();

  try {
    const { data: response } = await http.post(`/invite/register`, {
      email: email
    });
    console.log(response);
    alert(`Invite sent ${response}`);
  } catch (ex) {
    alert(`Error while inviting... `);
  }
}

export async function getMe() {
  const http = authorizeCaller();

  const { data: me } = await http.get(`${userEndpoint}/me`);

  return me;
}

export async function updateMe(updateUser) {
  const http = authorizeCaller();

  const me = await http.put(
    `${userEndpoint}/me`,
    { updateUser },
    { useFindAndModify: false }
  );

  return me;
}

export function userList() {
  const http = authorizeCaller();
  return http.get(`${userEndpoint}/userlist`);
}
export function getUser(id) {
  const http = authorizeCaller();
  return http.get(`${userEndpoint}/id/${id}`);
}
export function editUser(id, user) {
  const http = authorizeCaller();
  return http.put(`${userEndpoint}/id/${id}`, { user });
}

export async function sendMessage(message) {
  const http = authorizeCaller();
  const { user, messageText } = message;

  try {
    const response = await http.post(`${userEndpoint}/send/id/${user}`, {
      messageText
    });

    //console.log(response);
    return response;
  } catch (ex) {
    logError("sendMessage - axios", ex, this.state, this.props);
  }
}

export async function getActiviy() {
  const http = authorizeCaller();

  const { data: activityList } = await http.get(`${userEndpoint}/activity`);
  console.log(activityList);
  return activityList;
}

export async function sendBookingRequest(message) {
  const http = authorizeCaller();
  const { data: response } = await http.post(
    `${userEndpoint}/request`,
    message
  );

  return response;
}

//Compass Updater
export function getStatus() {
  const http = authorizeCaller();
  return http.get(`${userEndpoint}/update/status`);
}
export async function startCompassUpdate() {
  const http = authorizeCaller();
  return await http.get(`${userEndpoint}/update/compass`);
}


export default {
  invite,
  getMe,
  updateMe,
  userList,
  sendMessage,
  getActiviy,
  getStatus,
  startCompassUpdate
};
