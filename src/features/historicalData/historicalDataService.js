import axios from "../../api/axios";

const API_URL = "/option-historical-data";

const getIndicesHistoricalIoedData = async (reqData) => {
  let request = { symbol: "", date: "" };
  if (reqData?.symbol) request.symbol = reqData.symbol;
  if (reqData?.date) request.date = reqData.date;
  const response = await axios.post(API_URL, request);
  return response.data;
};

const historicalDataService = {
  getIndicesHistoricalIoedData,
};

export default historicalDataService;
