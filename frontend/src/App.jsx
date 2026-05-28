import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Login/Login";

import AuthSuccess from "./components/AuthSuccess";

import Signup from "./components/Signup/Signup";

import Role from "./components/Role/Role";
import RestaurantForm from "./components/Form/RestaurantForm";
import Restaurant from "./components/Dashboard/Restaurant";
import Customer from "./components/Dashboard/Customer";
import RestaurantRejected from "./components/Dashboard/ResRejection";
import AdminPanel from "./components/Admin/Admin";
import { AuthProvider, useAuth } from "./context/Context";
import RoleSelectionGuard from "./components/RoleSelectionGuard";
import AutoRedirect from "./components/AutoRedirect";
import RestaurantPending from "./components/Dashboard/FormPending";
import UserProfile from "./components/Dashboard/UserProfile";
import CheckoutPage from "./components/Dashboard/Confirmation";
import OrderSuccess from "./components/Dashboard/OrderSuccess";
import AuthGuard from "./components/RouteProtection/RouteProtection";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />

          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route
            path="/role"
            element={
              <RoleSelectionGuard>
                <Role />
              </RoleSelectionGuard>
            }
          />

          <Route
            path="/restaurant_form"
            element={
              <AuthGuard>
                <RestaurantForm />
              </AuthGuard>
            }
          />
          <Route
            path="/restaurant"
            element={
              <AuthGuard>
                <Restaurant />
              </AuthGuard>
            }
          />
          <Route path="/customer" element={
            <AuthGuard>
                <Customer />
            </AuthGuard>
          } />
          <Route
            path="/rejected"
            element={
              <AuthGuard>
                <RestaurantRejected />
              </AuthGuard>
            }
          />
          <Route
            path="/admin"
          element={<AdminPanel/>}
          />
          <Route path="/dashboard" element={<AutoRedirect />} />
          <Route
            path="/restaurant-pending"
            element={
              <AuthGuard>
                <RestaurantPending />
              </AuthGuard>
            }
          />
          <Route path="*" element={<AutoRedirect />} />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <UserProfile />
              </AuthGuard>
            }
          />
          <Route
            path="/checkout"
            element={
              <AuthGuard>
                <CheckoutPage />
              </AuthGuard>
            }
          />
          <Route path="/order_placed" element={<OrderSuccess />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
