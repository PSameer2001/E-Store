import axios from "axios";
import { useAuthContext } from "../Auth/useAuthContext";

export const useSignIn = () => {
  const { dispatch } = useAuthContext();

  const signin = async (email, password) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/signin`,
        {
          email,
          password,
        }
      );

      if (res.data.message === "success") {
        const data = {
          name: res.data.authUser.name,
          email: res.data.authUser.email,
        };

        localStorage.setItem("authUser", JSON.stringify(data));
        dispatch({
          type: "login",
          payload: res.data.authUser.name,
          payload2: res.data.authUser.email,
          payload3: res.data.authUser.phone,
          payload4: res.data.authUser.address,
          payload5: res.data.authUser.isAdmin,
          payload6: res.data.authUser.isSuperAdmin,
          payload7: res.data.authUser.imageUrl,
        });

        if (res.data.authUser.token) {
          await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/signin_setcookie`,
            {
              params: {
                token: res.data.authUser.token,
              },
            }
          );
        }
      }

      return res.data.message;
    } catch (error) {
      console.log(error);
    }
  };

  return { signin };
};
