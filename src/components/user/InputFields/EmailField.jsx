import { MailOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React from "react";

const EmailField = ({email, setEmail, formErrorFields, emailErrorMessage}) => {
  return (
    <div className="d-flex flex-column" style={{ gap: "5px" }}>
      <div className="fs-16" style={{ color: "#202223" }}>
        Email address
      </div>
      <Input
        value={email}
        placeholder="Enter your email"
        className="py-2 px-3"
        autoComplete="off"
        onChange={(e) => setEmail(e.target.value)}
        prefix={<MailOutlined className="fs-18" style={{ color: "#5C5F62" }} />}
        status={formErrorFields.includes('email') ? "error" : ""}
      />
      {formErrorFields.includes('email') && <span style={{ color: "#FD5749", marginTop: '5px' }} className="fs-s">{emailErrorMessage}</span>}
    </div>
  );
};

export default EmailField;
