import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_API_SERVER,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Content-Type": "application/json",
  },
  withCredentials: true,
  credentials: "include",
});
