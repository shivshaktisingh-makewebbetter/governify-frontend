import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { Popover } from "antd";
import React, { useState } from "react";
import { Edit, Trash2 } from "react-feather";
import DeletePortalModal from "./DeletePortalModal";
import EditPortalCredentials from "./EditPortalCredentials";

const CredentialsCard = ({ item, logoAndName, usedPortals, portals, fetchPortalCredentials }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="custom-cred-card">
        <div className="d-flex flex-column" style={{ gap: "10px" }}>
          <div className="text-start fs-16" style={{ color: "#6D7175" }}>
            {logoAndName[0]?.title}
          </div>
          <div
            className="d-flex align-items-center justify-content-between"
            style={{
              gap: "12px",
              borderRadius: "12px",
              padding: "16px",
              border: "1px solid #DFDFDF",
            }}
          >
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              <div
                className=""
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #DFDFDF",
                }}
              >
                <img
                  src={logoAndName[0]?.file_location}
                  alt=""
                  width="42px"
                  height="43px"
                />
              </div>
              <div
                className="d-flex flex-column text-start"
                style={{ gap: "5px" }}
              >
                <span
                  className="fs-18 fw-semibold"
                  style={{ color: "#202223" }}
                >
                  {item.username.length > 12 ? (
                    <Popover content={item.username}>
                      {item.username.slice(0, 12)}...
                    </Popover>
                  ) : (
                    item.username
                  )}
                </span>
                <span>
                  {showPassword
                    ? item.password
                    : "******************"}
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              <Popover content={"View"}>
                <div>
                  {showPassword ? (
                    <EyeInvisibleFilled
                      style={{
                        color: "#059669",
                        padding: "8px",
                        background: "#E1F2ED",
                        borderRadius: "8px",
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <EyeFilled
                      style={{
                        color: "#059669",
                        padding: "8px",
                        background: "#E1F2ED",
                        borderRadius: "8px",
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                </div>
              </Popover>
              <Popover content="Edit">
                <div onClick={() => setOpenDrawer(true)}>
                  <span
                    style={{
                      background: "#EEEEEE",
                      borderRadius: "8px",
                      padding: "8px 9px 9px",
                      cursor: "pointer",
                    }}
                  >
                    <Edit
                      style={{
                        width: "20px",
                        height: "auto",
                        color: "#3D3D3D",
                      }}
                    />
                  </span>
                </div>
              </Popover>
              <Popover content="Delete">
                <div
                  onClick={() => {
                    setOpenDeleteModal(true);
                  }}
                >
                  <span
                    style={{
                      background: "#FDE9E9",
                      borderRadius: "8px",
                      padding: "8px 9px 9px",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2
                      style={{
                        width: "20px",
                        height: "auto",
                        color: "#EF4444",
                      }}
                    />
                  </span>
                </div>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      {openDeleteModal && (
        <DeletePortalModal
          item={item}
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
          fetchPortalCredentials={fetchPortalCredentials}
        />
      )}
      {openDrawer && (
        <EditPortalCredentials
          item={item}
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
          usedPortals={usedPortals}
          portals={portals}
          fetchPortalCredentials={fetchPortalCredentials}
        />
      )}
    </>
  );
};

export default CredentialsCard;
