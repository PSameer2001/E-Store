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
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faTrash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

export default function AdminUsers() {
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

  const getallUserData = async () => {
    const res = await axios.get("/getallUserData");
    const data = res.data;
    setRows(data);
  };

  const navigate = useNavigate();

  const handledeleteuser = async (id) => {
    try {
      const res = await axios.post("/deleteUser", { id });

      const data = await res.data.message;
      if (data === "success") {
        toast.success("Deleted Successful", { duration: 1000 });
        navigate("/admin/users");
        getallUserData();
      } else {
        toast.error(data, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getallUserData();
  }, []);

  return (
    <div className="adminlist_div">
      <Paper
        sx={{
          width: "90%",
          overflow: "hidden",
          marginTop: "5rem",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
      
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
                        <Button
                          onClick={() => {
                            const confirmBox = window.confirm(
                              "Do you really want to delete ?"
                            );
                            if (confirmBox === true) {
                              handledeleteuser(row.id);
                            }
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
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
