import axios from "../../api/axios";

const API_URL = "/account";

const getUser = async (reqData) => {
  const response = await axios.get(API_URL);
  return response.data;
};

const saveUser = async (reqData) => {
  const response = await axios.post(API_URL, reqData);
  return response.data;
};

const accountService = {
  getUser,
  saveUser,
};

export default accountService;
