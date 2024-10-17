import {
  CloseOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Input, Popover, Select, Space } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Loader } from "../../common/Loader";
import { toast } from "react-toastify";
import { fetcher } from "../../../utils/helper";

const AddPortal = ({
  open,
  setOpenAddPortalDrawer,
  usedPortals,
  portals,
  fetchPortalCredentials,
}) => {
  const [formData, setFormData] = useState({
    portal: null,
    username: "",
    password: "",
  });
  const [errorSchema, setErrorSchema] = useState({
    portal: false,
    username: false,
    password: false,
  });
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [portalOption, setPortalOption] = useState([]);
  const [loading, setLoading] = useState(false);

  // change width of drawer based on screen...

  const isLargeScreen = useMediaQuery({ query: "(min-width: 1200px)" });
  const isMediumScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 767px)" });

  let DrawerWidth = "520px";
  if (isLargeScreen) {
    DrawerWidth = "520px";
  } else if (isMediumScreen) {
    DrawerWidth = "520px";
  } else if (isSmallScreen) {
    DrawerWidth = "90%";
  }

  const handleChange = useCallback(
    (key, value) => {
      setFormData({ ...formData, [key]: value });
    },
    [formData]
  );

  useEffect(() => {
    if (portals.length) {
      let option = [];
      portals.map((item) => {
        option.push({
          label: usedPortals.includes(item.id) ? (
            <Popover content="This portal has already been added">
              <div className="countryOption ff-ws">
                <span
                  dangerouslySetInnerHTML={{
                    __html: `<img width="20px" src='${item.file_location}' />`,
                  }}
                  className="tw-max-w-[20px] tw-h-[20px]"
                ></span>
                {" " + item.title}
              </div>
            </Popover>
          ) : (
            <div className="countryOption ff-ws">
              <span
                dangerouslySetInnerHTML={{
                  __html: `<img width="20px" src='${item.file_location}' />`,
                }}
                className="tw-max-w-[20px] tw-h-[20px]"
              ></span>
              {" " + item.title}
            </div>
          ),
          disabled: usedPortals.includes(item.id),
          value: item.id,
        });
      });
      setPortalOption(option);
    }
  }, [portals, usedPortals]);

  const validateForm = () => {
    let valid = true;
    let errorObj = { portal: false, username: false, password: false };

    if (formData.portal === null || formData.portal === "") {
      valid = false;
      errorObj.portal = true;
    } else {
      valid = true;
      errorObj.portal = false;
    }
    if (formData.username === "") {
      valid = false;
      errorObj.username = true;
    } else {
      if (valid) {
        valid = true;
      }
    }
    if (formData.password === "") {
      valid = false;
      errorObj.password = true;
      setPasswordErrorMsg("This field is required.");
    } else if (formData.password.trim().length < 8) {
      valid = false;
      errorObj.password = true;
      setPasswordErrorMsg(
        "Password should be greater than or equal to 8 digits"
      );
    } else {
      if (valid) {
        valid = true;
      }
      errorObj.password = false;
      setPasswordErrorMsg("");
    }

    setErrorSchema({
      portal: errorObj.portal,
      username: errorObj.username,
      password: errorObj.password,
    });

    return { valid };
  };

  const handleSubmit = async () => {
    const { valid } = validateForm();
    if (!valid) {
      return;
    }
    setLoading(true);
    let url = "governify/customer/addPortalCredentials";
    let method = "POST";
    let payload = JSON.stringify({
      portal_id: formData.portal,
      username: formData.username,
      password: formData.password,
    });
    try {
      const response = await fetcher(url, method, payload);
      if (response.status) {
        toast.success(response.message);
        await fetchPortalCredentials();
        setOpenAddPortalDrawer(false);
        setFormData({
          portal: null,
          username: "",
          password: "",
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Oops! Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Drawer
        open={open}
        width={DrawerWidth}
        onClose={() => setOpenAddPortalDrawer(false)}
        title={<div className="fs-24 pt-1">Add Portal Credentials</div>}
        closable={false}
        extra={
          <Space>
            <Button type="text" onClick={() => setOpenAddPortalDrawer(false)}>
              <CloseOutlined />
            </Button>
          </Space>
        }
        zIndex={9991}
        footer={
          <div className="d-flex justify-content-between pt-2">
            <button
              style={{
                background: "#f2f3f7",
                color: "#202223",
                maxWidth: "224px",
                borderRadius: "8px",
                gap: "5px",
                padding: "10px 20px",
                border: "1px solid #8C9196",
              }}
              onClick={() => setOpenAddPortalDrawer(false)}
            >
              Cancel
            </button>
            <button
              style={{
                background: "#00BF63",
                color: "#fff",
                maxWidth: "224px",
                borderRadius: "8px",
                gap: "5px",
                padding: "10px 20px",
                border: "none",
              }}
              onClick={() => handleSubmit()}
            >
              Add Portal Credentials
            </button>
          </div>
        }
      >
        <div className="d-flex flex-column" style={{ gap: "20px" }}>
          <div className="d-flex flex-column" style={{ gap: "5px" }}>
            <div className="fs-16" style={{ color: "#202223" }}>
              Portal
            </div>
            <Select
              value={formData.portal}
              options={portalOption}
              onChange={(value) => handleChange("portal", value)}
              placeholder="Select Portal"
              style={{ background: errorSchema.portal ? "#FFF4F4" : "", height: "40px" }}
              status={errorSchema.portal ? "error" : ""}
            />
            {errorSchema.portal && (
              <span
                style={{ color: "#FD5749", marginTop: "5px" }}
                className="fs-s"
              >
                This field is required.
              </span>
            )}
          </div>
          <div className="d-flex flex-column" style={{ gap: "5px" }}>
            <div className="fs-16" style={{ color: "#202223" }}>
              Portal Username
            </div>
            <Input
              value={formData.username}
              placeholder="Enter Portal Username/Useremail"
              className="py-2 px-3"
              autoComplete="off"
              onChange={(e) => handleChange("username", e.target.value)}
              prefix={
                <UserOutlined className="fs-18" style={{ color: "#5C5F62" }} />
              }
              style={{ background: errorSchema.username ? "#FFF4F4" : "" }}
              status={errorSchema.username ? "error" : ""}
            />
            {errorSchema.username && (
              <span
                style={{ color: "#FD5749", marginTop: "5px" }}
                className="fs-s"
              >
                This field is required.
              </span>
            )}
          </div>
          <div className="d-flex flex-column" style={{ gap: "5px" }}>
            <div className="fs-16" style={{ color: "#202223" }}>
              Portal Password
            </div>
            <Input
              value={formData.password}
              type={showPassword ? "text" : "password"}
              className="py-2 px-3"
              style={{ background: errorSchema.password ? "#FFF4F4" : "" }}
              status={errorSchema.password ? "error" : ""}
              prefix={
                <LockOutlined className="fs-18" style={{ color: "#5C5F62" }} />
              }
              suffix={
                showPassword ? (
                  <EyeInvisibleOutlined
                    className="fs-18"
                    style={{ color: "#5C5F62" }}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <EyeOutlined
                    className="fs-18"
                    style={{ color: "#5C5F62" }}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )
              }
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter portal Password"
              autoComplete="off"
            />
            {errorSchema.password && (
              <span
                style={{ color: "#FD5749", marginTop: "5px" }}
                className="fs-s"
              >
                {passwordErrorMsg}
              </span>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default AddPortal;
