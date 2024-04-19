import axios from "axios";
import { useAdminAuthContext } from "../AdminAuth/useAdminAuthContext";

const useAdminLogOut = () => {
  const { dispatch } = useAdminAuthContext();

  const logout = async () => {
    try {
      const res = await axios.post("/adminlogout");
      if (res.data.message === "logout") {
        dispatch({ type: "adminlogout" });
        localStorage.removeItem("authAdmin");
        return res.data.message;
      }
    } catch (error) {
      return error.message;
    }
  };

  return { logout };
};

export default useAdminLogOut;
