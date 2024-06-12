import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useEffect, Suspense, lazy } from "react";
import ErrorPage from "./components/fallbacks/ErrorPage";
import { ConfigProvider } from "antd";
import { userSettingData } from "./utils/tools";

const AuthWrapper = lazy(() => import("./components/wrapper/AuthWrapper"));
const PanelWrapper = lazy(() => import("./components/wrapper/PanelWrapper"));
const TrackRequest = lazy(() => import("./components/TrackRequest"));
const AdminPanelWrapper = lazy(() => import("./components/admin/AdminPanelWrapper"));
const RoleWrapper = lazy(() => import("./components/wrapper/RoleWrapper"));
const AdminSettings = lazy(() => import("./components/admin/AdminSettings"));
const Home = lazy(() => import("./components/Home"));
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
      path: "/*",
      element: <Suspense fallback={<div>Loading...</div>}><AuthWrapper /></Suspense>,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "*",
          element: <Suspense fallback={<div>Loading...</div>}><PanelWrapper /></Suspense>,
          children: [
            {
              path: "",
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <RoleWrapper>
                    <Home />
                  </RoleWrapper>
                </Suspense>
              )
            },
            {
              path: "track-request",
              element: <Suspense fallback={<div>Loading...</div>}><TrackRequest /></Suspense>
            },
            {
              path: "admin",
              element: <Suspense fallback={<div>Loading...</div>}><AdminPanelWrapper /></Suspense>,
              children: [
                {
                  path: "",
                  element: <Suspense fallback={<div>Loading...</div>}><Adminhome /></Suspense>
                },
                {
                  path: "categories",
                  element: <Suspense fallback={<div>Loading...</div>}><Category /></Suspense>
                },
                {
                  path: "services",
                  element: <Suspense fallback={<div>Loading...</div>}><Services /></Suspense>
                },
                {
                  path: "forms",
                  element: <Suspense fallback={<div>Loading...</div>}><Forms /></Suspense>
                },
                {
                  path: "settings",
                  element: <Suspense fallback={<div>Loading...</div>}><AdminSettings /></Suspense>
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
