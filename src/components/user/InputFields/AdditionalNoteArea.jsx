import React from "react";
import { Input } from 'antd';
const { TextArea } = Input;

const AdditionalNoteArea = ({item, index, handleInputChange, formErrorFields}) => {
  return (
    <div>
      <TextArea
        placeholder="Type here..."
        onChange={(e) => handleInputChange(e, index)}
        autoSize={{
          minRows: 3,
          maxRows: 5,
        }}
        style={{fontFamily: "Graphie-regular" }}
        value={item.value}
        status={formErrorFields.includes(item.label) ? "error" : ""}
      />
      {formErrorFields.includes(item.label) && <span style={{ color: "#FD5749", marginTop: '5px' }} className="fs-s">This field is required.</span>}
    </div>
  );
};

export default AdditionalNoteArea;
