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
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTasks } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Loader from "../component/Loader";
import Box from "@mui/material/Box";
import { ButtonGroup } from "@mui/material";
import toast from "react-hot-toast";
import getAdminCookie from "../AdminAuth/getAdminCookie";

const AdminOrders = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const adminHeaders = getAdminCookie();

  const columns = [
    { id: "id", label: "Order Id" },
    { id: "product_count", label: "Product Count" },
    { id: "total_quantity", label: "Total Quantity" },
    { id: "finalAmount", label: "Total Amount" },
    { id: "paymentStatus", label: "Payment Status" },
    { id: "deliveryStatus", label: "Delivery Status" },
    { id: "coupon_name", label: "Coupon Name" },
    { id: "coupon_amount", label: "Coupon Amount" },
    { id: "min_amount", label: "Coupon Min Amount" },
    { id: "shippingAmount", label: "Shipping Amount" },
    { id: "shippingAddress", label: "Shipping Address" },
    { id: "ContactNo", label: "Contact No" },
    { id: "deliveryOtp", label: "Delivery OTP" },
    { id: "razorpay_order_id", label: "razorpay order id" },
    { id: "razorpay_payment_id", label: "razorpay payment id" },
  ];

  const [rows, setRows] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getAllOrders = async () => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/getAllOrders`,adminHeaders);
    const data = res.data;
    setRows(data);
  };

  const [editopen, setEditOpen] = useState(false);
  const handleEditClose = () => setEditOpen(false);
  const handleEditShow = () => setEditOpen(true);

  const [editdata, seteditData] = useState({
    shippingAddress: "",
    ContactNo: "",
    expectedDelivery: "",
    nextdate: "",
    deliveryStatus: "",
    editId: "",
  });

  const handleEditInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    seteditData({ ...editdata, [name]: value });
  };

  const openEditModal = (id) => {
    const data = rows.filter((row) => row.id === id);

    const date = new Date(data[0].expectedDelivery.nextdate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    seteditData({
      ...editdata,
      shippingAddress: data[0].shippingAddress,
      ContactNo: data[0].ContactNo,
      expectedDelivery: data[0].expectedDelivery,
      nextdate: formattedDate,
      deliveryStatus: data[0].deliveryStatus,
      editId: id,
    });

    handleEditShow();
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/editOrder`, editdata,adminHeaders);
      let message = res.data.message;

      if (message === "success") {
        setIsLoading(false);
        getAllOrders();
        handleEditClose();
        seteditData({
          ...editdata,
          shippingAddress: "",
          ContactNo: "",
          nextdate: "",
          deliveryStatus: "",
          expectedDelivery: "",
          editId: "",
        });
        toast.success("Edited Successful", { duration: 1500 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
    height: "80%",
  };

  return (
    <>
      <div className="adminorder_div">
        <Paper
          sx={{
            width: "90%",
            overflow: "hidden",
            marginTop: "5rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {/* Edit Modal */}
          <Modal
            open={editopen}
            onClose={handleEditClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <h4>Edit Orders</h4>
              <form encType="multipart/form-data" onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect1">
                    Delivery Status
                  </label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect1"
                    name="deliveryStatus"
                    value={editdata.deliveryStatus}
                    onChange={handleEditInputs}
                  >
                    <option value="">Select</option>
                    <option key="Not Delivered" value="Not Delivered">
                      Not Delivered
                    </option>
                    <option key="Dispatch" value="Dispatch">
                      Dispatch
                    </option>
                    <option key="Out for Delievery" value="Out for Delievery">
                      Out for Delievery
                    </option>
                    <option key="Delivered" value="Delivered">
                      Delivered
                    </option>
                  </select>
                </div>
                <br />

                <div className="form-group">
                  <label htmlFor="exampleFormControlInput1">
                    Delivery Extend Date
                  </label>
                  <input
                    type="date"
                    name="nextdate"
                    className="form-control"
                    id="exampleFormControlInput1"
                    value={editdata.nextdate}
                    onChange={handleEditInputs}
                    required
                  />
                </div>
                <br />

                <div className="form-group">
                  <label htmlFor="exampleFormControlTextarea1">
                    Shipping Address
                  </label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    name="shippingAddress"
                    style={{ resize: false }}
                    value={editdata.shippingAddress}
                    onChange={handleEditInputs}
                    required
                  ></textarea>
                </div>
                <br />

                <div className="form-group">
                  <label htmlFor="exampleFormControlInput3">Contact No</label>
                  <input
                    type="number"
                    className="form-control"
                    name="ContactNo"
                    id="exampleFormControlInput3"
                    min={0}
                    maxLength={10}
                    value={editdata.ContactNo}
                    onChange={handleEditInputs}
                    required
                  />
                </div>
                <br />

                <Button
                  type="submit"
                  style={{ backgroundColor: "#1976d2", color: "#fff" }}
                  disabled={loading}
                >
                  {loading ? <Loader /> : "Edit"}
                </Button>
              </form>
            </Box>
          </Modal>

          {/* Orders Data */}
          <TableContainer sx={{ maxHeight: 550 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="operation" align="left">
                    Operation
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
                  <TableCell key="createdAt">Created At</TableCell>
                  <TableCell key="expectedDelivery">
                    Expected Delivery
                  </TableCell>
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
                        <TableCell key="operation" align="left">
                          <ButtonGroup
                            variant="outlined"
                            aria-label="Basic button group"
                          >
                            <Link to={`/admin/order_details/${row.id}`}>
                              <Button>
                                <FontAwesomeIcon icon={faTasks} />
                              </Button>
                            </Link>

                            <Button onClick={() => openEditModal(row.id)}>
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                          </ButtonGroup>
                        </TableCell>

                        {columns.map((column) => {
                          const value = String(row[column.id]);
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value}
                            </TableCell>
                          );
                        })}

                        <TableCell key="createdAt">{row.createdAt}</TableCell>
                        <TableCell key="expectedDelivery">
                          {row.expectedDelivery.todaydate} -{" "}
                          {row.expectedDelivery.nextdate}
                        </TableCell>
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

export default AdminOrders;
