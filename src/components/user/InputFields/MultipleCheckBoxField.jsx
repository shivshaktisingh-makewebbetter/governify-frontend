import { Checkbox } from "antd";
import React from "react";

const MultipleCheckBoxField = ({
  data,
  item,
  options,
  onChangeCheckBox,
  index,
  formErrorFields,
}) => {
  return (
    <div
      key={data.key}
      style={
        {
          // background: "#0000000A",
          // padding: "10px 10px 0 0",
          // borderRadius: "10px",
        }
      }
    >
      <div style={{ color: "#2C2E38", fontSize: "16px" }}>
        {data.label} {item.required && ""}
      </div>
      <Checkbox.Group
        style={{
          fontSize: "16px",
          borderRadius: "4px",
          padding: "5px 0",
          width: "100%",
          // border: '1px solid red'
        }}
        options={options}
        className="mt-1"
        value={item.value}
        key={data.key}
        onChange={(e) => onChangeCheckBox(e, index)}
      />
      {formErrorFields.includes(item.label) && (
        <span style={{ color: "#FD5749", marginTop: "5px" }} className="fs-s">
          This field is required.
        </span>
      )}
    </div>
  );
};

export default MultipleCheckBoxField;
