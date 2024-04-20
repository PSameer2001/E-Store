import React, { useState } from "react";
import Loader from "../components/Loader";
import "../css/EmailVerify.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const EmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const SendVerificationLink = async () => {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email === "") {
      toast.warn("Please Enter Email", {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    } else if (!email.match(validRegex)) {
      toast.warn("Invalid Email", {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    } else {
      try {
        setIsLoading(true);
        const res = await axios.post(`${process.env.SERVER_URL}/sendVerificationLink`, { email });
        let message = res.data.message;

        if (message === "success") {
          toast.success("Verification Link Send Successfully", {
            position: "top-center",
            autoClose: 1000,
            theme: "colored",
          });

          setTimeout(() => {
            setIsLoading(false);
            navigate("/login", { replace: true });
          }, 2000);
        } else if (message === "verified") {
          setIsLoading(false);
          toast.warn("Email Already Verified", {
            position: "top-center",
            autoClose: 1000,
            theme: "colored",
          });
        } else {
          setIsLoading(false);
          toast.error(message, {
            position: "top-center",
            autoClose: 1000,
            theme: "colored",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className="EmailVerif_div">
        <div className="divContainer">
          <h4 className="title">Email Verification</h4>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </span>
            </div>

            <div className="mb-2">
              <button
                type="button"
                id="verify_btn"
                className="form-control"
                disabled={isLoading}
                onClick={SendVerificationLink}
              >
                {isLoading ? <Loader /> : "Send Link"}
              </button>
              <span className="back_login" style={{ textAlign: "center" }}>
                <Link to="/login">Back to Login</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmailVerification;
