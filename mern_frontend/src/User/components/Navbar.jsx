/* eslint-disable */
import React, { useEffect, useState } from "react";
import "../css/Navbar.css";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import appicon from "./images/appicon.png";
import {
  faBox,
  faCartShopping,
  faCircleUser,
  faList,
  faPenToSquare,
  faRightFromBracket,
  faSearch,
  faTicketAlt,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import useLogOut from "../Hooks/useLogOut";
import axios from "axios";
import getUserCookie from "../Auth/getUserCookie";

const Navbar = (props) => {
  const authUser = props.authUser;
  const user = authUser.state;
  const userHeaders = getUserCookie();

  const [isActiveSearch, setIsActiveSearch] = useState(false);
  const [isActiveUserr, setIsActiveUserr] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [allProduct, setallProduct] = useState([]);

  const searchInput = () => {
    setIsActiveSearch((active) => !active);
    setIsActiveUserr(false);
  };

  const handleUserDialog = () => {
    setIsActiveUserr((active) => !active);
    setIsActiveSearch(false);
    // setIsActiveUserr(true);
  };

  const handleOnScroll = () => {
    setIsActiveSearch(false);
    setIsActiveUserr(false);
  };

  const { logout } = useLogOut();
  const navigate = useNavigate();

  const LogOut = async () => {
    try {
      const res = await logout();
      if (res === "logout") {
        handleOnScroll();
        toast.success("Logout Successful", { duration: 1000 });
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      } else {
        toast.error(res, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEveryProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/getEveryProduct`,userHeaders);
    const data = res.data;
    setallProduct(data);
  };

  const handleSearch = async () => {
    if (searchText !== "") {
      const Filterdata = allProduct.filter((product) => {
        return (
          product.name.toLowerCase().includes(searchText.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchText.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          product.category.toLowerCase().includes(searchText.toLowerCase()) ||
          product.price.toLowerCase().includes(searchText.toLowerCase())
        );
      });

      navigate("search_product", {
        state: Filterdata,
      });
    }
  };

  useEffect(() => {
    getEveryProduct();
    window.addEventListener("scroll", handleOnScroll);
    return () => window.removeEventListener("scroll", handleOnScroll);
  }, []);

  return (
    <>
      <div className="navbarHeader">
        <nav className="navbar navbar-expand-lg ">
          <div className="container-fluid">
            <div className="navbar-title">
              <NavLink className="navbar-brand" to="/" onClick={handleOnScroll}>
                <img
                  src={appicon}
                  alt=""
                  className="brandImg"
                  width="60"
                  height="40"
                  onClick={handleOnScroll}
                />
                E-Store
              </NavLink>
            </div>

            <div className="col-md-3" style={{ margin: "0 auto" }}>
              <div className="icons">
                {user.name && (
                  <div id="menu-btn">
                    <FontAwesomeIcon
                      icon={faTicketAlt}
                      onClick={() => navigate('/myticket')}
                    />
                  </div>
                )}
                <div id="search-btn">
                  <FontAwesomeIcon icon={faSearch} onClick={searchInput} />
                </div>
                {user.name ? (
                  <>
                    <div id="userloggedin-btn" className="user">
                      <FontAwesomeIcon
                        icon={faUser}
                        onClick={handleUserDialog}
                      />
                    </div>

                    <div className={isActiveUserr ? "userr active" : "userr"}>
                      <div className="profile">
                        <FontAwesomeIcon
                          icon={faXmark}
                          id="close-profile"
                          onClick={() => setIsActiveUserr(false)}
                        />
                        <h3>
                          {user.name}
                          <br />
                          <span>Welcome to E-Mobile</span>
                        </h3>
                        <ul>
                          <li>
                            <FontAwesomeIcon icon={faCircleUser} />
                            <NavLink to="/profile">My Profile</NavLink>
                          </li>
                          <li>
                            <FontAwesomeIcon icon={faPenToSquare} />
                            <NavLink to="/profile">Edit Profile</NavLink>
                          </li>
                          <li>
                            <FontAwesomeIcon icon={faBox} />
                            <NavLink to="/myorder">My Order</NavLink>
                          </li>
                          <li>
                            <FontAwesomeIcon icon={faList} />
                            <NavLink to="/">Terms</NavLink>
                          </li>
                          <li>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                            <NavLink onClick={LogOut}>Logout</NavLink>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="cart">
                      <NavLink to="/addtocart">
                        <FontAwesomeIcon
                          icon={faCartShopping}
                          onClick={handleOnScroll}
                        />
                      </NavLink>
                    </div>
                  </>
                ) : (
                  <div id="usernotloggedin-btn" className="user">
                    <NavLink to="/login">
                      <FontAwesomeIcon icon={faUser} />
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <form className={isActiveSearch ? "search-form active" : "search-form"}>
          <input
            type="search"
            name="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search here...."
            id="search-box"
            required
          />
          <button type="button" className="search_btn" onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
        <Toaster />
        <ToastContainer />
      </div>
    </>
  );
};

export default Navbar;
