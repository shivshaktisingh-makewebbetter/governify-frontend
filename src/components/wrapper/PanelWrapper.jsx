import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../common/Footer";
import { fetcher } from "../../utils/helper";
import { userSettingData } from "../../utils/tools";

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
        sessionStorage.setItem("phoneNumber", response.data.phone);
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

  const getSiteSetting = async () => {
    await userSettingData();
  }

  useEffect(() => {
    getSiteSetting();
  },[])



  return (
    <>
      <Header user={user} />
      <div
        className="container d-flex flex-column h-100 text-center"
        style={{
          background:
            location.pathname === "/report" ? "#F6F6FB" : data.site_bg,
        }}
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
