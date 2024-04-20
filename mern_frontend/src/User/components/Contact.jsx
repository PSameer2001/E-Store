import React, { useEffect, useState } from "react";
import callsuport from "./images/callsuport.png";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "./Loader";

const Contact = (props) => {
  var user = props.user;
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ticket, setIsTicket] = useState(false);

  const getactiveTicketData = async (email) => {
    const res = await axios.get(`/getactiveTicketData/` ,{
      params : {
        email: email
      }
    });
    const data = res.data.message;
    setIsTicket(data);
  };

  const ContactSubmit = async (e) => {
    e.preventDefault();

    try {
      if(ticket){
        toast.error("Ticket Already Created", { duration: 1500 });
        return false;
      }

      setIsLoading(true);
      const res = await axios.post(`/createTicket`, {
        email: user.email,
        message,
        subject,
      });
      let resdata = res.data.message;

      if (resdata === "success") {
        setIsLoading(false);
        toast.success("Ticket Created", { duration: 1500 });
        setSubject("");
        setMessage("");
        getactiveTicketData(user.email);
      } else {
        setIsLoading(false);
        toast.error(resdata, {
          duration: 1500,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getactiveTicketData(user.email);
  }, [user])
  

  return (
    <>
      <div className="heading">
        <h1>Contact Us </h1>
        <p>Feel free to contact us</p>
      </div>

      <div className="row">
        <div className="image">
          <img src={callsuport} alt="" />
        </div>

        <form onSubmit={ContactSubmit}>
          <div className="inputBox">
            <input
              type="text"
              placeholder={user.name}
              name="username"
              readOnly
            />
            <input
              type="email"
              placeholder={user.email}
              name="email"
              readOnly
            />
          </div>

          <div className="inputBox">
            <input
              type="text"
              name="contact"
              placeholder={user.phone}
            readOnly
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <textarea
            placeholder="Message"
            name="message"
            id="message"
            cols="30"
            rows="10"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <button type="submit" className="btn" >{isLoading ? <Loader /> : "Send Message"}</button>
        </form>
      </div>
    </>
  );
};

export default Contact;
