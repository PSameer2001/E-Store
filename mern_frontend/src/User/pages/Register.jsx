import React, { useState } from "react";
import "../css/Register.css";
import {  Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSignup } from "../Hooks/useSignUp";
import Loader from "../components/Loader";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const { signup } = useSignup();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const RegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const { name, email, password, cpassword } = user;

      const res = await signup(name, email, password, cpassword);
      if (res === "success") {
        toast.success("Register Successful", { duration: 1000 });
        toast.success("Email Verification Sent", { duration: 1000 });
        setIsLoading(false);
        navigate("/login");
      } else {
        setIsLoading(false);
        toast.error(res, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="RegisterDiv">
        <div className="divContainer">
          <h4 className="title">SIGN UP</h4>
          <form method="POST">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={user.name}
                onChange={handleInputs}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="name@example.com"
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
            <div className="mb-3">
              <label htmlFor="cpassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="cpassword"
                name="cpassword"
                value={user.cpassword}
                onChange={handleInputs}
                required
              />
            </div>
            <div className="mb-2">
              <button
                type="submit"
                id="register_btn"
                className="form-control"
                onClick={RegisterSubmit}
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : "Sign Up"}
              </button>
            </div>
            <div>
              <span>
                Already Have an Account ? <Link to="/login">Login</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
