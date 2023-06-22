import axios from "../../api/axios";

const API_URL = "/strategy";

const getStrategies = async (reqData) => {
  const response = await axios.get(API_URL);
  return response.data;
};

const saveStrategy = async (reqData) => {
  const response = await axios.post(API_URL, reqData);
  return response.data;
};

const deleteStrategy = async (reqData) => {
  const response = await axios.post(API_URL + "/delete", reqData);
  return response.data;
};

const strategyBuilderService = {
  getStrategies,
  saveStrategy,
  deleteStrategy,
};

export default strategyBuilderService;
