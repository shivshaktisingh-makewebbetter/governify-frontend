import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Input, Modal } from "antd";
import React, { useState } from "react";
import { Loader } from "./Loader";
import { fetcher } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ConfirmAccount = ({ showCredentials, setShowCredentials }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error,setError] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async() => {
    if(password.trim() === "") {
      setError(true);
      return;
    }
    let url = "commom-login";
    let method = "POST";
    let payload = JSON.stringify({
      email: sessionStorage.getItem('userEmail'),
      password: password,
      domain: "governify",
    });

    try {
      setLoading(true);
      const response = await fetcher(url, method, payload);
      if (response.status) {
        // toast.success("Logged In Successfull.");
        // sessionStorage.setItem("token", response.token);
        // sessionStorage.setItem("role", response.role);
        toast.success('Account verified successfully')
        setTimeout(() => {
          setShowCredentials(false);
          navigate('/portals')
        },1000)
      } else {
        toast.error('Password is incorrect.');
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
        closeIcon={null}
        zIndex={99}
        onCancel={() => setShowCredentials(false)}
      >
        <div
          className="text-center d-flex flex-column pt-3 pb-2"
          style={{ gap: "20px" }}
        >
          <div
            className="text-center d-flex flex-column"
            style={{ gap: "10px" }}
          >
            <div className="fw-bold fs-4">Enter your account password</div>
            <div className="fs-16" style={{ color: "#928f8f" }}>
              Please enter your account password to access your Portal
              Credentials Management page
            </div>
          </div>
          <div
            className="text-center d-flex flex-column"
            style={{ gap: "5px" }}
          >
            <div className="fs-16 text-start" style={{ color: "#202223" }}>
              Email address
            </div>
            <Input
              value={sessionStorage.getItem("userEmail")}
              disabled
              prefix={<MailOutlined className="fs-20" />}
              className="py-2 px-3"
              autoComplete="off"
            />
          </div>

          <div
            className="text-center d-flex flex-column"
            style={{ gap: "5px" }}
          >
            <div className="fs-16 text-start" style={{ color: "#202223" }}>
              Password
            </div>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              status={error ? 'error' : ''}
              prefix={<LockOutlined className="fs-20" />}
              suffix={
                showPassword ? (
                  <EyeInvisibleOutlined
                    className="fs-20"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <EyeOutlined
                    className="fs-20"
                    onClick={() => setShowPassword(true)}
                  />
                )
              }
              className="py-2 px-3"
            />
          </div>
          <div className="text-end">
            <span style={{ color: "#008080" }} className="fs-16 fw-semibold">
              Forgot Password?
            </span>
          </div>
          <div>
            <button
              style={{ background: "#00BF63", color: "#fff" }}
              className="w-100 py-2 border-0 rounded font-semibold fs-16"
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmAccount;
