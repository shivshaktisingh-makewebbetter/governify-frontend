import { CloseOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import React from "react";
import { Trash2 } from "react-feather";
import { useMediaQuery } from "react-responsive";

const DeletPortalModal = ({open, setOpenDeleteModal, editPortalData, setEditPortalData, deletePortal}) => {
  // changed modal width based on screen sizes...
  const isLargeScreen = useMediaQuery({ query: "(min-width: 1200px)" });
  const isMediumScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 767px)" });

  let modalWidth = "650px";
  if (isLargeScreen) {
    modalWidth = "650px";
  } else if (isMediumScreen) {
    modalWidth = "650px";
  } else if (isSmallScreen) {
    modalWidth = "95%";
  }
  return (
    <Modal
      maxWidth={modalWidth}
      width={modalWidth}
      open={open}
      closeIcon={
        <CloseOutlined className="fs-18" style={{ color: "#202223" }} />
      }
      title={
        <span className="fs-24" style={{ color: "#202223" }}>
          Delete these portal credentials
        </span>
      }
      zIndex={99}
      centered
      footer={
        <div
          className="d-flex justify-content-between"
          style={{ height: "45px" }}
        >
          <button
            style={{
              padding: "5px 20px",
              border: "none",
              background: "#858B9317",
              color: "#1C2026",
              borderRadius: "8px",
            }}
            className="fs-18 fw-semibold"
            onClick={() => {
              setEditPortalData("");
              setOpenDeleteModal(false);
            }}
          >
            Cancel
          </button>
          <button
            style={{
              padding: "5px 20px",
              border: "none",
              background: "#EF4444",
              color: "#FFFFFF",
              borderRadius: "8px",
            }}
            className="fs-18 fw-semibold"
            onClick={() => deletePortal()}
          >
            Yes, Delete
          </button>
        </div>
      }
      onCancel={() => {
        setEditPortalData("");
        setOpenDeleteModal(false);
      }}
    >
      <div
        className="p-4 d-flex flex-column align-items-center"
        style={{ gap: "10px" }}
      >
        <div>
          <Trash2
            style={{
              width: "40px",
              height: "auto",
              color: "#EF4444",
            }}
          />
        </div>
        <div className="custom-cred-card" style={{ maxWidth: "100%" }}>
          <div className="d-flex flex-column" style={{ gap: "10px" }}>
            <div className="text-center fs-16" style={{ color: "#6D7175" }}>
              <img
                src={editPortalData.image}
                alt={editPortalData.name}
                width="64px"
                height="64px"
              />
            </div>
            <div className="text-center fs-20">{editPortalData.name}</div>
          </div>
        </div>
        <div
          className="fw-semibold fs-20"
          style={{ color: "#202223", lineHeight: 1 }}
        >
          Are you sure you want to delete this portal?
        </div>
        <div className="fs-16" style={{ color: "#6D7175" }}>
          Please confirm if you wish to proceed with the deletion.
        </div>
      </div>
    </Modal>
  );
};

export default DeletPortalModal;
