import {
  CloseOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const EditCredentials = ({
  type,
  item,
  setType,
  portals,
  errorSchema,
  passwordErrorMsg,
  formData,
  setEditCredFormData,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [portalOption, setPortalOption] = useState([]);
  //   const [formData, setFormData] = useState({
  //     portal: item.portal_credential_id,
  //     username: item.username,
  //     password: item.password,
  //   });
  //   const [loading, setLoading] = useState(false);

  //   const [errorSchema, setErrorSchema] = useState({
  //     username: false,
  //     password: false,
  //   });
  //   const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  const isLargeScreen = useMediaQuery({ query: "(min-width: 1200px)" });
  const isMediumScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 767px)" });

  let DrawerWidth = "495px";
  if (isLargeScreen) {
    DrawerWidth = "495px";
  } else if (isMediumScreen) {
    DrawerWidth = "495px";
  } else if (isSmallScreen) {
    DrawerWidth = "85%";
  }

  useEffect(() => {
    if (item) {
      setEditCredFormData({
        portal: item?.portal_credential_id,
        username: item?.username,
        password: item?.password,
      });
    }
  }, []);

  const onClose = () => {
    setType("");
  };

  useEffect(() => {
    if (portals.length) {
      let option = [];
      portals.map((item) => {
        option.push({
          label: (
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
          value: item.id,
        });
      });
      setPortalOption(option);
    }
  }, [portals]);

  const handleChange = useCallback(
    (key, value) => {
      setEditCredFormData({ ...formData, [key]: value });
    },
    [formData]
  );

  //   const validateForm = () => {
  //     let valid = true;
  //     let errorObj = { username: false, password: false };
  //     if (formData.username === "") {
  //       valid = false;
  //       errorObj.username = true;
  //     } else {
  //       valid = true;
  //       errorObj.username = false;
  //     }
  //     if (formData.password === "") {
  //       valid = false;
  //       errorObj.password = true;
  //       setPasswordErrorMsg("This field is required.");
  //     } else if (formData.password.trim().length < 8) {
  //       valid = false;
  //       errorObj.password = true;
  //       setPasswordErrorMsg(
  //         "Password should be greater than or equal to 8 digits"
  //       );
  //     } else {
  //       if (valid) {
  //         valid = true;
  //       }
  //       errorObj.password = false;
  //       setPasswordErrorMsg("");
  //     }

  //     setErrorSchema({
  //       username: errorObj.username,
  //       password: errorObj.password,
  //     });

  //     return { valid };
  //   };

  //   const handleSubmit = async () => {
  //     let { valid } = validateForm();
  //     if (!valid) {
  //       return;
  //     }
  //     let url = `governify/customer/updatePortalCredentials/${item.id}`;
  //     let method = "PUT";
  //     let payload = JSON.stringify({
  //       portal_id: formData.portal,
  //       username: formData.username,
  //       password: formData.password,
  //     });
  //     try {
  //       const response = await fetcher(url, method, payload);
  //       if (response.status) {
  //         toast.success(response.message);
  //         await fetchPortalCredentials();
  //         setOpenDrawer(false);
  //       } else {
  //         toast.error(response.message);
  //       }
  //     } catch (error) {
  //       toast.error("Oops! Something went wrong.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <>
      {/* {loading && <Loader />} */}
      {/* <Drawer
        width={DrawerWidth}
        title={null}
        onClose={onClose}
        open={openDrawer}
        closable={false}
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
              className="fw-semibold"
              onClick={onClose}
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
              className="fw-semibold"
              onClick={() => handleSubmit()}
            >
              Save Changes
            </button>
          </div>
        }
      > */}
      <div
        style={{ background: "#ffffff", width: DrawerWidth }}
        className={`edit-portal-credentials ${
          type === "edit"
            ? "edit-portal-credentials__active"
            : "edit-portal-credentials__unactive"
        }`}
      >
        <div className="d-flex justify-content-between ">
          <span className="d-flex" style={{ gap: "10px" }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginTop: "8px", cursor: 'pointer' }}
              onClick={onClose}
            >
              <path
                d="M16 7H3.83L9.42 1.41L8 0L0 8L8 16L9.41 14.59L3.83 9H16V7Z"
                fill="#5C5F62"
              />
            </svg>
            <span className="d-flex flex-column">
              <span
                style={{ color: "#202223", fontSize: "24px" }}
                className="fw-semibold"
              >
                Edit{" "}
                {
                  portals.filter(
                    (portal) => portal.id === item?.portal_credential_id
                  )[0]?.title
                }{" "}
                Credentials
              </span>
              <span className="fs-16 mt-2" style={{ color: "#6D7175" }}>
                Update your saved credentials for secure portal access.
              </span>
            </span>
          </span>
          <span style={{ marginTop: "-1px" }}>
            <Button onClick={onClose} type="text" style={{ padding: 0 }}>
              <CloseOutlined />
            </Button>
          </span>
        </div>

        <div className="d-flex flex-column mt-3" style={{ gap: "20px" }}>
          <div className="d-flex flex-column" style={{ gap: "5px" }}>
            <div className="fs-16 text-start" style={{ color: "#202223" }}>
              Portal
            </div>
            <Select
              value={item?.portal_credential_id}
              disabled
              options={portalOption}
              placeholder="Select Portal..."
              style={{height: "40px"}}
            />
          </div>
          <div
            className="text-center d-flex flex-column"
            style={{ gap: "5px" }}
          >
            <div className="fs-16 text-start" style={{ color: "#202223" }}>
              Portal Username
            </div>
            <Input
              value={formData.username}
              prefix={<UserOutlined className="fs-20" />}
              className="py-2 px-3"
              autoComplete="off"
              placeholder="Enter Portal Username/Useremail"
              onChange={(e) => handleChange("username", e.target.value)}
              style={{ background: errorSchema.username ? "#FFF4F4" : "" }}
              status={errorSchema.username ? "error" : ""}
            />
            {errorSchema.username && (
              <span
                style={{
                  color: "#FD5749",
                  marginTop: "5px",
                  textAlign: "left",
                }}
                className="fs-s"
              >
                This field is required.
              </span>
            )}
          </div>

          <div
            className="text-center d-flex flex-column"
            style={{ gap: "5px" }}
          >
            <div className="fs-16 text-start" style={{ color: "#202223" }}>
              Portal Password
            </div>
            <Input
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              style={{ background: errorSchema.password ? "#FFF4F4" : "" }}
              status={errorSchema.password ? "error" : ""}
              prefix={<LockOutlined className="fs-20" />}
              suffix={
                showPassword ? (
                  <EyeInvisibleOutlined
                    className="fs-20"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <EyeOutlined
                    className="fs-20"
                    onClick={() => setShowPassword(true)}
                  />
                )
              }
              className="py-2 px-3"
            />
            {errorSchema.password && (
              <span
                style={{
                  color: "#FD5749",
                  marginTop: "5px",
                  textAlign: "left",
                }}
                className="fs-s"
              >
                {passwordErrorMsg}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* </Drawer> */}
    </>
  );
};

export default EditCredentials;
