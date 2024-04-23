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

const AdminSection = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { id: "category_id", label: "Category" },
    { id: "sequence", label: "Sequence" },
    { id: "type", label: "Type" },
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

  const [sectiondata, setSectiondata] = useState({
    category_id: "",
    sequence: "",
    type: "",
  });
  const [editsectiondata, setEditSectiondata] = useState({
    category_id: "",
    sequence: "",
    type: "",
    editId: ""
  });

  const handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setSectiondata({ ...sectiondata, [name]: value });
  };

  const handleEditInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setEditSectiondata({ ...editsectiondata, [name]: value });
  };

  const getallSectionData = async () => {
    const res = await axios.get(`/api/getallSectionData`);
    const data = res.data;
    setRows(data);
  };

  const [category, setCategory] = useState([]);
  const getallCategoryData = async () => {
    const res = await axios.get(`/api/getallCategoryData`);
    const data = res.data;
    setCategory(data);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const res = await axios.post(`/api/addSection`, sectiondata);
      let message = res.data.message;

      if (message === "success") {
        setIsLoading(false);
        getallCategoryData();
        getallSectionData();
        setSectiondata({
          category_id: "",
          sequence: "",
          type: "",
        });
        handleClose();
        toast.success("Added Successful", { duration: 1500 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handledeleteSection = async (id) => {
    try {
      const res = await axios.post(`/api/deleteSection`, { id });

      const data = await res.data.message;
      if (data === "success") {
        toast.success("Deleted Successful", { duration: 1000 });
        getallCategoryData();
        getallSectionData();
      } else {
        toast.error(data, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openEditModal = (id) => {
    const data = rows.filter((row) => row.id === id);
    setEditSectiondata({
      ...editsectiondata,
      category_id: data[0].category_id,
      sequence: data[0].sequence,
      type: data[0].type,
      editId: id,
    });

    handleEditShow();
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios.post(`/api/editSection`, editsectiondata);
      let message = res.data.message;

      if (message === "success") {
        setIsLoading(false);
        getallCategoryData();
        getallSectionData();
        handleEditClose();
        toast.success("Edited Successful", { duration: 1500 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getallCategoryData();
    getallSectionData();
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
      <div className="adminsection_div">
        <Paper
          sx={{
            width: "90%",
            overflow: "hidden",
            marginTop: "5rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {/* Add Section */}
          <Button
            variant="primary"
            onClick={handleShow}
            style={{ backgroundColor: "#1976d2", color: "#fff" }}
          >
            Add Section
          </Button>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <h4>Add Section</h4>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect1">Category</label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect1"
                    name="category_id"
                    value={sectiondata.category_id}
                    onChange={handleInputs}
                    required
                  >
                    <option value="">Select</option>
                    {category.map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <br />

                <div className="form-group">
                  <label htmlFor="exampleFormControlInput1">Sequence</label>
                  <input
                    type="number"
                    name="sequence"
                    className="form-control"
                    id="exampleFormControlInput1"
                    min={0}
                    value={sectiondata.sequence}
                    onChange={handleInputs}
                    required
                  />
                </div>
                <br />

                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect2">Type</label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect2"
                    name="type"
                    value={sectiondata.type}
                    onChange={handleInputs}
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">Swiper</option>
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

          {/* Edit Modal */}
          <Modal
            open={editopen}
            onClose={handleEditClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <h4>Edit Section</h4>
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect3">Category</label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect3"
                    name="category_id"
                    value={editsectiondata.category_id}
                    onChange={handleEditInputs}
                    required
                  >
                    <option value="">Select</option>
                    {category.map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <br />

                <div className="form-group">
                  <label htmlFor="exampleFormControlInput3">Sequence</label>
                  <input
                    type="number"
                    name="sequence"
                    className="form-control"
                    id="exampleFormControlInput3"
                    min={0}
                    value={editsectiondata.sequence}
                    onChange={handleEditInputs}
                    required
                  />
                </div>
                <br />

                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect4">Type</label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect4"
                    name="type"
                    value={editsectiondata.type}
                    onChange={handleEditInputs}
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">Swiper</option>
                  </select>
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
                    var category_name = category.filter(
                      (cat) => cat.id === row.category_id
                    )[0];

                    var type;
                    if (row.type === "1") {
                      type = "Swiper";
                    } else {
                      type = "";
                    }
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
                                  handledeleteSection(row.id);
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
                        <TableCell>{category_name && category_name.name}</TableCell>
                        <TableCell>{row.sequence}</TableCell>
                        <TableCell>{type}</TableCell>
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

export default AdminSection;
