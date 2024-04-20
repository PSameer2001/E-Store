import React, { useEffect, useState } from "react";
import axios from "axios";
import ListGroup from "react-bootstrap/ListGroup";
import "../css/Ticket.css";

const TicketPage = (props) => {
  const authUser = props.authUser;
  const user = authUser.state;

  const [allticket, setAllTicket] = useState([]);

  const getuserTicketData = async (email) => {
    const res = await axios.get(`${process.env.SERVER_URL}/getuserTicketData`, {
      params: {
        email: email,
      },
    });
    const data = res.data;
    setAllTicket(data);
  };

  useEffect(() => {
    getuserTicketData(user.email);
  }, [user]);
  return (
    <>
      <div className="myticket">
        <div className="title">
          <h2 className="font-weight-bold">My Ticket</h2>
          <hr />
        </div>

        {allticket.length !== 0 ? (
          <div className="content">
            <ListGroup as="ul">
              {allticket.map((ticket) => {
                const timestamp = ticket.createdAt;
                const date = new Date(timestamp);

                const options = {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                };

                const formattedDate = date
                  .toLocaleDateString("en-US", options)
                  .replace(",", "");
                return (
                  <ListGroup.Item
                    key={ticket.id}
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">TicketId : #{ticket.id}</div>
                      Subject : {ticket.subject} <br />
                    </div>
                    <div className="right_content">
                      Ticket Status : {ticket.status === "0" ? "Not Resolved" : "Resolved"}
                      <br />
                      Created On : {formattedDate}
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        ) : (
          <div className="no_content">
            <h3 className="font-weight-bold">No Ticket Raised</h3>
          </div>
        )}
      </div>
    </>
  );
};

export default TicketPage;
