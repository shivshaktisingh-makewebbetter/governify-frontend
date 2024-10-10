import {
  FileTextOutlined,
  MenuOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import React from "react";
import { CheckListIcon, Credentials, Logout } from "../../utils/Icons";
import { useLocation } from "react-router-dom";

const CustomerMenu = ({ logoutFunction, setShowCredentials }) => {
  const location = useLocation();

  const items = [
    {
      label: (
        <a
          href="/"
          className={`d-flex align-items-center gap-2 text-decoration-none p-1 fs-s`}
        >
          <PlusOutlined
            className={`fs-18`}
            style={{ color: location.pathname === "/" ? "#59C080" : "#454545" }}
          />
          <span
            className="fs-6 ff-ws"
            style={{ color: location.pathname === "/" ? "#59C080" : "#454545" }}
          >
            Service Request
          </span>
        </a>
      ),
      key: "home",
    },
    {
      label: (
        <a
          href="/track-request"
          className={`d-flex align-items-center gap-2 text-decoration-none p-1 fs-s`}
        >
          <CheckListIcon
            fill={
              location.pathname === "/track-request" ? "#59C080" : "#454545"
            }
          />
          <span
            className="fs-6 ff-ws"
            style={{
              color:
                location.pathname === "/track-request" ? "#59C080" : "#454545",
            }}
          >
            Request tracking
          </span>
        </a>
      ),
      key: "track-request",
    },
    {
      label: (
        <a
          href="/reports"
          className={`d-flex align-items-center gap-2 text-decoration-none p-1 fs-s`}
        >
          <FileTextOutlined
            className={`fs-18`}
            style={{
              color: location.pathname === "/reports" ? "#59C080" : "#454545",
            }}
          />
          <span
            className="fs-6 ff-ws"
            style={{
              color: location.pathname === "/reports" ? "#59C080" : "#454545",
            }}
          >
            Insights and Reports
          </span>
        </a>
      ),
      key: "reports",
    },
    {
      label: (
        <div
          className={`d-flex align-items-center gap-2 text-decoration-none p-1 fs-s`}
          onClick={() => {
            if (location.pathname === "/portals") {
              return;
            } else {
              setShowCredentials(true);
            }
          }}
        >
          <Credentials
            fill={location.pathname === "/portals" ? "#59C080" : "#454545"}
            width="20px"
            height="20px"
          />
          <span
            className="fs-6 ff-ws"
            style={{
              color: location.pathname === "/portals" ? "#59C080" : "#454545",
            }}
          >
            Credentials Management
          </span>
        </div>
      ),
      key: "portal-credentials",
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

export default CustomerMenu;
