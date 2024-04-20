import axios from "axios";

export const useForgotPassword = () => {
  const forgetPassword = async (email, password, otp) => {
    try {
      const res = await axios.post(`/forgetPassword`, {
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
