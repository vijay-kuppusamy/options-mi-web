import React from "react";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Reset from "../pages/auth/Reset";

const AuthRoutes = {
  path: "/",
  children: [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/reset",
      element: <Reset />,
    },
  ],
};

export default AuthRoutes;
