import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ErrorPage from "./ErrorPage";
import Footer from "./components/Footer";
import ForgetPassword from "./pages/ForgetPassword";
import Profile from "./pages/Profile";
import EmailVerification from "./pages/EmailVerification";
import ProductDetail from "./pages/ProductDetail";
import AddToCart from "./pages/AddToCart";
import { useAuthContext } from "./Auth/useAuthContext";
import MyOrder from "./pages/MyOrder";
import MyOrderDetail from "./pages/MyOrderDetail";
import CategoryProduct from "./pages/CategoryProduct";
import ProductSearch from "./pages/ProductSearch";
import TicketPage from "./pages/TicketPage";

const UserRoute = () => {
  const authUser = useAuthContext();

  // function AccessPage(children) {
  //   if (authUser.state.name) {
  //     return children;
  //   } else {
  //     return <Login />;
  //   }
  // }

  // function AuthenticatePage(children) {
  //   if (authUser.state.name) {
  //     return <Home authUser={authUser} />;
  //   } else {
  //     return children;
  //   }
  // }

  return (
    <>
      <Navbar authUser={authUser} />
      <Routes>
        {authUser.state.name ? (
          <>
            <Route path="/" index element={<Home authUser={authUser} />} />
            <Route path="/about" element={<About authUser={authUser} />} />
            <Route path="/profile" element={<Profile authUser={authUser} />} />
            <Route  path="/addtocart"  element={<AddToCart authUser={authUser} />}  />
            <Route path="/myorder" element={<MyOrder authUser={authUser} />} />
            <Route path="/myticket" element={<TicketPage authUser={authUser} />} />
            <Route path="/myorder/:orderid" element={<MyOrderDetail authUser={authUser} />} />
            <Route path="*" element={<ErrorPage />} />
          </>
        ) : (
          <>
            <Route path="*" element={<Home authUser={authUser} />} />
            <Route path="/login" index element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forget_password" element={<ForgetPassword />} />
            <Route  path="/email_verification"  element={<EmailVerification />}  />
          </>
        )}
        
        <Route  path="/product_detail/:category_id/:product_id"  element={<ProductDetail authUser={authUser} />}/>
        <Route  path="/category_product/:category_id"  element={<CategoryProduct authUser={authUser} />}/>
        <Route  path="/search_product"  element={<ProductSearch authUser={authUser} />}/>
      </Routes>
      <Footer authUser={authUser} />
    </>
  );
};

export default UserRoute;
