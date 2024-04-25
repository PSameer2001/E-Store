/* eslint-disable */
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import "../css/Admin.css";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Image from "react-bootstrap/Image";
import getAdminCookie from "../AdminAuth/getAdminCookie";

const AdminOrderDetails = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { order_id } = useParams();
  const adminHeaders = getAdminCookie();

  const columns = [
    { id: "id", label: "Product Id" },
    { id: "quantity", label: "Quantity" },
    { id: "name", label: "Name" },
    { id: "brand", label: "Brand" },
    { id: "price", label: "Price" },
    { id: "category", label: "Category" },
  ];

  const [rows, setRows] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getOrderProducts = async (orderid) => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/getOrderProducts/${orderid}`,adminHeaders);
    const productdata = res.data;
    setRows(productdata);
  };

  const [orders, setOrders] = useState({});
  const getOrders = async (orderid) => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/getOrders/${orderid}`,adminHeaders);
    const orderdata = res.data;
    setOrders(orderdata);
  };

  useEffect(() => {
    getOrderProducts(order_id);
    getOrders(order_id);
  }, [order_id]);

  return (
    <>
      <div className="adminorder_detail_div">
        <Paper
          sx={{
            width: "90%",
            overflow: "hidden",
            marginTop: "5rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Link to={`/admin/orders`} className="return">
            Return
          </Link>

          <span style={{marginLeft:"5px", fontWeight:"bold"}}>Order Id : #{orders.id}</span>

          {/* Orders Details Data */}
          <TableContainer sx={{ maxHeight: 550 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="img" align="left">
                    Image
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell key={`img${row.id}`} >
                        <Image
                          src={`${process.env.PUBLIC_URL}/products/${row.image_src}`}
                          alt={row.name}
                          style={{ width: "3rem", height: "3rem" }}
                          rounded
                        />
                        </TableCell>

                        {columns.map((column) => {
                          const value = String(row[column.id]);
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </>
  );
};

export default AdminOrderDetails;
