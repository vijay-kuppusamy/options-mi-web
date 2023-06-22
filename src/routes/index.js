//thirdpart imports
import { useRoutes } from "react-router-dom";

//Project imports
import MainRoutes from "./MainRoutes";
import AuthRoutes from "./AuthRoutes";

export default function AppRoutes() {
  return useRoutes([MainRoutes, AuthRoutes]);
}
