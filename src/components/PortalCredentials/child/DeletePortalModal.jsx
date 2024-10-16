import { CloseOutlined } from "@ant-design/icons";
import { Modal, Popover } from "antd";
import React, { useState } from "react";
import { Trash2 } from "react-feather";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import { fetcher } from "../../../utils/helper";
import { Loader } from "../../common/Loader";

const DeletePortalModal = ({
  item,
  openDeleteModal,
  setOpenDeleteModal,
  fetchPortalCredentials,
  showCredentials = true,
}) => {
  const [loading, setLoading] = useState(false);

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

  const handleDeletePortal = async () => {
    setLoading(true);
    try {
      const response = await fetcher(
        `governify/customer/deletePortalCredentials/${item.id}`,
        "DELETE"
      );
      if (response.status) {
        toast.success(response.message);
        await fetchPortalCredentials();
        setOpenDeleteModal(false);
      }
    } catch (error) {
      toast.error("Some error occurred!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Modal
        // style={{ maxWidth: "650px" }}
        maxWidth={modalWidth}
        width={modalWidth}
        open={openDeleteModal}
        closeIcon={
          <CloseOutlined className="fs-18" style={{ color: "#202223" }} />
        }
        title={
          <span className="fs-24" style={{ color: "#202223" }}>
            Delete these portal credentials
          </span>
        }
        centered
        zIndex={99}
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
              onClick={() => setOpenDeleteModal(false)}
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
              onClick={() => handleDeletePortal()}
            >
              Yes, Delete
            </button>
          </div>
        }
        onCancel={() => setOpenDeleteModal(false)}
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
            {showCredentials && (
              <div className="d-flex flex-column" style={{ gap: "10px" }}>
                <div className="text-center fs-16" style={{ color: "#6D7175" }}>
                  {item.name}
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
                  <div
                    className="d-flex align-items-center"
                    style={{ gap: "10px" }}
                  >
                    <div
                      className=""
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #DFDFDF",
                      }}
                    >
                      <img
                        src="/assets/mistry.png"
                        alt="mistryLogo"
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
                        {modalWidth == "95%" ? (
                          <Popover content={item.username}>
                            {item.username.slice(0, 9) + "..."}
                          </Popover>
                        ) : (
                          item.username
                        )}
                      </span>
                      <span>******************</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            className="fw-semibold fs-20"
            style={{ color: "#202223", lineHeight: 1 }}
          >
            Are you sure you want to delete this portal Credentials?
          </div>
          <div className="fs-16" style={{ color: "#6D7175" }}>
            Please confirm if you wish to proceed with the deletion.
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeletePortalModal;
