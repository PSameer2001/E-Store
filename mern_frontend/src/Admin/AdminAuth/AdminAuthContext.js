import axios from "axios";
import { createContext, useEffect, useReducer } from "react";

const AdminAuthContext = createContext();

const admin_initialState = { name: null, email: null };

const AdminauthReducer = (state, action) => {
  switch (action.type) {
    case "adminlogin":
      return {
        name: action.payload,
        email: action.payload2,
        phone: action.payload3,
        address: action.payload4,
        isAdmin: action.payload5,
        isSuperAdmin: action.payload6,
      };
    case "adminlogout":
      return { name: null, email: null, phone: null, address: null, isAdmin: null, isSuperAdmin: null };
    default:
      return state;
  }
};

const AdminAuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AdminauthReducer, admin_initialState);

  useEffect(() => {
    const getAdminData = async () => {
      const res = await axios.get(`${process.env.SERVER_URL}/getAdminData`);
      return res.data.adminData;
    };
    getAdminData()
      .then(async (res) => {
        if (res !== "") {
          dispatch({ type: "adminlogin", payload: res.name, payload2: res.email, payload3: res.phone, payload4: res.address, payload5: res.isAdmin, payload6: res.isSuperAdmin});
        }else{
          const res2 = await axios.post("/adminlogout");
          if (res2.data.message === "logout") {
            dispatch({ type: "adminlogout" });
            localStorage.removeItem("authAdmin");
          }
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <AdminAuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export { AdminAuthContext, AdminAuthContextProvider };
