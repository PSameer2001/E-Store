import axios from "axios";
import getUserCookie from "../Auth/getUserCookie";

export const useForgotPassword = () => {
  const userHeaders = getUserCookie();
  const forgetPassword = async (email, password, otp) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/forgetPassword`, {
        email,
        password,
        otp,
      },userHeaders);

      return res.data.message;
    } catch (error) {
      console.log(error);
    }
  };

  return { forgetPassword };
};
