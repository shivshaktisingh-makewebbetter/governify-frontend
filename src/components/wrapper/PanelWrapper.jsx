import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../common/Footer";
import { fetcher } from "../../utils/helper";

const PanelWrapper = () => {
  const [user, setUser] = useState("");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const location = useLocation();
  const data = JSON.parse(sessionStorage.getItem("settings")) || {
    image:
      "https://onboardify.tasc360.com/uploads/governify/1718271730_1718195689_Products%20Logo%20(1).png",
    site_bg: "#ffffff",
    button_bg: "#5ac063",
    banner_bg: "#5ac063",
    banner_content:
      "Hire an attitude, not just experience and qualification. Greg Savage.",
    header_bg: "#f7f7f7",
    head_title_color: "#5ac063",
    form_description:
      "Please fill out the form to proceed with the needed action to provide you with this service",
  };

  const getLoginUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const url = `loginUserDetails/${token}`;
      const method = "GET";
      const response = await fetcher(url, method);
      if (response.success) {
        sessionStorage.setItem("userName", response.data.name);
        sessionStorage.setItem("userEmail", response.data.email);
        sessionStorage.setItem("userId", response.data.user_id);
        sessionStorage.setItem("createdAt", response.data.created_at);
        setUser(response.data.name);
      }
    } catch (err) {
      console.log(err, "error");
    } finally {
    }
  };

  useEffect(() => {
    getLoginUserDetails();
  }, [token]);

  useEffect(() => {
    const loadIntercom = () => {
      if (
        location.pathname === "/" ||
        location.pathname === "/track-request" ||
        location.pathname === "/signup" ||
        location.pathname === "/signin" ||
        location.pathname === "/forget-password"
      ) {
        // Set up intercomSettings
        window.intercomSettings = {
          api_base: "https://api-iam.intercom.io",
          app_id: "wk35gw8g",
          name: sessionStorage.getItem("userName")
            ? sessionStorage.getItem("userName")
            : "", // Full name
          user_id: sessionStorage.getItem("userId")
            ? sessionStorage.getItem("userId")
            : Math.floor(100000 + Math.random() * 900000),
          email: sessionStorage.getItem("userEmail")
            ? sessionStorage.getItem("userEmail")
            : "",
          created_at: sessionStorage.getItem("createdAt")
            ? sessionStorage.getItem("createdAt")
            : "",
        };

        // Check if Intercom is already defined
        if (typeof window.Intercom === "function") {
          window.Intercom("reattach_activator");
          window.Intercom("update", window.intercomSettings);
        } else {
          // Create the Intercom function if not already defined
          const intercom = function () {
            intercom.c(arguments);
          };
          intercom.q = [];
          intercom.c = function (args) {
            intercom.q.push(args);
          };
          window.Intercom = intercom;

          // Function to create and insert the script tag
          const loadScript = () => {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src = "https://widget.intercom.io/widget/wk35gw8g";
            script.id = "intercom-script";
            const firstScript = document.getElementsByTagName("script")[0];
            firstScript.parentNode.insertBefore(script, firstScript);
          };

          // Load the script either on load or immediately if the document is already ready
          if (document.readyState === "complete") {
            loadScript();
          } else if (window.attachEvent) {
            window.attachEvent("onload", loadScript);
          } else {
            window.addEventListener("load", loadScript, false);
          }
        }
      }
    };

    setTimeout(() => {
      loadIntercom();
    }, 2000);

    // Cleanup function to remove Intercom script
    return () => {
      const intercomScript = document.getElementById("intercom-script");
      if (
        intercomScript &&
        location.pathname !== "/track-request" &&
        location.pathname !== "/"
      ) {
        intercomScript.remove();
      }
      if (typeof window.Intercom === "function") {
        window.Intercom("shutdown");
      }
    };
  }, [token, role, location]);


  return (
    <>
      <Header user={user} />
      <div
        className="container d-flex flex-column h-100 text-center"
        style={{ background: data.site_bg }}
      >
        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PanelWrapper;
