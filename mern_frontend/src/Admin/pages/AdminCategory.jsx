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
import Loader from "../component/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { ButtonGroup, Tooltip } from "@mui/material";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import LayersIcon from "@mui/icons-material/Layers";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imageDB } from "../../config/firebase_config";
import getAdminCookie from "../AdminAuth/getAdminCookie";

const AdminCategory = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
const adminHeaders = getAdminCookie();

  const columns = [
    { id: "name", label: "Name" },
    { id: "imageUrl", label: "ImageUrl" },
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
  const [imageopen, setImageOpen] = useState(false);
  const [imagedisplay, setImageDisplay] = useState("");

  const handleImageClose = () => setImageOpen(false);
  const handleImageShow = () => setImageOpen(true);
  const handleClose = () => setOpen(false);
  const handleShow = () => setOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const handleEditShow = () => setEditOpen(true);

  const handleImageDisplay = (img) => {
    setImageDisplay(img);
    handleImageShow();
  };

  const [loading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [imageUrl, setimageUrl] = useState();

  const [editdata, seteditData] = useState({
    editname: "",
    editId: "",
  });
  const [editimageUrl, seteditimageUrl] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const allowedType = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

      if (!allowedType.includes(imageUrl?.type)) {
        toast.error("Only JPG, PNG and PNG file type are allowed", {
          duration: 1500,
        });
        return false;
      }

      setIsLoading(true);
      const imageRef = ref(imageDB, `/category/${imageUrl.name}`);
      uploadBytes(imageRef, imageUrl).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          const res = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/api/addCategory`,
            {
              name: name,
              imageUrl: url,
            },adminHeaders
          );
          let message = res.data.message;

          if (message === "success") {
            setIsLoading(false);
            getallCategoryData();
            handleClose();
            toast.success("Added Successful", { duration: 1500 });
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handledeleteCategory = async (id) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/deleteCategory`,
        { id },adminHeaders
      );

      const data = await res.data.message;
      if (data === "success") {
        toast.success("Deleted Successful", { duration: 1000 });
        getallCategoryData();
      } else {
        toast.error(data, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getallCategoryData = async (adminHeaders) => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/api/getallCategoryData`,adminHeaders
    );
    const data = res.data;
    setRows(data);
  };

  const openEditModal = (id) => {
    const data = rows.filter((row) => row.id === id);
    seteditData({
      ...editdata,
      editname: data[0].name,
      editId: id,
    });

    handleEditShow();
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    try {
      const { editname: name, editId } = editdata;

      if (editimageUrl !== null && editimageUrl !== "" && editimageUrl) {
        const allowedType = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
        ];

        if (!allowedType.includes(editimageUrl?.type)) {
          toast.error("Only JPG, PNG and PNG file type are allowed", {
            duration: 1500,
          });
          return false;
        }
      }

      setIsLoading(true);
      if (editimageUrl) {
        const imageRef = ref(imageDB, `/category/${editimageUrl.name}`);
        uploadBytes(imageRef, editimageUrl).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            const res = await axios.post(
              `${process.env.REACT_APP_SERVER_URL}/api/editCategory`,
              {
                imageUrl: url,
                name: name,
                editId: editId,
              },adminHeaders
            );

            var message = res.data.message;
            if (message === "success") {
              setIsLoading(false);
              getallCategoryData();
              handleEditClose();
              seteditData({
                editname: "",
                editId: "",
              });
              toast.success("Edited Successful", { duration: 1500 });
            }
          });
        });
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/editCategory`,
          {
            name: name,
            editId: editId,
          },adminHeaders
        );

        var message = res.data.message;
        if (message === "success") {
          setIsLoading(false);
          getallCategoryData();
          handleEditClose();
          seteditData({
            editname: "",
            editId: "",
          });
          toast.success("Edited Successful", { duration: 1500 });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getallCategoryData(adminHeaders);
  }, [adminHeaders]);

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
    <div className="admincategory_div">
      <Paper
        sx={{
          width: "90%",
          overflow: "hidden",
          marginTop: "5rem",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* Add Category */}
        <Button
          variant="primary"
          onClick={handleShow}
          style={{ backgroundColor: "#1976d2", color: "#fff" }}
        >
          Add Category
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h4>Add Category</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput2"
              >
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={(e) => setimageUrl(e.target.files[0])}
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
            <h4>Edit Category</h4>
            <Form onSubmit={handleEditSubmit}>
              <input type="hidden" name="editId" value={editdata.editId} />
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="editname"
                  value={editdata.editname}
                  onChange={(e) =>
                    seteditData({ ...editdata, editname: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput2"
              >
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={(e) => seteditimageUrl(e.target.files[0])}
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

        <Modal
          open={imageopen}
          onClose={handleImageClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h4>Image</h4>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Image
                src={`${imagedisplay}`}
                alt="Category"
                style={{ width: "20rem", height: "20rem" }}
                rounded
              />
            </div>
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
                <TableCell key="image" align="center">
                  Image
                </TableCell>
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
                                handledeleteCategory(row.id);
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>

                          <Button onClick={() => openEditModal(row.id)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>

                          <Tooltip title="Products">
                            <Link to={`/admin/products/${row.id}`}>
                              <Button>
                                <LayersIcon />
                              </Button>
                            </Link>
                          </Tooltip>
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
                      <TableCell key="image" align="center">
                        <Image
                          onClick={() => handleImageDisplay(row["imageUrl"])}
                          src={`${row["imageUrl"]}`}
                          alt="Category"
                          style={{ width: "3rem", height: "3rem" }}
                          rounded
                        />
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
  );
};

export default AdminCategory;
