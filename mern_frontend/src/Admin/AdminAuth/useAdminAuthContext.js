import { useContext } from "react";
import { AdminAuthContext } from "./AdminAuthContext";

const useAdminAuthContext = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw Error("useAdminAuthContext must be inside AdminAuthContextProvider");
  }

  return context;
};

export { useAdminAuthContext };
