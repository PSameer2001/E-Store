import React from "react";
import { useAuthContext } from "../Auth/useAuthContext";
import { Navigate, useLocation } from "react-router-dom";

const RedirectPath = ({ children }) => {
  const authUser = useAuthContext();
  const location = useLocation();

  if (authUser.state.name) {
    return children;
  } else {
    <Navigate to="/login" state={{ path: location.pathname }}></Navigate>;
  }
};

export default RedirectPath;
