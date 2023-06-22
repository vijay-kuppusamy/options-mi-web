import axios from "../../api/axios";

const getSymbols = async () => {
  const response = await axios.get("/home/symbols");
  return response.data;
};

const settingsService = {
  getSymbols,
};

export default settingsService;
