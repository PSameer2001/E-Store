import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import UserRoute from "./User/UserRoute";
import { AuthContextProvider } from "./User/Auth/AuthContext";

import AdminRoute from "./Admin/AdminRoute";
import { AdminAuthContextProvider } from "./Admin/AdminAuth/AdminAuthContext";

function App() {
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {pathname.startsWith("/admin") ? (
        <AdminAuthContextProvider>
          <AdminRoute />
        </AdminAuthContextProvider>
      ) : (
        <AuthContextProvider>
          <UserRoute />
        </AuthContextProvider>
      )}
    </>
  );
}

export default App;
