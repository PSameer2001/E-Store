import React from "react";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { NavLink, useNavigate } from "react-router-dom";
import useAdminLogOut from "../Hooks/useAdminLogout";
import toast, { Toaster } from "react-hot-toast";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import ListIcon from '@mui/icons-material/List';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const drawerWidth = 240;

const HeaderDrawer = (props) => {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const authAdmin = props.authAdmin;
  const { logout } = useAdminLogOut();
  const navigate = useNavigate();

  if (!authAdmin.name) {
    navigate("/admin/adminlogin");
  }

  const AdminLogout = async () => {
    try {
      const res = await logout();
      if (res === "logout") {
        // toast.success("Logout Successful", { duration: 1000 });
        setTimeout(() => {
          navigate("/admin/adminlogin", { replace: true });
        }, 2000);
      } else {
        toast.error(res, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="headerdrawer">
        <Toaster />
        <ToastContainer />
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {props.headername}
            </Typography>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ display: "flex", justifyContent: "right" }}
            >
              {authAdmin.name}
            </Typography>
            <IconButton color="inherit">
              {/* <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge> */}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <React.Fragment>
              <NavLink to="/admin/">
                <ListItemButton>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </NavLink>

              <NavLink to="/admin/section">
                <ListItemButton>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Section" />
                </ListItemButton>
              </NavLink>

              <NavLink to="/admin/coupons">
                <ListItemButton>
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="Coupons" />
                </ListItemButton>
              </NavLink>

              {authAdmin.isSuperAdmin && (
                <NavLink to="/admin/allAdmin">
                  <ListItemButton>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Admin" />
                  </ListItemButton>
                </NavLink>
              )}

              <NavLink to="/admin/orders">
                <ListItemButton>
                  <ListItemIcon>
                    <ShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Orders" />
                </ListItemButton>
              </NavLink>

              <NavLink to="/admin/users">
                <ListItemButton>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Customers" />
                </ListItemButton>
              </NavLink>

              <NavLink to="/admin/category">
                <ListItemButton>
                  <ListItemIcon>
                    <BarChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Categories" />
                </ListItemButton>
              </NavLink>

              <NavLink to="/admin/support">
                <ListItemButton>
                  <ListItemIcon>
                    <SupportAgentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Support" />
                </ListItemButton>
              </NavLink>

            </React.Fragment>

            <Divider sx={{ my: 1 }} />

            <React.Fragment>
              <ListItemButton onClick={AdminLogout}>
                <ListItemIcon>
                  <LogoutOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            </React.Fragment>
          </List>
        </Drawer>
      </div>
    </>
  );
};

export default HeaderDrawer;
