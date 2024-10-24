import React, { useState } from "react";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { getRole } from "../../utils/helper";
import CustomerMenu from "./CustomerMenu";
import AdminMenu from "./AdminMenu";
import ConfirmAccount from "./ConfirmAccount";
import { ToastContainer } from "react-toastify";

const Header = ({ user }) => {
  const data = JSON.parse(sessionStorage.getItem("settings")) || {
    image:
      "https://onboardifyapi.tasc360.com/uploads/governify/1721919601_7.png",
    site_bg: "#ffffff",
    button_bg: "#5ac063",
    banner_bg: "#5ac063",
    banner_content:
      "Hire an attitude, not just experience and qualification. Greg Savage.",
    header_bg: "#f7f7f7",
    head_title_color: "#5ac063",
  };
  const navigate = useNavigate();
  const [showCredentials, setShowCredentials] = useState(false);
  const [trackRequestHovered, setTrackRequestHovered] = useState(false);
  const [homeBUttonHovered, setHomeButtonHovered] = useState(false);
  const [settingButtonHovered, setSettingButtonHovered] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [notification, setNotification] = useState(
    sessionStorage.getItem("notification_bar") === "false" ? false : true
  );
  const role = getRole();

  const navigateToSettings = () => {
    navigate("admin/settings");
  };

  const navigateToTrackRequest = () => {
    navigate("track-request");
  };

  const navigateToReport = () => {
    navigate("report");
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const handleSetNotification = () => {
    setNotification(false);
    sessionStorage.setItem("notification_bar", "false");
  };

  const logoutFunction = () => {
    // sessionStorage.removeItem('token');
    // sessionStorage.removeItem('role');
    sessionStorage.clear();
    navigate("/signin");
  };

  const handleHover = (flag) => {
    if (flag) {
      setTrackRequestHovered(true);
    } else {
      setTrackRequestHovered(false);
    }
  };

  const handleHoverHome = (flag) => {
    if (flag) {
      setHomeButtonHovered(true);
    } else {
      setHomeButtonHovered(false);
    }
  };

  const handleHoverSetting = (flag) => {
    if (flag) {
      setSettingButtonHovered(true);
    } else {
      setSettingButtonHovered(false);
    }
  };

  return (
    <>
      {notification && (
        <div
          id="notification-banner"
          style={{ background: data.banner_bg }}
          className={`position-relative custom-banner banner text-center p-2`}
        >
          <div
            className="fs-7 banner-content text-light"
            style={{ paddingRight: "50px", paddingLeft: "50px" }}
          >
            {data.banner_content}
          </div>
          <button
            onClick={handleSetNotification}
            id="remove-n-btn"
            style={{
              position: "absolute",
              right: 0,
              margin: "3px",
              height: "calc(100% - 16px)",
            }}
            className="remove-notification text-light p-0 top-0 mx-2 fs-6 px-2 outline-0 bg-transparent border-0"
          >
            <i className="bi bi-x-circle"></i>
          </button>
        </div>
      )}
      <header
        className="header-bar mb-auto mb-3"
        style={{ background: data.header_bg }}
      >
        <div className="container h-100 p-3 py-2 mx-auto">
          <div className="governify-header-major-div">
            <div className="governify-header-major-div-logo">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToHome();
                }}
                className="text-decoration-none"
              >
                <span className="header-logo float-md-start">
                  <img height="80" alt="TASC logo" src={data.image} />
                </span>
              </a>
            </div>
            <div className="governify-header-major-div-buttons d-md-flex d-lg-flex d-xl-flex d-xxl-flex">
              <Typography className="d-none d-md-flex d-lg-flex d-xl-flex d-xxl-flex" style={{gap: "5px"}}>
                <span className="onboardify-welcome">Welcome</span>{" "}
                <span className="onboardify-welcome-text-hani">{user}</span>
              </Typography>
              <div className="lh-1" style={{marginLeft: 'auto'}}>
                {role === "customer" ? <CustomerMenu logoutFunction={logoutFunction} setShowCredentials={setShowCredentials} /> : <AdminMenu logoutFunction={logoutFunction} />}
              </div>
            </div>
          </div>
        </div>
      </header>
      <ConfirmAccount showCredentials={showCredentials} setShowCredentials={setShowCredentials} />
      <ToastContainer position="bottom-right" className="custom-toast" />
    </>
  );
};

export default Header;
