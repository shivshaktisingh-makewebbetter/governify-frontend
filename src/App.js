import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useEffect, lazy, Suspense } from "react";
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

// Lazy loaded components
const Adminhome = lazy(() => import("./components/admin/Adminhome"));
const Category = lazy(() => import("./components/admin/Category"));
const Services = lazy(() => import("./components/admin/Services"));
const Forms = lazy(() => import("./components/admin/Forms"));

function App() {
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
  }, []);

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
                  element: (
                    <Suspense fallback={<div>Loading...</div>}>
                      <Adminhome />
                    </Suspense>
                  )
                },
                {
                  path: "categories",
                  element: (
                    <Suspense fallback={<div>Loading...</div>}>
                      <Category />
                    </Suspense>
                  )
                },
                {
                  path: "services",
                  element: (
                    <Suspense fallback={<div>Loading...</div>}>
                      <Services />
                    </Suspense>
                  )
                },
                {
                  path: "forms",
                  element: (
                    <Suspense fallback={<div>Loading...</div>}>
                      <Forms />
                    </Suspense>
                  )
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
          path: "*",
          element: <>NO PAGE FOUND</>
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
