import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../User/components/Loader";
import '../css/AdminLogin.css'
import { useAdminSignIn } from "../Hooks/useAdminSignIn";
import toast, { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

const AdminLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({
        email: "",
        password: "",
      });

    const handleInputs = (e) => {
        let name = e.target.name;
        let value = e.target.value;
    
        setUser({ ...user, [name]: value });
      };

      const navigate = useNavigate();

      const { signin } = useAdminSignIn();

      const LoginSubmit = async (e) => {
        e.preventDefault();

    try {
      setIsLoading(true);
      const { email, password } = user;

      const res = await signin(email, password);
      if (res === "success") {
        // toast.success("Login Successful", { duration: 1500 });

        setTimeout(() => {
          setIsLoading(false);
          navigate("/admin", {replace: true});
        }, 2000);
      } else {
        setIsLoading(false);
        toast.error(res, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
      }
  return (
    <>
        <div className="AdminLoginDiv">
          <div className="divContainer">
            <h4 className="title">Admin Login</h4>

            <form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputs}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={handleInputs}
                  required
                />
              </div>
              <div className="mb-2">
                <button
                  type="submit"
                  id="login_btn"
                  className="form-control"
                  onClick={LoginSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader /> : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <Toaster />
        <ToastContainer />
    </>
  );
};

export default AdminLogin;
