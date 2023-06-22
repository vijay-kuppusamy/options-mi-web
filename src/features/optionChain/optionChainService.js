import axios from "../../api/axios";

const API_URL = "/optionchain";

const getOptionChain = async (reqData) => {
  let request = { underlying: "", expiryDate: "" };
  if (reqData?.symbol) request.underlying = reqData.symbol;
  if (reqData?.expiry) request.expiryDate = reqData.expiry;
  const response = await axios.post(API_URL, request);
  return response.data;
};

const getOptionData = async (reqData) => {
  let request = { underlying: "", expiryDate: "" };
  if (reqData?.symbol) request.underlying = reqData.symbol;
  if (reqData?.expiry) request.expiryDate = reqData.expiry;
  const response = await axios.post(API_URL + "/optiondata", request);
  return response.data;
};

const optionChainService = {
  getOptionChain,
  getOptionData,
};

export default optionChainService;
