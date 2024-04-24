import axios from "axios";

export const useForgotPassword = () => {
  const forgetPassword = async (email, password, otp) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/forgetPassword`, {
        email,
        password,
        otp,
      });

      return res.data.message;
    } catch (error) {
      console.log(error);
    }
  };

  return { forgetPassword };
};
