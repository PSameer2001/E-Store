import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Orders from "../component/Order";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import axios from "axios";
import CountCard from "../component/CountCard";
import Title from "../component/Title";

const AdminDashboard = () => {
  const [dashboard, SetDashboard] = useState([]);
  const [contact, SetContact] = useState([]);
  const [order, SetOrder] = useState([]);

  const getdashBoardData = async () => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getdashBoardData`);
    SetDashboard(res.data.dashboard);
    SetContact(res.data.contactdata);
    SetOrder(res.data.orderdata);
  };

  useEffect(() => {
    getdashBoardData();
  }, []);

  function Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link color="inherit" href="https://mui.com/">
          E-Store
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }
  return (
    <>
      <Toolbar />
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {dashboard.map((data) => {
            return (
              <Grid item xs={12} md={4} lg={3} key={data.title}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 150,
                  }}
                >
                  <CountCard data={data} />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Tickets */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Title>Tickets</Title>
        <Grid container spacing={3}>
          {contact.map((data) => {
            return (
              <Grid item xs={12} md={4} lg={3} key={data.title}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 150,
                  }}
                >
                  <CountCard data={data} />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Orders */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Title>Orders</Title>
        <Grid container spacing={3}>
          {order.map((data) => {
            return (
              <Grid item xs={12} md={4} lg={3} key={data.title}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 150,
                  }}
                >
                  <CountCard data={data} />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Orders />
            </Paper>
          </Grid>
        </Grid>
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </>
  );
};

export default AdminDashboard;
