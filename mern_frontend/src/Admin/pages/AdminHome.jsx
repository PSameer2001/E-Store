import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import HeaderDrawer from "../component/HeaderDrawer";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function AdminHome(props) {
  const authAdmin = props.authAdmin.state;

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: "flex" }}>
          <HeaderDrawer authAdmin={authAdmin} headername={props.headername} />
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <div className="component" style={{marginTop:"4rem"}}>
            {props.children}
            </div>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
