import { faEdit } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import Loader from "../component/Loader";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import "../css/Admin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { ButtonGroup } from "@mui/material";
import toast from "react-hot-toast";

const AdminSupport = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [status, setStatus] = useState({
    editId: "",
    editStatus: "",
  });

  const columns = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "status", label: "Status" },
    { id: "subject", label: "Subject" },
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

  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleShow = () => setOpen(true);

  const openEditModal = (id) => {
    const data = rows.filter((row) => row.id === id);
    setStatus({
      ...status,
      editStatus: data[0].status,
      editId: id,
    });

    handleShow();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post(`/api/updateTicketStatus`, {
        editId: status.editId,
        editStatus: status.editStatus
      });
      let message = res.data.message;

      if (message === "success") {
        setIsLoading(false);
        getallTicketData();
        handleClose();
        toast.success("Updated Successful", { duration: 1500 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getallTicketData = async () => {
    const res = await axios.get(`/api/getallTicketData`);
    const data = res.data;
    setRows(data);
  };

  useEffect(() => {
    getallTicketData();
  }, []);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
    height: "50%",
  };
  return (
    <>
      <div className="admincontact_div">
        <Paper
          sx={{
            width: "90%",
            overflow: "hidden",
            marginTop: "5rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <h4>Update Status</h4>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="exampleFormControlInput3">
                    Select Status
                  </label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect1"
                    name="status"
                    value={status.editStatus}
                    onChange={(e) => setStatus({...status, editStatus:e.target.value})}
                    required
                  >
                    <option value="">Select</option>
                    <option value="0">Not Resolved</option>
                    <option value="1">Resolved</option>
                  </select>
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
                  <TableCell key="content">Content</TableCell>
                  <TableCell key="createdAt">Created At</TableCell>
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
                         <TableCell key={`cont${row.id}`}>
                              {row.content[0].content}
                            </TableCell>
                            <TableCell key={`creat${row.id}`}>
                              {row.createdAt}
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

export default AdminSupport;
