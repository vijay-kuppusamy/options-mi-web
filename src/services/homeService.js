import axios from "../api/axios";

const PRICE_URL = "/home/price-detail";
const HISTORICAL_URL = "/home/historical-data";

const getPriceDetail = async (reqData) => {
  let symbol = "";
  if (reqData?.symbol) symbol = reqData.symbol;
  const query = `?symbol=${symbol}`;
  const response = await axios.get(PRICE_URL + query);
  return response.data;
};

const getHistoricalData = async (reqData) => {
  let symbol = "";
  if (reqData?.symbol) symbol = reqData.symbol;
  const query = `?symbol=${symbol}`;
  const response = await axios.get(HISTORICAL_URL + query);
  return response.data;
};

const homeService = {
  getPriceDetail,
  getHistoricalData,
};

export default homeService;
