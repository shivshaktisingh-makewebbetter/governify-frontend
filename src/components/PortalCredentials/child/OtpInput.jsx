import { Input } from "antd";
import React from "react";

const OtpInput = ({ otp, index, inputRef, handleChangeOtp, handleKeyDown, error }) => {
  return (
    <Input
      key={index}
      type="number"
      className={`px-3 py-3 text-center otpInput fs-20`}
      placeholder="-"
      style={{ width: "15%", color: '#202223' }}
      ref={inputRef}
      value={otp[index]}
      status={error ? "error" : ''}
      onChange={(e) => {
        handleChangeOtp(e.target.value, index);
      }}
      onKeyDown={(e) => handleKeyDown(e, index)}
    />
  );
};

export default OtpInput;
