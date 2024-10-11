import { PlusOutlined } from "@ant-design/icons";
import React from "react";

const AddPortalButton = ({setOpenAddPortalDrawer}) => {
  return (
    <button
      style={{
        background: "#00BF63",
        color: "#fff",
        maxWidth: "224px",
        borderRadius: "8px",
        gap: "5px",
        padding: "10px 20px",
      }}
      className={`border-0 d-flex align-items-center justify-content-center`}
      onClick={() => setOpenAddPortalDrawer(true)}
    >
      <PlusOutlined className="fs-semibold fs-16" />
      <span className="fs-semibold fs-16">Add Portal Credentials</span>
    </button>
  );
};

export default AddPortalButton;
