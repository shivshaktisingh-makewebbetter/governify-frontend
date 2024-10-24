import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import PanelWrapper from "./components/wrapper/PanelWrapper";
import ErrorPage from "./components/fallbacks/ErrorPage";
import { TrackRequest } from "./components/TrackRequest";
import AdminPanelWrapper from "./components/admin/AdminPanelWrapper";
import { ConfigProvider } from "antd";
import RoleWrapper from "./components/wrapper/RoleWrapper";
import { AdminSettings } from "./components/admin/AdminSettings";
import Home from "./components/Home";
import { Adminhome } from "./components/admin/Adminhome";
import { Category } from "./components/admin/Category";
import { Services } from "./components/admin/Services";
import { Forms } from "./components/admin/Forms";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/signin/Login";
import Register from "./components/signup/Register";
import ForgotPassword from "./components/forgotpassword/ForgotPassword";
import VerifyUser from "./components/verifypassword/VerifyUser";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import CredentialManagement from "./components/PortalCredentials/CredentialManagement";
import Portals from "./components/admin/portal/Portals";
import { Report } from "./components/user/Report";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      // element: <Intercom />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <PanelWrapper />,
          children: [
            {
              path: "",
              element: (
                <RoleWrapper>
                  <Home />
                </RoleWrapper>
              ),
            },
            {
              path: "track-request",
              element: <TrackRequest />,
            },
            {
              path: "portals",
              element: <CredentialManagement />,
            },
            {
              path: "report",
              element: <Report />
            },
            {
              path: "admin",
              element: <AdminPanelWrapper />,
              children: [
                {
                  path: "",
                  element: <Adminhome />,
                },
                {
                  path: "categories",
                  element: <Category />,
                },
                {
                  path: "services",
                  element: <Services />,
                },
                {
                  path: "forms",
                  element: <Forms />,
                },
                {
                  path: "settings",
                  element: <AdminSettings />,
                },
                { path: "portals", element: <Portals /> },
              ],
            },
          ],
        },
        {
          path: "signup",
          element: <Register />,
        },
        {
          path: "signin",
          element: <Login />,
        },
        {
          path: "forget-password",
          element: <ForgotPassword />,
        },
        {
          path: "governify/verify",
          element: <VerifyUser />,
        },
        {
          path: "reset-password",
          element: <ResetPassword />,
        },
      ],
    },
  ]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#59C080",
            headerColor: "#fff",
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
