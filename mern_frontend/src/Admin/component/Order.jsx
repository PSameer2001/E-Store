import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";

export default function Orders() {
  const [rows, setRows] = useState([]);

  const getRecentOrders = async () => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getRecentOrders`);
    const data = res.data;
    setRows(data);
  };

  useEffect(() => {
    getRecentOrders();
  }, []);

  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
            <TableCell>Delivery Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <Tooltip title={row.shippingAddress} placement="right">
                  {row.shippingAddress.slice(0, 15)}
                </Tooltip>
              </TableCell>
              <TableCell>{row.ContactNo}</TableCell>
              <TableCell align="right">{`Rs ${row.finalAmount}`}</TableCell>
              <TableCell>{row.deliveryStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link to="/admin/orders" sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
