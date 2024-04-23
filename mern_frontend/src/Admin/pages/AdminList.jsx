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
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Loader from "../component/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { ButtonGroup } from "@mui/material";

export default function AdminList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "address", label: "Address" },
    { id: "phone", label: "Phone" },
    { id: "password", label: "Password" },
    { id: "cpassword", label: "CPassword" },
    { id: "isAdmin", label: "isAdmin" },
    { id: "isSuperAdmin", label: "isSuperAdmin" },
    { id: "verified", label: "Verified" },
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

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [edituser, setEditUser] = useState({
    editname: "",
    editemail: "",
    editpassword: "",
    editId:"",
  });

  const handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const handleEditInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setEditUser({ ...edituser, [name]: value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, password } = user;
    try {
      setIsLoading(true);
      const res = await axios.post(`/api/addAdmin`, {
        name,
        email,
        password,
      });

      const data = await res.data.message;
      if (data === "success") {
        toast.success("Added Successful", { duration: 1000 });
        setIsLoading(false);
        navigate("/admin/allAdmin");
        getallAdminData();
        handleClose();
        setUser({
          name: "",
          email: "",
          password: "",
        });
      } else {
        setIsLoading(false);
        toast.error(data, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handledeleteAdmin = async (id) => {
    try {
      const res = await axios.post(`/api/deleteAdmin`, { id });

      const data = await res.data.message;
      if (data === "success") {
        toast.success("Deleted Successful", { duration: 1000 });
        getallAdminData();
        setUser({
          name: "",
          email: "",
          password: "",
        });
      } else {
        toast.error(data, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getallAdminData = async () => {
    const res = await axios.get(`/api/getallAdminData`);
    const data = res.data;
    setRows(data);
  };

  const openEditModal = (id) => {
    const data = rows.filter((row) => row.id === id);
    setEditUser({
      ...edituser,
      editname: data[0].name,
      editemail: data[0].email,
      editpassword: data[0].cpassword,
      editId: id
    });
   
    handleEditShow();
  
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
      const { editname:name, editemail:email, editpassword:password, editId } = edituser;
      
      try {
        setIsLoading(true);
        const res = await axios.post(`/api/editAdmin`, {
          name,
          email,
          password,
          editId
        });

        const data = await res.data.message;
        if (data === "success") {
          toast.success("Edited Successful", { duration: 1000 });
          setIsLoading(false);
          navigate("/admin/allAdmin");
          getallAdminData();
          handleEditClose();
          setEditUser({
            editname: "",
            editemail: "",
            editpassword: "",
            editId:""
          });
        } else {
          setIsLoading(false);
          toast.error(data, { duration: 1000 });
        }
      } catch (error) {
        console.log(error);
      }
  };

  useEffect(() => {
    getallAdminData();
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
    overflow:"auto",
    height: "80%"
  };

  return (
    <div className="adminuser_div">
      <Paper
        sx={{
          width: "90%",
          overflow: "hidden",
          marginTop: "5rem",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* Add User */}
        <Button
          variant="primary"
          onClick={handleShow}
          style={{ backgroundColor: "#1976d2", color: "#fff" }}
        >
          Add Admin
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h4>Add Admin</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleInputs}
                  required
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput2"
              >
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  value={user.email}
                  onChange={handleInputs}
                  required
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleInputs}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                style={{ backgroundColor: "#1976d2", color: "#fff" }}
                disabled={loading}
              >
                {loading ? <Loader /> : "Add"}
              </Button>
            </Form>
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
            <h4>Edit Admin</h4>
            <Form onSubmit={handleEditSubmit}>
              <input type="hidden" name="editId"  value={edituser.editId}  onChange={handleEditInputs} />
              <Form.Group
                className="mb-3"
              >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="editname"
                  value={edituser.editname}
                  onChange={handleEditInputs}
                  required
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
              >
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  name="editemail"
                  value={edituser.editemail}
                  onChange={handleEditInputs}
                  required
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
              >
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="text"
                  name="editpassword"
                  value={edituser.editpassword}
                  onChange={handleEditInputs}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                style={{ backgroundColor: "#1976d2", color: "#fff" }}
                disabled={loading}
              >
                {loading ? <Loader /> : "Edit"}
              </Button>
            </Form>
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
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
                                handledeleteAdmin(row.id);
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
  );
}
