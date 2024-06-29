import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useEffect } from "react";
import AuthWrapper from "./components/wrapper/AuthWrapper";
import PanelWrapper from "./components/wrapper/PanelWrapper";
import ErrorPage from "./components/fallbacks/ErrorPage";
import { TrackRequest } from "./components/TrackRequest";
import AdminPanelWrapper from "./components/admin/AdminPanelWrapper";
import { ConfigProvider } from "antd";
import { userSettingData } from "./utils/tools";
import RoleWrapper from "./components/wrapper/RoleWrapper";
import { AdminSettings } from "./components/admin/AdminSettings";
import Home from "./components/Home";
import {Adminhome} from "./components/admin/Adminhome";
import {Category} from "./components/admin/Category";
import {Services} from "./components/admin/Services";
import {Forms} from "./components/admin/Forms";
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./components/signin/Login";
import Register from "./components/signup/Register";
import ForgotPassword from "./components/forgotpassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";

function App() {
  const token = sessionStorage.getItem('token');
  const settingsData =
    JSON.parse(sessionStorage.getItem("settings")) ||
    {
      image:
        "https://onboardify.tasc360.com/uploads/governify/1717570622_Products Logo (1).png",
      site_bg: "#ffffff",
      button_bg: "#5ac063",
      banner_bg: "#5ac063",
      banner_content:
        "Hire an attitude, not just experience and qualification. Greg Savage.",
      header_bg: "#f7f7f7",
      head_title_color: "#5ac063"
    };

   

  useEffect(() => {
    userSettingData();
    return () => {};
  }, [token]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthWrapper />,
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
              )
            },
            {
              path: "track-request",
              element: <TrackRequest />
            },
            {
              path: "admin",
              element: <AdminPanelWrapper />,
              children: [
                {
                  path: "",
                  element: <Adminhome />
                },
                {
                  path: "categories",
                  element: <Category />
                },
                {
                  path: "services",
                  element: <Services />
                },
                {
                  path: "forms",
                  element: <Forms />
                },
                {
                  path: "settings",
                  element: <AdminSettings />
                }
              ]
            }
          ]
        },
        {
          path: "signup",
          element: <Register/>
        } ,
        {
          path: "signin",
          element: <Login/>
        } ,
        {
          path: "forget-password",
          element: <ForgotPassword/>
        } ,
        {
          path: "reset-password",
          element: <ResetPassword/>
        }
      ]
    }
  ]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: settingsData.button_bg,
            headerColor: "#fff"
          }
        }
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
