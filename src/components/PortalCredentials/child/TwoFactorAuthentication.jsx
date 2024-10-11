import { Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import OtpInput from "./OtpInput";
import { Mail, Smartphone } from "react-feather";
import { fetcher } from "../../../utils/helper";
import { Loader } from "../../common/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TwoFactorAuthentication = ({
  open,
  setOpenTwoFAModal,
  setShowCredentials,
  verificationType,
  setType = null,
  credtype = null,
  setVerificationType,
  recipient,
}) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

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

  const handleSubmit = async () => {
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
    setLoadingConfirm(true);
    try {
      const res = await fetcher(
        "governify/customer/verifyOTP",
        "POST",
        JSON.stringify({
          code: otp.join(""),
          recipient: recipient,
        })
      );
      if (res.status) {
        setErrMsg("");
        setError(false);
        sessionStorage.removeItem('otp');
        toast.success(res.message);
        localStorage.setItem('verified', true);
        if(setType) {
          setTimeout(() => {
            setOpenTwoFAModal(false);
            setShowCredentials(false);
            setOtp("");
            setType(credtype);
          },2000)
        } else {

          setTimeout(() => {
            setOpenTwoFAModal(false);
            navigate('/portals');
          },2000)
        }
      } else {
        setErrMsg(
          "This is a wrong or expired code. Try to resend another code."
        );
        setError(true);
      }
    } catch (error) {
      console.log("error");
    } finally {
      setLoadingConfirm(false);
    }
  };

  const sendVerificationAgain = async () => {
    setErrMsg('');
    setError(false);
    setLoadingConfirm(true);
    
    try {
      const res = await fetcher(
        "governify/customer/sendOTP",
        "POST",
        JSON.stringify({ channel: verificationType, recipient: recipient })
      );
  
      if (res.status) {
        sessionStorage.setItem("otp", true);
        toast.success(res.message);
      }
  
      console.log("res", res);
    } catch (error) {
      
    } finally {
      setLoadingConfirm(false);
    }
  };

  useEffect(() => {
    const sendVerification = async () => {
      setErrMsg('');
      setError(false);
      const res = await fetcher(
        "governify/customer/sendOTP",
        "POST",
        JSON.stringify({ channel: verificationType, recipient: recipient })
      );
  
      if (res.status) {
        sessionStorage.setItem("otp", true);
        
      }
  
      console.log("res", res);
    };
    if (sessionStorage.getItem('otp') ==  null && open) {
      sendVerification();
    }
  }, [open]);

  return (
    <>
      {/* {loadingConfirm && <Loader />} */}
      {/* <Loader /> */}
      <Modal
        open={open}
        centered
        onCancel={() => {
          setOpenTwoFAModal(false);
          sessionStorage.removeItem("otp");
        }}
        footer={null}
        zIndex={99}
      >
         {loadingConfirm && <Loader />}
        <div
          className="d-flex flex-column align-items-center text-center pt-4 pb-2 px-2"
          style={{ gap: "20px" }}
        >
          {verificationType === "email" ? (
            <Mail style={{ color: "#00BF63", width: "48px", height: "36px" }} />
          ) : (
            <Smartphone
              style={{ color: "#00BF63", width: "48px", height: "36px" }}
            />
          )}
          <div className="d-flex flex-column" style={{ gap: "20px" }}>
            <div className="d-flex flex-column" style={{ gap: "5px" }}>
              <div className="fs-24 fw-bold" style={{ color: "#202223" }}>
                Two-Factor Authentication
              </div>
              <div className="fs-16" style={{ color: "#6D7175" }}>
                Enter your 6-digit code numbers sent to you at{" "}
                {verificationType === "email"
                  ? sessionStorage.getItem("userEmail")
                  : sessionStorage.getItem("phoneNumber")}
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
              {errMsg && <div style={{color: "#EF4444"}}>{errMsg}</div>}
              {successMsg && <div style={{color: "#059669"}}>{successMsg}</div>}
              <div style={{ color: "#6D7175" }} className="fs-16">
                Didn't receive a verification code?
              </div>
              <span
                className="fs-16 fw-semibold"
                style={{ color: "#059669", cursor: "pointer" }}
                onClick={() => sendVerificationAgain()}
              >
                Resend Code
              </span>
            </div>
            <div>
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
            <span
              className="fs-16 fw-semibold"
              style={{ color: "#059669", cursor: "pointer" }}
              onClick={() => {
                setOpenTwoFAModal(false);
                setShowCredentials(true);
                setVerificationType("");
              }}
            >
              Try another method
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TwoFactorAuthentication;
