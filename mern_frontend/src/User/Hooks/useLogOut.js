import axios from "axios";
import { useAuthContext } from "../Auth/useAuthContext";

const useLogOut = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    try {
      const res = await axios.post(`${process.env.SERVER_URL}/logout`);
      if (res.data.message === "logout") {
        dispatch({ type: "logout" });
        localStorage.removeItem("authUser");
        return res.data.message;
      }
    } catch (error) {
      return error.message;
    }
  };

  return { logout };
};

export default useLogOut;
