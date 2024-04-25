/* eslint-disable */
import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import "../css/myOrder.css";
import axios from "axios";
import { Link } from "react-router-dom";
import getUserCookie from "../Auth/getUserCookie";

const MyOrder = (props) => {
  const authUser = props.authUser;
  const user = authUser.state;
const userHeaders = getUserCookie();
  const [allorders, setAllOrders] = useState([]);

  const getAllUserOrders = async (email) => {
    const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/getAllUserOrders`, { email },userHeaders);
    const data = res.data;
    setAllOrders(data);
  };

  useEffect(() => {
    getAllUserOrders(user.email);
  }, [user]);

  return (
    <div className="myorder">
      <div className="title">
        <h2 className="font-weight-bold">My Order</h2>
        <hr />
      </div>

      {allorders.length !== 0 ? (
        <div className="content">
          <ListGroup as="ul">
            {allorders.map((order) => {
              const timestamp = order.createdAt;
              const date = new Date(timestamp);
              
              const options = { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              };
              
              const formattedDate = date.toLocaleDateString('en-US', options).replace(',', '');
              return (
                <ListGroup.Item key={order.id}
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">OrderId : #{order.id}</div>
                    Total Product : {order.product_count} <br />
                    Total Quantity : {order.total_quantity} <br />
                    Total Paid : Rs {new Intl.NumberFormat().format(order.total_amount)}
                  </div>
                  <div className="right_content">
                    <Link to={`/myorder/${order.id}`}>View Order</Link><br />
                    Delivery Status : {order.deliveryStatus}<br />
                    Payment Status : {order.paymentStatus}<br />
                    Order On : {formattedDate}
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      ) : (
        <div className="no_content">
          <h3 className="font-weight-bold">No Order Placed</h3>
        </div>
      )}
    </div>
  );
};

export default MyOrder;
