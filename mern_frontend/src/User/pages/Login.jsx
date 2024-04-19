import React, { useState } from "react";
import "../css/Login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { useSignIn } from "../Hooks/useSignIn";
// import { useAuthContext } from "../Auth/useAuthContext";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { signin } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.path || "/";

  const handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const LoginSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const { email, password } = user;

      const res = await signin(email, password);
      if (res === "success") {
        toast.success("Login Successful", { duration: 1500 });

        setIsLoading(false);
        navigate(redirectPath, { replace: true });
      } else {
        setIsLoading(false);
        toast.error(res, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const authUser = useAuthContext();

  // useEffect(() => {
  //   if(authUser.state.name){
  //     navigate('/')
  //   }
  // }, [])

  return (
    <>
      <div className="LoginDiv">
        <div className="divContainer">
          <h4 className="title">SIGN IN</h4>

          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={user.name}
                onChange={handleInputs}
                placeholder="name@example.com"
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
            <div>
              <span>
                Don't Have an Account ? <Link to="/register">Register</Link>
              </span>
              <span className="forget_pass">
                <Link to="/forget_password">Forgot Password ?</Link>
              </span>
            </div>
            <br />
            <div>
              <span className="email_verification">
                Email Not Verified ?{" "}
                <Link to="/email_verification">Send a Verification Link</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
