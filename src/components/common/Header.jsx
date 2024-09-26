import React, { useState } from "react";
import { Button, Drawer, Flex, Typography } from "antd";
import {
  CloseOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

import { getRole } from "../../utils/helper";
import { ReportIcon } from "../../assets/image";

const Header = ({ user }) => {
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
  };
  const location = useLocation();
  const navigate = useNavigate();
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
            <div className="governify-header-major-div-buttons d-none  d-md-flex d-lg-flex d-xl-flex d-xxl-flex">
              <Typography>
                <span className="onboardify-welcome">Welcome</span>{" "}
                <span className="onboardify-welcome-text-hani">{user}</span>
              </Typography>
              <div className="governify-header-buttons">
                {role === "customer" ? (
                  location.pathname === "/track-request" ? (
                    <Button
                      className="governify-secondary-btn border-radius-10"
                      style={{
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                        border: homeBUttonHovered
                          ? `1px solid #928f8f`
                          : `1px solid ${data.button_bg}`,
                        color: homeBUttonHovered ? `#928f8f` : data.button_bg,
                        background: "transparent",
                      }}
                      onClick={navigateToReport}
                      onMouseEnter={() => handleHoverHome(true)}
                      onMouseLeave={() => handleHoverHome(false)}
                    >
                      <span className="font-family-montse fs-12 fw-700">
                        Report
                      </span>
                      <ReportIcon className="fs_20 fw-700" />
                    </Button>
                  ) : (
                    <Button
                      className="governify-secondary-btn fs_12 fw-700 border-radius-10"
                      style={{
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                        border: trackRequestHovered
                          ? `1px solid #928f8f`
                          : `1px solid ${data.button_bg}`,
                        color: trackRequestHovered ? `#928f8f` : data.button_bg,
                        background: "transparent",
                      }}
                      onClick={navigateToTrackRequest}
                      onMouseEnter={() => handleHover(true)}
                      onMouseLeave={() => handleHover(false)}
                    >
                      <span className="font-family-montse fs-12 fw-700">
                        Track a Request
                      </span>
                      <SearchOutlined className="fs_20 fw-700" />
                    </Button>
                  )
                ) : (
                  <Button
                    className="governify-secondary-btn fs_12 fw-700 border-radius-10"
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                      border: settingButtonHovered
                        ? `1px solid #928f8f`
                        : `1px solid ${data.button_bg}`,
                      color: settingButtonHovered ? `#928f8f` : data.button_bg,
                      background: "transparent",
                    }}
                    onClick={navigateToSettings}
                    onMouseEnter={() => handleHoverSetting(true)}
                    onMouseLeave={() => handleHoverSetting(false)}
                  >
                    <span className="font-family-montse fs-12 fw-700">
                      Settings
                    </span>
                    <SettingOutlined className="fs_20 fw-700" />
                  </Button>
                )}

                <Button
                  type="primaary"
                  className="governify-primary-btn border-radius-10"
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                    background: data.button_bg,
                    color: "#fff",
                  }}
                  onClick={logoutFunction}
                >
                  <span className="font-family-montse fs-12 fw-700">
                    Log out
                  </span>
                  <LogoutOutlined className="fs_20" />
                </Button>
              </div>
            </div>
            <div className="d-block  d-md-none d-lg-none d-xl-none d-xxl-none lh-1">
              <MenuOutlined
                style={{ color: "#000000", fontSize: "20px" }}
                onClick={() => setOpenDrawer(true)}
              />
            </div>
          </div>
        </div>
      </header>
      <Drawer
        title={
          <Flex justify="space-between">
            <span>Welcome, {sessionStorage.getItem("userName")}</span>{" "}
            <CloseOutlined
              onClick={() => setOpenDrawer(false)}
              style={{ cursor: "pointer" }}
            />{" "}
          </Flex>
        }
        placement="right"
        closable={false}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        width="90%"
        key="right"
      >
        <Flex align="start" vertical gap={10}>
          {role === "customer" ? (
            location.pathname === "/track-request" ? (
              <Button
                type="text"
                onClick={() => {
                  navigateToHome();
                  setOpenDrawer(false);
                }}
              >
                <span className="font-family-montse fs-12 fw-700">Home</span>
              </Button>
            ) : (
              <Button
                type="text"
                onClick={() => {
                  navigateToTrackRequest();
                  setOpenDrawer(false);
                }}
              >
                <span className="font-family-montse fs-12 fw-700">
                  Track a Request
                </span>
              </Button>
            )
          ) : (
            <Button
              type="text"
              onClick={() => {
                navigateToSettings();
                setOpenDrawer(false);
              }}
            >
              <span className="font-family-montse fs-12 fw-700">Settings</span>
            </Button>
          )}

          <Button
            type="text"
            onClick={() => {
              logoutFunction();
              setOpenDrawer(false);
            }}
          >
            <span className="font-family-montse fs-12 fw-700">Log out</span>
          </Button>
        </Flex>
      </Drawer>
    </>
  );
};

export default Header;
