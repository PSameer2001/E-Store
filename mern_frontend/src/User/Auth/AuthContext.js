import axios from "axios";
import { createContext, useEffect, useReducer } from "react";

const AuthContext = createContext();

const initialState = { name: null, email: null };

const authReducer = (state, action) => {
  switch (action.type) {
    case "login":
      return {
        name: action.payload,
        email: action.payload2,
        phone: action.payload3,
        address: action.payload4,
        isAdmin: action.payload5,
        isSuperAdmin: action.payload6,
        imageUrl: action.payload7,
      };
    case "logout":
      return { name: null, email: null, phone: null, address: null, isAdmin: null, isSuperAdmin: null, imageUrl: null };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const getUserData = async () => {
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getUserData`);
      return res.data.userData;
    };
    getUserData()
      .then((res) => {
        if (res !== "") {
          dispatch({ type: "login", payload: res.name, payload2: res.email, payload3: res.phone, payload4: res.address, payload5: res.isAdmin, payload6: res.isSuperAdmin, payload7: res.imageUrl});
        }
      })
      .catch((err) => console.log(err));

    // const user = JSON.parse(localStorage.getItem("authUser"));
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
