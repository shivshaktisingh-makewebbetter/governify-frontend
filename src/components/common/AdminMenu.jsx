import { MenuOutlined, SettingOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import React from "react";
import { useLocation } from "react-router-dom";
import { Logout } from "../../utils/Icons";

const AdminMenu = ({ logoutFunction }) => {
  const location = useLocation();

  const items = [
    {
      label: (
        <a
          href="/admin/settings"
          className={`d-flex align-items-center gap-2 text-decoration-none p-1 fs-s`}
        >
          <SettingOutlined
            className={`fs-18`}
            style={{
              color:
                location.pathname === "/admin/settings" ? "#59C080" : "#454545",
            }}
          />
          <span
            className="fs-6 ff-ws"
            style={{
              color:
                location.pathname === "/admin/settings" ? "#59C080" : "#454545",
            }}
          >
            Settings
          </span>
        </a>
      ),
      key: "settings",
    },
    {
      label: (
        <div
          className={`d-flex align-items-center gap-2 text-decoration-none p-1 fs-s`}
          onClick={() => logoutFunction()}
        >
          <Logout />
          <span className="fs-6 ff-ws" style={{ color: "#EF4444" }}>
            Logout
          </span>
        </div>
      ),
      key: "logout",
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      placement="bottomRight"
      className=""
    >
      <MenuOutlined
        style={{ color: "#59C080", fontSize: "26px" }}
        onClick={(e) => e.preventDefault()}
      />
    </Dropdown>
  );
};

export default AdminMenu;
