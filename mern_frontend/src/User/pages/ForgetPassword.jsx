import React, { useState } from "react";
import Loader from "../components/Loader";
import "../css/ForgetPass.css";
import toast from "react-hot-toast";
import { useSendOTP } from "../Hooks/useSendOTP";
import { useForgotPassword } from "../Hooks/useForgotPassword";
import { Link, useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSendOtp, setIsSendOtp] = useState(false);
  const [isExpireOtp, setIsExpireOtp] = useState(true);
  const [isExpiretime, setIsExpiretime] = useState(150);
  const [timer, setTimer] = useState(30);
  const [user, setUser] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const navigate = useNavigate();

  const { sendotp } = useSendOTP();
  const { forgetPassword } = useForgotPassword();

  const handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const SendOTP = async () => {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (user.email === "") {
      toast.error("Please Enter Email", { duration: 1000 });
    } else if (!user.email.match(validRegex)) {
      toast.error("Invalid Email", { duration: 1000 });
    } else {
      const res = await sendotp(user.email);
      if (res === "exists") {
        toast.success("6 Digit OTP sent", { duration: 1500 });
        setIsSendOtp(true);

        const interval = setInterval(() => {
          setTimer((timer) => timer - 1);
        }, 1000);

        setTimeout(() => {
          setTimer(30);
          clearInterval(interval);
          setIsSendOtp(false);
        }, 30000);

        setIsExpiretime(150);
        setIsExpireOtp(false);
        const expireInterval = setInterval(() => {
          setIsExpiretime((isExpiretime) => isExpiretime - 1);
        }, 1000);

        setTimeout(() => {
          setIsExpiretime(150);
          clearInterval(expireInterval);
          setIsExpireOtp(true);
        }, 150000);
      } else {
        toast.error(res, { duration: 1000 });
      }
    }
  };

  const handleForgotPassword = async () => {
    try {
      setIsLoading(true);
      const res = await forgetPassword(user.email, user.password, user.otp);

      if (res === "success") {
        toast.success("Password Changed Successful", { duration: 1500 });

        setTimeout(() => {
          setIsLoading(false);
          navigate("/login", { replace: true });
        }, 2000);
      } else {
        setIsLoading(false);
        toast.error(res, { duration: 1000 });
      }
    } catch (error) {
      toast.error(error, { duration: 1000 });
    }
  };

  return (
    <>
      <div className="ForgetDiv">
        <div className="divContainer">
          <h4 className="title">Forget Password</h4>

          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <span className="email_span">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputs}
                  placeholder="name@example.com"
                  required
                />
                {isSendOtp ? (
                  <h6 className="timer">{timer} sec</h6>
                ) : (
                  <span className="otp_btn" onClick={SendOTP}>
                    send OTP
                  </span>
                )}
              </span>
            </div>

            {isExpireOtp ? (
              ""
            ) : (
              <div className="mb-3">
                <label htmlFor="otp" className="form-label">
                  OTP
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="otp"
                  name="otp"
                  value={user.otp}
                  onChange={handleInputs}
                  required
                />
                <h6 className="expire_text">Expires In <span className="otp_btn">{isExpiretime}</span> sec</h6>
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="text"
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
                id="forget_btn"
                className="form-control"
                disabled={isLoading}
                onClick={handleForgotPassword}
              >
                {isLoading ? <Loader /> : "Submit"}
              </button>
              <span className="back_login" style={{textAlign:"center"}}>
              <Link to="/login" >Back to Login</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
