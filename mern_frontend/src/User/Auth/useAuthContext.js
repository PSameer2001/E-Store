import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("useAuthContext must be inside AuthContextProvider");
  }

  return context;
};

export { useAuthContext };
