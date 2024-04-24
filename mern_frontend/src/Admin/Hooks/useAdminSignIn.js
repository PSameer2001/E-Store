import axios from "axios";
import { useAdminAuthContext } from "../AdminAuth/useAdminAuthContext";

export const useAdminSignIn = () => {
  const { dispatch } = useAdminAuthContext();

  const signin = async (email, password) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/adminlogin`, {
        email,
        password,
      });

      if (res.data.message === "success") {
        const data = {
          name: res.data.authAdmin.name,
          email: res.data.authAdmin.email
        };

        localStorage.setItem("authAdmin", JSON.stringify(data));
        dispatch({
          type: "adminlogin",
          payload: res.data.authAdmin.name,
          payload2: res.data.authAdmin.email,
          payload3: res.data.authAdmin.phone,
          payload4: res.data.authAdmin.address,
          payload5: res.data.authAdmin.isAdmin,
          payload6: res.data.authAdmin.isSuperAdmin
        });

        if (res.data.authAdmin.token) {
          await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/signinadmin_setcookie`,
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
