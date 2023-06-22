import axios from "../../api/axios";

const API_URL = "/portfolio";

const getPortfolio = async (reqData) => {
  const response = await axios.get(API_URL);
  return response.data;
};

const savePortfolio = async (reqData) => {
  const response = await axios.post(API_URL, reqData);
  return response.data;
};

const deletePortfolio = async (reqData) => {
  const response = await axios.post(API_URL + "/delete", reqData);
  return response.data;
};

const portfolioService = {
  getPortfolio,
  savePortfolio,
  deletePortfolio,
};

export default portfolioService;
