import axios from "axios";

export const useSendOTP = () => {
  const sendotp = async (email) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/SendOtp`, {
        email,
      });
      
      return res.data.message;
    } catch (error) {
      console.log(error);
    }
  };

  return { sendotp };
};
