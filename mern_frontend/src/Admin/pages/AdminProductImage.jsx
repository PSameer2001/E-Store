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
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { ButtonGroup } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import Image from "react-bootstrap/esm/Image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imageDB } from "../../config/firebase_config";
import getAdminCookie from "../AdminAuth/getAdminCookie";

const AdminProductImage = () => {
  let { productid, category_id } = useParams();
  const product_id = productid;
  const adminHeaders = getAdminCookie();

  const [rows, setRows] = useState([]);
  const [imageopen, setImageOpen] = useState(false);
  const [imagedisplay, setImageDisplay] = useState("");

  const handleImageClose = () => setImageOpen(false);
  const handleImageShow = () => setImageOpen(true);

  const handleImageDisplay = (img) => {
    setImageDisplay(img);
    handleImageShow();
  };

  const [selectedValue, setSelectedValue] = useState("");
  const handleRadioChange = (value) => {
    setSelectedValue(value);
  };

  const getallProductImageData = async (product_id) => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/api/getallImageProductData/${product_id}`,adminHeaders
    );
    const data = res.data;
    setRows(data);

    const filterData = data.filter((data) => data.selected_img === "1");

    if (filterData.length !== 0) {
      setSelectedValue(filterData[0].id);
    }
  };

  useEffect(() => {
    getallProductImageData(product_id);
  }, [product_id]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const [loading, setIsLoading] = useState(false);
  const [productImage, setProductImage] = useState();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const allowedType = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

      for (let file of productImage) {
        if (!allowedType.includes(file?.type)) {
          toast.error("Only JPG, PNG and PNG file type are allowed", {
            duration: 1500,
          });
          return false;
        }
      }
      //   const data = Object.fromEntries(formData.entries());
      //   console.log(data);

      var imageUrl = [];
      const uploadPromises = Object.keys(productImage).map(async (key) => {
        const storageRef = ref(imageDB, `products/${productImage[key].name}`);
        const uploadbytes = await uploadBytes(storageRef, productImage[key]);
        const url = await getDownloadURL(uploadbytes.ref);
        imageUrl.push(url);
        return url;
      });

      await Promise.all(uploadPromises);

      setIsLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/addProductImage`,
        {
          Id: product_id,
          imageUrl: imageUrl
        },adminHeaders
      );
      let message = res.data.message;

      if (message === "success") {
        setTimeout(() => {
          getallProductImageData(product_id);
        }, 500);
        setIsLoading(false);
        handleClose();
        toast.success("Added Successful", { duration: 1500 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handledeleteProductImage = async (id) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/deleteImageProduct`,
        { id },adminHeaders
      );

      const data = await res.data.message;
      if (data === "success") {
        toast.success("Deleted Successful", { duration: 1000 });
        getallProductImageData(product_id);
      } else {
        toast.error(data, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDefaultImage = async (selectedValue, product_id) => {
    try {
      if (selectedValue === undefined) {
        toast.error("Please Select Image", {
          duration: 1500,
        });
        return false;
      }

      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/makeDefaultImageProduct/${selectedValue}/${product_id}`,adminHeaders
      );

      const data = await res.data.message;
      if (data === "success") {
        toast.success("Updated Successful", { duration: 1000 });
        getallProductImageData(product_id);
      } else {
        toast.error(data, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    <div className="adminproductsimage_div">
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
        <Link to={`/admin/products/${category_id}`} className="return">
          Return
        </Link>
        <Button
          variant="primary"
          onClick={handleShow}
          style={{ backgroundColor: "#1976d2", color: "#fff" }}
        >
          Add Product Image
        </Button>

        <Button
          variant="primary"
          onClick={() => handleDefaultImage(selectedValue, product_id)}
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
            marginLeft: "5px",
          }}
        >
          Make Default Image
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
                alt="Product"
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
                <TableCell>Default Image</TableCell>
                <TableCell key="imageurl">Image Url</TableCell>
                <TableCell key="image">Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell key={`oper${row.id}`} align="left">
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
                                handledeleteProductImage(row.id);
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                      <TableCell key={`radio${row.id}`}>
                        <input
                          type="radio"
                          id={row.id}
                          value={row.id}
                          checked={selectedValue === row.id}
                          onChange={() => handleRadioChange(row.id)}
                        />
                      </TableCell>
                      <TableCell key={`url${row.id}`}>{row.imageUrl}</TableCell>
                      <TableCell key={`img${row.id}`}>
                        <Image
                          onClick={() => handleImageDisplay(row["imageUrl"])}
                          src={`${row["imageUrl"]}`}
                          alt="Product"
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

export default AdminProductImage;
