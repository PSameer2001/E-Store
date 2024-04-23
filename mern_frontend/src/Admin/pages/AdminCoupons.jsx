import { useState, useEffect } from "react";
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
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Loader from "../component/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { ButtonGroup } from "@mui/material";

const AdminCoupons = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { id: "name", label: "Name" },
    { id: "min_amount", label: "Minimum Amount" },
    { id: "coupon_amount", label: "Coupon Amount" },
  ];

  const [rows, setRows] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [open, setOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleShow = () => setOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const handleEditShow = () => setEditOpen(true);

  const [loading, setIsLoading] = useState(false);

  const [coupondata, setCoupondata] = useState({
    name: "",
    min_amount: "",
    coupon_amount: "",
  });
  const [editcoupondata, setEditCoupondata] = useState({
    name: "",
    min_amount: "",
    coupon_amount: "",
    editId: "",
  });

  const handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setCoupondata({ ...coupondata, [name]: value });
  };

  const handleEditInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setEditCoupondata({ ...editcoupondata, [name]: value });
  };

  const getallCouponData = async () => {
    const res = await axios.get(`/api/getallCouponData`);
    const data = res.data;
    setRows(data);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const res = await axios.post(`/api/addCoupon`, coupondata);
      let message = res.data.message;

      if (message === "success") {
        setIsLoading(false);
        getallCouponData();
        setCoupondata({
          name: "",
          min_amount: "",
          coupon_amount: "",
        });
        handleClose();
        toast.success("Added Successful", { duration: 1500 });
      }else{
        setIsLoading(false);
        toast.error(message, { duration: 1500 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handledeleteCoupon = async (id) => {
    try {
      const res = await axios.post(`/api/deleteCoupon`, { id });

      const data = await res.data.message;
      if (data === "success") {
        toast.success("Deleted Successful", { duration: 1000 });
        getallCouponData();
      } else {
        toast.error(data, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openEditModal = (id) => {
    const data = rows.filter((row) => row.id === id);
    setEditCoupondata({
      ...editcoupondata,
      name: data[0].name,
      min_amount: data[0].min_amount,
      coupon_amount: data[0].coupon_amount,
      editId: id,
    });

    handleEditShow();
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios.post(`/api/editCoupon`, editcoupondata);
      let message = res.data.message;

      if (message === "success") {
        setIsLoading(false);
        getallCouponData();
        handleEditClose();
        toast.success("Edited Successful", { duration: 1500 });
      }else{
        setIsLoading(false);
        toast.error(message, { duration: 1500 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getallCouponData();
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
      <div className="admincoupon_div">
        <Paper
          sx={{
            width: "90%",
            overflow: "hidden",
            marginTop: "5rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {/* Add Coupon */}
          <Button
            variant="primary"
            onClick={handleShow}
            style={{ backgroundColor: "#1976d2", color: "#fff" }}
          >
            Add Coupon
          </Button>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <h4>Add Coupon</h4>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="exampleFormControlInput3">
                    Name of Coupon
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="exampleFormControlInput3"
                    min={0}
                    value={coupondata.name}
                    onChange={handleInputs}
                    required
                  />
                </div>
                <br />

                <div className="form-group">
                  <label htmlFor="exampleFormControlInput1">
                    Minimum Amount to Spend
                  </label>
                  <input
                    type="number"
                    name="min_amount"
                    className="form-control"
                    id="exampleFormControlInput1"
                    min={0}
                    value={coupondata.min_amount}
                    onChange={handleInputs}
                    required
                  />
                </div>
                <br />

                <div className="form-group">
                  <label htmlFor="exampleFormControlInput2">
                    Coupon Amount
                  </label>
                  <input
                    type="number"
                    name="coupon_amount"
                    className="form-control"
                    id="exampleFormControlInput2"
                    min={0}
                    value={coupondata.coupon_amount}
                    onChange={handleInputs}
                    required
                  />
                </div>
                <br />

                <Button
                  type="submit"
                  style={{ backgroundColor: "#1976d2", color: "#fff" }}
                  disabled={loading}
                >
                  {loading ? <Loader /> : "Add"}
                </Button>
              </form>
            </Box>
          </Modal>

          {/* Edit Modal */}
          <Modal
            open={editopen}
            onClose={handleEditClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <h4>Edit Coupon</h4>
              <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                  <label htmlFor="exampleFormControlInput4">Name of Coupon</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="exampleFormControlInput4"
                    min={0}
                    value={editcoupondata.name}
                    onChange={handleEditInputs}
                    required
                  />
                </div>
                <br />

                <div className="form-group">
                  <label htmlFor="exampleFormControlInput5">Minimum Amount to Spend</label>
                  <input
                    type="number"
                    name="min_amount"
                    className="form-control"
                    id="exampleFormControlInput5"
                    min={0}
                    value={editcoupondata.min_amount}
                    onChange={handleEditInputs}
                    required
                  />
                </div>
                <br />

                <div className="form-group">
                  <label htmlFor="exampleFormControlInput6">Coupon Amount</label>
                  <input
                    type="number"
                    name="coupon_amount"
                    className="form-control"
                    id="exampleFormControlInput6"
                    min={0}
                    value={editcoupondata.coupon_amount}
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

          {/* User Data */}
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
                            <Button
                              onClick={() => {
                                const confirmBox = window.confirm(
                                  "Do you really want to delete ?"
                                );
                                if (confirmBox === true) {
                                  handledeleteCoupon(row.id);
                                }
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>

                            <Button onClick={() => openEditModal(row.id)}>
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                          </ButtonGroup>
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.min_amount}</TableCell>
                        <TableCell>{row.coupon_amount}</TableCell>
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

export default AdminCoupons;
