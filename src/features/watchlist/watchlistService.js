import axios from "../../api/axios";

const API_URL = "/watchlist";

const getWatchlist = async (reqData) => {
  const response = await axios.get(API_URL);
  return response.data;
};

const saveWatchlist = async (reqData) => {
  const response = await axios.post(API_URL, reqData);
  return response.data;
};

const deleteWatchlist = async (reqData) => {
  const response = await axios.post(API_URL + "/delete", reqData);
  return response.data;
};

const watchlistService = {
  getWatchlist,
  saveWatchlist,
  deleteWatchlist,
};

export default watchlistService;
