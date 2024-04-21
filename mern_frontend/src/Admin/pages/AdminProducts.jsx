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
import { ButtonGroup, Tooltip } from "@mui/material";
import { Link, useParams } from "react-router-dom";

const AdminProducts = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  let { category_id } = useParams();

  const columns = [
    { id: "name", label: "Name" },
    { id: "brand", label: "Brand" },
    { id: "description", label: "Description" },
    { id: "oldprice", label: "Old Price" },
    { id: "price", label: "Price" },
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
  const [category, setCategory] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    oldprice: "",
    category: category_id,
  });
  const [editproduct, setEditProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    oldprice: "",
    category: category_id,
  });

  const handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setProduct({ ...product, [name]: value });
  };

  const handleEditInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setEditProduct({ ...editproduct, [name]: value });
  };

  const [productImage, setProductImage] = useState();

  const getallProductData = async (category_id) => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getallProductData/${category_id}`);
    const data = res.data;
    setRows(data);
  };

  const getallCategoryData = async () => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getallCategoryData`);
    const data = res.data;
    setCategory(data);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const allowedType = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

      var formData = new FormData();
      formData.append("data", JSON.stringify(product));
      for (let file of productImage) {
        if (!allowedType.includes(file?.type)) {
          toast.error("Only JPG, PNG and PNG file type are allowed", {
            duration: 1500,
          });
          return false;
        }
        formData.append("productImage", file);
      }
      // const data = Object.fromEntries(formData.entries());

      setIsLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/addProduct`, formData);
      let message = res.data.message;

      if (message === "success") {
        setIsLoading(false);
        getallCategoryData();
        getallProductData(category_id);
        setProduct({
          name: "",
          brand: "",
          description: "",
          price: "",
          oldprice: "",
          category: category_id,
        });
        handleClose();
        toast.success("Added Successful", { duration: 1500 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handledeleteProduct = async (id) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/deleteProduct`, { id });

      const data = await res.data.message;
      if (data === "success") {
        toast.success("Deleted Successful", { duration: 1000 });
        getallCategoryData();
        getallProductData(category_id);
      } else {
        toast.error(data, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openEditModal = (id) => {
    const data = rows.filter((row) => row.id === id);
    setEditProduct({
      ...editproduct,
      name: data[0].name,
      brand: data[0].brand,
      description: data[0].description,
      price: data[0].price,
      oldprice: data[0].oldprice,
      category: data[0].category,
      editId: id,
    });

    handleEditShow();
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/editProduct`, editproduct);
      let message = res.data.message;

      if (message === "success") {
        setIsLoading(false);
        getallCategoryData();
        getallProductData(category_id);
        handleEditClose();
        setEditProduct({
          name: "",
          brand: "",
          description: "",
          price: "",
          oldprice: "",
          category: category_id,
        });
        toast.success("Edited Successful", { duration: 1500 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getallCategoryData();
    getallProductData(category_id);
  }, [category_id]);

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
    <div className="adminproducts_div">
      <Paper
        sx={{
          width: "90%",
          overflow: "hidden",
          marginTop: "5rem",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* Add Products */}
        <Link to={`/admin/category`} className="return">Return</Link>
        <Button
          variant="primary"
          onClick={handleShow}
          style={{ backgroundColor: "#1976d2", color: "#fff" }}
        >
          Add Product
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h4>Add Product</h4>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              
            <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">Category</label>
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  name="category"
                  value={product.category}
                  disabled
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
                <label htmlFor="exampleFormControlInput5">Image</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  id="exampleFormControlInput5"
                  multiple
                  required
                  onChange={(e) => setProductImage(e.target.files)}
                />
              </div>
              <br />

              <div className="form-group">
                <label htmlFor="exampleFormControlInput1">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="exampleFormControlInput1"
                  value={product.name}
                  onChange={handleInputs}
                  required
                />
              </div>
              <br />

              <div className="form-group">
                <label htmlFor="exampleFormControlInput2">Brand</label>
                <input
                  type="text"
                  name="brand"
                  className="form-control"
                  id="exampleFormControlInput2"
                  value={product.brand}
                  onChange={handleInputs}
                  required
                />
              </div>
              <br />

              <div className="form-group">
                <label htmlFor="exampleFormControlTextarea1">Description</label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  name="description"
                  style={{ resize: false }}
                  value={product.description}
                  onChange={handleInputs}
                  required
                ></textarea>
              </div>
              <br />

              <div className="form-group">
                <label htmlFor="exampleFormControlInput3">Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  id="exampleFormControlInput3"
                  min={0}
                  value={product.price}
                  onChange={handleInputs}
                  required
                />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="exampleFormControlInput4">Old Price</label>
                <input
                  type="number"
                  name="oldprice"
                  className="form-control"
                  id="exampleFormControlInput4"
                  min={0}
                  value={product.oldprice}
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
            <h4>Edit Category</h4>
            <form onSubmit={handleEditSubmit} encType="multipart/form-data">
              
            <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">Category</label>
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  name="category"
                  value={editproduct.category}
                  disabled
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
                <label htmlFor="exampleFormControlInput1">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="exampleFormControlInput1"
                  value={editproduct.name}
                  onChange={handleEditInputs}
                  required
                />
              </div>
              <br />

              <div className="form-group">
                <label htmlFor="exampleFormControlInput2">Brand</label>
                <input
                  type="text"
                  name="brand"
                  className="form-control"
                  id="exampleFormControlInput2"
                  value={editproduct.brand}
                  onChange={handleEditInputs}
                  required
                />
              </div>
              <br />

              <div className="form-group">
                <label htmlFor="exampleFormControlTextarea1">Description</label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  name="description"
                  style={{ resize: false }}
                  value={editproduct.description}
                  onChange={handleEditInputs}
                  required
                ></textarea>
              </div>
              <br />

              <div className="form-group">
                <label htmlFor="exampleFormControlInput3">Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  id="exampleFormControlInput3"
                  min={0}
                  value={editproduct.price}
                  onChange={handleEditInputs}
                  required
                />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="exampleFormControlInput4">Old Price</label>
                <input
                  type="number"
                  name="oldprice"
                  className="form-control"
                  id="exampleFormControlInput4"
                  min={0}
                  value={editproduct.oldprice}
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
                                handledeleteProduct(row.id);
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>

                          <Button onClick={() => openEditModal(row.id)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>

                          <Tooltip title="Image Edit">
                            <Link to={`/admin/productImage/${category_id}/${row.id}`}>
                              <Button>
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                            </Link>
                          </Tooltip>
                        </ButtonGroup>
                      </TableCell>
                      {columns.map((column) => {
                        var value = String(row[column.id]);

                        return column.id === "description" ? (
                            <TableCell key={column.id} align={column.align} style={{textOverflow:"ellipsis", overflow:"hidden", minWidth:"40rem"}}>
                              {value}
                            </TableCell>
                        ) : (
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
};

export default AdminProducts;
