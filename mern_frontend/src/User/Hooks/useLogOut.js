import axios from "axios";
import { useAuthContext } from "../Auth/useAuthContext";
import getUserCookie from "../Auth/getUserCookie";

const useLogOut = () => {
  const { dispatch } = useAuthContext();
  const userHeaders = getUserCookie();
  const logout = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/logout`, userHeaders);
      if (res.data.message === "logout") {
        dispatch({ type: "logout" });
        localStorage.removeItem("authUser");
        document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        return res.data.message;
      }
    } catch (error) {
      return error.message;
    }
  };

  return { logout };
};

export default useLogOut;
