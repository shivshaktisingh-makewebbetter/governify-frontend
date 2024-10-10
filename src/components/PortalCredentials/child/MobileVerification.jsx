import { Modal } from "antd";
import React, { useRef, useState } from "react";
import { Smartphone } from "react-feather";
import OtpInput from "./OtpInput";

const MobileVerification = ({ open, setOpenOtpModal }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState(false);
  const inputRefs = useRef([]);

  const handleChangeOtp = (value, index) => {
    if (value.match(/^\d$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      } else if (otp[index] !== "") {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = () => {
    let valid = true;
    otp.forEach((item) => {
      if (item === "") {
        valid = false;
      }
    });

    if (!valid) {
      setError(true);
      return;
    } else {
      setError(false);
    }
  };

  return (
    <Modal
      open={open}
      centered
      onCancel={() => setOpenOtpModal(false)}
      footer={null}
    >
      <div
        className="d-flex flex-column align-items-center text-center pt-4 pb-2 px-2"
        style={{ gap: "20px" }}
      >
        <Smartphone
          style={{ color: "#00BF63", width: "48px", height: "36px" }}
        />
        <div className="d-flex flex-column" style={{ gap: "20px" }}>
          <div className="d-flex flex-column" style={{ gap: "5px" }}>
            <div className="fs-24 fw-bold" style={{ color: "#202223" }}>
              Verify Mobile Number
            </div>
            <div className="fs-16" style={{ color: "#6D7175" }}>
              Enter your 6-digit code numbers sent to you at{" "}
              {sessionStorage.getItem("phoneNumber")}
            </div>
          </div>
          <div className="d-flex justify-content-between">
            {Array(6)
              .fill("")
              .map((_, index) => {
                return (
                  <OtpInput
                    otp={otp}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    index={index}
                    setOtp={setOtp}
                    handleChangeOtp={handleChangeOtp}
                    handleKeyDown={handleKeyDown}
                    error={error}
                  />
                );
              })}
          </div>
          <div className="d-flex flex-column" style={{ gap: "5px" }}>
            <div style={{ color: "#6D7175" }} className="fs-16">
              Didn't receive a verification code?
            </div>
            <span
              className="fs-16"
              style={{ color: "#059669", cursor: "pointer" }}
            >
              Resend Code
            </span>
          </div>
          <div className="w-100">
            <button
              style={{
                background: "#00BF63",
                color: "#fff",
                borderRadius: "8px",
                gap: "5px",
                padding: "10px 20px",
              }}
              className={`border-0 d-flex fs-16 fw-semibold align-items-center w-100 justify-content-center`}
              onClick={() => handleSubmit()}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MobileVerification;
