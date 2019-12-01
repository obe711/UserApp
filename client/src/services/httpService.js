//import { db_get, db_post, db_put, db_delete } from "./dbService";
import { db_get } from "./dbService";

import axios from "axios";

//
export function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

export async function getChartDataWithDates(start, end) {
  return await db_get(`/teams/stats?start=${start}&end=${end}&q`);
}

export default {
  setJwt,
  getChartDataWithDates
};
