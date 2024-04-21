import axios from "axios";

export const useSignup = () => {
  const signup = async (name, email, password, cpassword) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/signup`, {
        name,
        email,
        password,
        cpassword,
      });

      const data = await res.data.message;
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return { signup };
};
