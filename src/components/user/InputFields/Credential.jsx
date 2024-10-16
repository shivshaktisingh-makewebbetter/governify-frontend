import { EyeFilled, EyeInvisibleFilled, MoreOutlined } from "@ant-design/icons";
import { Dropdown, Popover } from "antd";
import React, { useState } from "react";
import { Edit, Trash2 } from "react-feather";
import DeletePortalModal from "../../PortalCredentials/child/DeletePortalModal";
import ConfirmAccount from "../../common/ConfirmAccount";
// import EditCredentials from "./EditCredentials";

const Credential = ({ item, logoAndName, setType, fetchPortalCredentials }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const items = [
    {
      label: <span onClick={() => setShowPassword(!showPassword)}>View</span>,
      key: "view",
    },
    {
      label: (
        <span
          onClick={() => {
            if (localStorage.getItem("verified") == "true") {
              setType("edit");
            } else {
              setShowCredentials(true);
            }
          }}
        >
          Edit
        </span>
      ),
      key: "edit",
    },
    {
      label: <span onClick={() => setOpenDeleteModal(true)}>Delete</span>,
      key: "delete",
    },
  ];

  return (
    <>
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
          <div className="d-flex flex-column text-start" style={{ gap: "5px" }}>
            <span className="fs-18 fw-semibold" style={{ color: "#202223" }}>
              {item.username.length > 15 ? (
                <Popover content={item.username}>
                  {item.username.slice(0, 15)}...
                </Popover>
              ) : (
                item.username
              )}
            </span>
            <span>{showPassword ? item.password : "******************"}</span>
          </div>
        </div>
        <div
          className="align-items-center cred-grp-btn"
          style={{ gap: "10px" }}
        >
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
            <div
              onClick={() => {
                console.log(localStorage.getItem("verified") === "true");
                if (localStorage.getItem("verified") == "true") {
                  setType("edit");
                } else {
                  setShowCredentials(true);
                }
              }}
            >
              <span
                style={{
                  background: "#EEEEEE",
                  borderRadius: "8px",
                  padding: "9px 9px 11px",
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
                  padding: "9px 9px 11px",
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
        <div className="more-action-btn">
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="bottomRight"
            className=""
          >
            <MoreOutlined
              style={{
                color: "",
                fontSize: "24px",
                fontWeight: "700",
                background: "#EEEEEE",
                borderRadius: "8px",
                padding: "8px 9px 9px",
                cursor: "pointer",
              }}
              onClick={(e) => e.preventDefault()}
            />
          </Dropdown>
        </div>
      </div>
      {openDeleteModal && (
        <DeletePortalModal
          item={item}
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
          fetchPortalCredentials={fetchPortalCredentials}
          showCredentials={false}
        />
      )}
      {/* {openDrawer && (
        <EditCredentials
          item={item}
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
          portals={logoAndName}
          fetchPortalCredentials={fetchPortalCredentials}
        />
      )} */}
      <ConfirmAccount
        showCredentials={showCredentials}
        credtype="edit"
        setShowCredentials={setShowCredentials}
        setType={setType}
      />
    </>
  );
};

export default Credential;
