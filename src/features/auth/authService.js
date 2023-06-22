import axios from "../../api/axios";

// Register user
const register = async (userData) => {
  const response = await axios.post("/auth/register", userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post("/auth/login", userData);
  return response.data;
};

// Login user
const loginWithGoogle = async (userData) => {
  const response = await axios.post("/auth/login-google", userData);
  return response.data;
};

// Authenticate user
const authenticate = async () => {
  const response = await axios.get("/auth");
  return response.data;
};

// get user
const getUser = async () => {
  const response = await axios.get("/auth/user");
  return response.data;
};

// reset user password
const reset = async (userData) => {
  //console.log(userData);
  const response = await axios.post("/auth/reset", userData);
  return response.data;
};

// Logout user
const logout = async () => {
  const response = await axios.post("/auth/logout");
  return response.data;
};

const authService = {
  register,
  logout,
  login,
  loginWithGoogle,
  authenticate,
  getUser,
  reset,
};

export default authService;
