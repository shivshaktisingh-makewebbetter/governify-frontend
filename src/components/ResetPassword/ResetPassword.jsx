import React, { useEffect, useState } from "react";
import { fetcher } from "../../utils/helper";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "../common/Loader";

 const ResetPassword = () => {
  const location = useLocation();
  const queryParameters = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const [animation, setAnimation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [userDetails, setUserDetails] = useState({
    password: "",
    newPassword: "",
  });

  const buttonDisable = () => {
    if (userDetails.password === "") {
      return true;
    } else if (userDetails.newPassword === "") {
      return true;
    } else if (userDetails.newPassword !== userDetails.password) {
      return true;
    }
    return false;
  };

  const handleSubmit = async () => {
    let url = `/common/updateNewPassword`;
    let method = "POST";
    let payload = JSON.stringify({
      password: userDetails.password,
      conf_password: userDetails.newPassword,
      token: queryParameters.get("token"),
    });
    try {
      setLoading(true);
      const response = await fetcher(url, method, payload);
      if (response.status) {
        toast.success(
          "Password changed Successfully, Redirecting to the login Page."
        );
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.log(err, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUserDetails = (e, filter) => {
    setUserDetails({ ...userDetails, [filter]: e.target.value });
  };

  useEffect(() => {
    setTimeout(() => {
      setAnimation(false);
    }, 300);
  }, []);
  return (
    <div className="inc-auth-container">
      <div className="container auth-container text-center">
        {loading && <Loader />}
        <div className="cover-container w-100 h-100 pb-2 ">
          <div>
            <div className="animation-container" style={{ minHeight: "90px" }}>
              <div
                className={`header-heading1 ${
                  animation ? "animation-content" : ""
                } ff-ws `}
                style={{
                  transition: "transform 1s ease, opacity 2s ease",
                  fontSize: "50px",
                  fontWeight: "500",
                }}
              >
                Governify
              </div>
            </div>
            <div className="form-container mx-auto">
              <div>
                <div>
                  <img
                    src="/tasc.svg"
                    alt="TASC logo"
                    style={{ maxWidth: "220px" }}
                  />
                </div>
                <div className="fs-24 ff-ws mb-2 text-inc-tundora fw-600">
                  Enter New Password
                </div>
              </div>
              <div class="form-auth">
                <div class="input-group flex-nowrap" id="password-filled">
                  <input
                    className="form-control"
                    id="input-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={userDetails.password}
                    onChange={(e) => handleChangeUserDetails(e, "password")}
                  />
                  <span
                    class="input-group-text fs-5 encrypted"
                    style={{
                      cursor: "pointer",
                      borderRadius: "0 50px 50px 0px",
                    }}
                  >
                    {showPassword ? (
                      <i
                        class="bi bi-eye-fill"
                        onClick={() => setShowPassword(false)}
                      ></i>
                    ) : (
                      <i
                        class="bi bi-eye-slash-fill"
                        onClick={() => setShowPassword(true)}
                      ></i>
                    )}
                  </span>
                </div>
                <div class="input-group flex-nowrap" id="password-filled">
                  <input
                    className="form-control"
                    id="input-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="confirm password"
                    name="password"
                    value={userDetails.newPassword}
                    onChange={(e) => handleChangeUserDetails(e, "newPassword")}
                  />
                  <span
                    class="input-group-text fs-5 encrypted"
                    style={{
                      cursor: "pointer",
                      borderRadius: "0 50px 50px 0px",
                    }}
                  >
                    {showNewPassword ? (
                      <i
                        class="bi bi-eye-fill"
                        onClick={() => setShowNewPassword(false)}
                      ></i>
                    ) : (
                      <i
                        class="bi bi-eye-slash-fill"
                        onClick={() => setShowNewPassword(true)}
                      ></i>
                    )}
                  </span>
                </div>
                <button
                  id="login-button"
                  className="btn btn-gradiant btn-to-link btn-secondary mt-4 d-flex align-items-center"
                  type="button"
                  style={{
                    border: "0",
                    borderRadius: "50px",
                    gap: "10px",
                    padding: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.5s",
                    height: "46px",
                  }}
                  disabled={buttonDisable()}
                  onClick={handleSubmit}
                >
                  <span className="fw-bold">Change password</span>
                  <span
                    className="icon-btn_track"
                    style={{ marginLeft: "10px" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-arrow-right-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                    </svg>
                  </span>
                </button>
                <div className="d-flex justify-content-center w-100 mt-2">
                  <a href="/signin" className="text-inc-tundora fs-13">
                    Back to login?
                  </a>
                </div>
                <div
                  className="mt-3 fs-13 ff-ws text-inc-tundora"
                  style={{ color: "grey" }}
                >
                  Powered by TASC Outsourcing®
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
};

export default ResetPassword;

