import React from "react";
import { Routes, Route } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import { useAdminAuthContext } from "./AdminAuth/useAdminAuthContext";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminCategory from "./pages/AdminCategory";
import AdminList from "./pages/AdminList";
import AdminProducts from "./pages/AdminProducts";
import AdminProductImage from "./pages/AdminProductImage";
import AdminSection from "./pages/AdminSection";
import AdminCoupons from "./pages/AdminCoupons";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminSupport from "./pages/AdminSupport";

const AdminRoute = () => {
  const authAdmin = useAdminAuthContext();

  // function AccessAdminPage(children) {
  //   if (authAdmin.state.name) {
  //     return children;
  //   } else {
  //     return <AdminLogin />;
  //   }
  // }

  // function AuthenticateAdminPage(children) {
  //   if (authAdmin.state.name) {
  //     return <AdminHome authAdmin={authAdmin} />;
  //   } else {
  //     return children;
  //   }
  // }

  return (
    <>
      {authAdmin.state.name ? (
        <Routes>
          <Route
            path="/admin/"
            index
            element={
              <AdminHome
                authAdmin={authAdmin}
                headername="Dashboard"
                children={<AdminDashboard />}
              />
            }
          />

          <Route
            path="/admin/allAdmin"
            element={
              <AdminHome
                authAdmin={authAdmin}
                headername="Admin List"
                children={<AdminList />}
              />
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminHome
                authAdmin={authAdmin}
                headername="Orders"
                children={<AdminOrders />}
              />
            }
          />

          <Route
            path="/admin/order_details/:order_id"
            element={
              <AdminHome
                authAdmin={authAdmin}
                headername="Order Details"
                children={<AdminOrderDetails />}
              />
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminHome
                authAdmin={authAdmin}
                headername="Users"
                children={<AdminUsers />}
              />
            }
          />

          <Route
            path="/admin/category"
            element={
              <AdminHome
                authAdmin={authAdmin}
                headername="Categories"
                children={<AdminCategory />}
              />
            }
          />

          <Route
            path="/admin/products/:category_id"
            element={
              <AdminHome
                authAdmin={authAdmin}
                headername="Products"
                children={<AdminProducts />}
              />
            }
          />

          <Route
            path="/admin/productImage/:category_id/:productid"
            element={
              <AdminHome
                authAdmin={authAdmin}
                headername="Product Image"
                children={<AdminProductImage />}
              />
            }
          />

          <Route
            path="/admin/adminlogin"
            element={
              <AdminHome
                authAdmin={authAdmin}
                headername="Dashboard"
                children={<AdminDashboard />}
              />
            }
          />

          <Route
            path="/admin/section"
            element={
              <AdminHome
                authAdmin={authAdmin}
                headername="Section"
                children={<AdminSection />}
              />
            }
          />

          <Route
            path="/admin/coupons"
            element={
              <AdminHome
                authAdmin={authAdmin}
                headername="Coupons"
                children={<AdminCoupons />}
              />
            }
          />

          <Route
            path="/admin/support"
            element={
              <AdminHome
                authAdmin={authAdmin}
                headername="Help & Support"
                children={<AdminSupport />}
              />
            }
          />

          <Route path="/admin/*" element={<ErrorPage />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/admin/adminlogin" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLogin />} />
        </Routes>
      )}
    </>
  );
};

export default AdminRoute;
