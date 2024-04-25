import axios from "axios";
import getUserCookie from "../Auth/getUserCookie";

export const useSendOTP = () => {
  const userHeaders = getUserCookie();
  const sendotp = async (email) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/SendOtp`, {
        email,
      },userHeaders);
      
      return res.data.message;
    } catch (error) {
      console.log(error);
    }
  };

  return { sendotp };
};
