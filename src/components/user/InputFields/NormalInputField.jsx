import { Input } from "antd";
import React from "react";

const NormalInputField = ({ item, index, handleInputChange, formErrorFields }) => {

    // console.log('item', item);

  return (
    <>
    <Input
      // value={formData.username}
      name={item.label.replace(" ", "_")}
      placeholder={item.label}
      className="py-2 px-3"
      autoComplete="off"
      onChange={(e) => handleInputChange(e, index)}
      style={{fontFamily: "Graphie-regular" }}
      status={formErrorFields.includes(item.label) ? "error" : ""}
      // prefix={<MailOutlined className="fs-18" style={{ color: "#5C5F62" }} />}
    />
    {formErrorFields.includes(item.label) && <span style={{ color: "#FD5749", marginTop: '10px' }} className="fs-s">This field is required.</span>}
    </>
  );
};

export default NormalInputField;
