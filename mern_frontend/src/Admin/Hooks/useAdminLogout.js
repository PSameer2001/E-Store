import axios from "axios";
import { useAdminAuthContext } from "../AdminAuth/useAdminAuthContext";

const useAdminLogOut = () => {
  const { dispatch } = useAdminAuthContext();

  const logout = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/adminlogout`);
      if (res.data.message === "logout") {
        dispatch({ type: "adminlogout" });
        localStorage.removeItem("authAdmin");
        document.cookie = "jwtAdminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        return res.data.message;
      }
    } catch (error) {
      return error.message;
    }
  };

  return { logout };
};

export default useAdminLogOut;
