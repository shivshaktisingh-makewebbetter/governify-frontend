import { Modal } from "antd";
import React, { useState } from "react";
import { Loader } from "./Loader";
import { fetcher } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Credentials } from "../../utils/Icons";
import { Mail, Smartphone } from "react-feather";
import MobileVerification from "../PortalCredentials/child/MobileVerification";
import TwoFactorAuthentication from "../PortalCredentials/child/TwoFactorAuthentication";

const ConfirmAccount = ({ showCredentials, setShowCredentials }) => {
  const [error, setError] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [openTwoFAModal, setOpenTwoFAModal] = useState(false);
  const [verificationType, setVerificationType] = useState("");
  const [recipient, setRecipient] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (password.trim() === "") {
      setError(true);
      return;
    }
    let url = "commom-login";
    let method = "POST";
    let payload = JSON.stringify({
      email: sessionStorage.getItem("userEmail"),
      password: password,
      domain: "governify",
    });

    try {
      setLoading(true);
      const response = await fetcher(url, method, payload);
      if (response.status) {
        toast.success("Account verified successfully");
        setTimeout(() => {
          setShowCredentials(false);
          navigate("/portals");
        }, 1000);
      } else {
        toast.error("Password is incorrect.");
      }
    } catch (err) {
      console.log(err, "error");
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Modal
        open={showCredentials}
        centered
        footer={null}
        zIndex={99}
        onCancel={() => setShowCredentials(false)}
      >
        <div
          className="text-center d-flex flex-column p-4"
          style={{ gap: "20px" }}
        >
          <div>
            <Credentials width={56} height={56} fill="#00BF63" />
          </div>
          <div className="d-flex flex-column" style={{ gap: "5px" }}>
            <div className="fs-24 fw-bold" style={{ color: "#202223" }}>
              Two-Factor Authentication
            </div>
            <div className="fs-16" style={{ color: "#6D7175" }}>
              Select a Verification method to access the Portal Credentials
              Management page.
            </div>
            <div
              style={{
                border: "1px solid #DFDFDF",
                padding: "18px",
                gap: "10px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              className="d-flex mt-2 align-items-center"
              onClick={() => {
                setShowCredentials(false);
                setOpenTwoFAModal(true);
                setVerificationType("email");
                setRecipient(sessionStorage.getItem("userEmail"));
              }}
            >
              <Mail
                style={{ color: "#00BF63", width: "32px", height: "24px" }}
              />
              <div
                className="d-flex flex-column text-start"
                style={{ gap: "5px" }}
              >
                <div className="fs-18 fw-semibold" style={{ color: "#202223" }}>
                  via Email
                </div>
                <div style={{ color: "#6D7175" }}>
                  Get a code at {sessionStorage.getItem("userEmail")
                    ? sessionStorage.getItem("userEmail").slice(0, 3) +
                      "***************" +
                      sessionStorage
                        .getItem("userEmail")
                        .slice(
                          sessionStorage.getItem("userEmail").length - 9,
                          sessionStorage.getItem("userEmail").length
                        )
                    : ""}
                </div>
              </div>
            </div>
            <div
              style={{
                border: "1px solid #DFDFDF",
                padding: "18px",
                gap: "10px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              className="d-flex mt-2 align-items-center"
              onClick={() => {
                setShowCredentials(false);
                setOpenTwoFAModal(true);
                setVerificationType("sms");
                setRecipient(sessionStorage.getItem("phoneNumber"));
              }}
            >
              <Smartphone
                style={{ color: "#00BF63", width: "32px", height: "24px" }}
              />
              <div
                className="d-flex flex-column text-start"
                style={{ gap: "5px" }}
              >
                <div className="fs-18 fw-semibold" style={{ color: "#202223" }}>
                  via Mobile Number
                </div>
                <div style={{ color: "#6D7175" }}>
                  Get a code at{" "}
                  {sessionStorage.getItem("phoneNumber")
                    ? sessionStorage.getItem("phoneNumber").slice(0, 3) +
                      "********" +
                      sessionStorage
                        .getItem("phoneNumber")
                        .slice(
                          sessionStorage.getItem("phoneNumber").length - 2,
                          sessionStorage.getItem("phoneNumber").length
                        )
                    : ""}
                </div>
              </div>
              {/* <div
                className="fs-s"
                style={{ color: "#EF4444", marginLeft: "auto" }}
              >
                Unverified
              </div> */}
            </div>
          </div>
        </div>
      </Modal>
      <MobileVerification
        setOpenOtpModal={setOpenOtpModal}
        open={openOtpModal}
      />
      <TwoFactorAuthentication
        setOpenTwoFAModal={setOpenTwoFAModal}
        setShowCredentials={setShowCredentials}
        open={openTwoFAModal}
        verificationType={verificationType}
        setVerificationType={setVerificationType}
        recipient={recipient}
      />
    </>
  );
};

export default ConfirmAccount;
