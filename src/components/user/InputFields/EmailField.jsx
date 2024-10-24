
import { Input } from "antd";
import React from "react";
import { MailIcon } from "../../../utils/Icons";

const EmailField = ({email, setEmail, formErrorFields, emailErrorMessage}) => {
  return (
    <div className="d-flex flex-column" style={{ gap: "5px" }}>
      <div className="fs-16" style={{ color: "#202223" }}>
        Email address
      </div>
      <Input
        value={email}
        placeholder="Enter your email"
        className="py-2 px-3 email-inp" 
        autoComplete="off"
        onChange={(e) => setEmail(e.target.value)}
        prefix={<MailIcon width={20} height={16} />}
        status={formErrorFields.includes('email') ? "error" : ""}
        style={{fontFamily: "Graphie-regular"}}
      />
      {formErrorFields.includes('email') && <span style={{ color: "#FD5749", marginTop: '5px' }} className="fs-s">{emailErrorMessage}</span>}
    </div>
  );
};

export default EmailField;
