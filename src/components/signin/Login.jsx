import React, { useEffect, useState } from "react";
import { fetcher, isTokenValid } from "../../utils/helper";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader } from "../common/Loader";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [animation, setAnimation] = useState(true);
  const [userDetails, setUserDetails] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    let url = "commom-login";
    let method = "POST";
    let payload = JSON.stringify({
      email: userDetails.email,
      password: userDetails.password,
      domain: window.location.origin,
    });

    try {
      setLoading(true);
      const response = await fetcher(url, method, payload);
      if (response.status) {
        toast.success("Logged In Successfull.");
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("role", response.role);
        sessionStorage.removeItem("random_user");
        if (response.role === "customer") {
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          navigate("/admin");
        }
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.log(err, "error");
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUserDetails = (e, filter) => {
    setUserDetails({ ...userDetails, [filter]: e.target.value });
  };

  const checkEmailIsFilledAndValid = () => {
    const email = userDetails.email;
    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/;
    if (email && emailRegex.test(email)) {
      return false;
    }
    return true;
  };

  const checkPasswordIsFilledValid = () => {
    const password = userDetails.password;
    if (password.length > 5) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    let role = sessionStorage.getItem("role");
    if (role === "customer") {
      navigate("/");
    }
    if (role === "superAdmin") {
      navigate("/admin");
    }
  }, []);

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
          <div className="">
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
            {/* <div class="d-flex justify-content-center">
        <div class="alert alert-{{ status }}" style={{maxWidth:"400px"}}>
        </div>
      </div> */}
            <div
              className="form-container mx-auto"
              style={{ maxWidth: "440px" }}
            >
              <div>
                <div>
                  {/* <span className="inc-tasc-gradient-btn">TASC</span><span className="fs-48 ff-ws"> 360</span> */}
                  <img
                    src="/tasc.svg"
                    alt="TASC logo"
                    style={{ maxWidth: "220px" }}
                  />
                </div>
                <div
                  className="fs-24 ff-ws mb-2 text-inc-tundora fw-600"
                  style={{ color: "#434343" }}
                >
                  Sign In
                </div>
              </div>
              <div className="form-auth">
                <input
                  placeholder="Email"
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => handleChangeUserDetails(e, "email")}
                  style={{ background: "#e8f0fe" }}
                  className="input-customer-focus form-control"
                />
                <div className="input-group flex-nowrap" id="password-filled">
                  <input
                    className="form-control input-customer-focus"
                    id="input-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={userDetails.password}
                    onChange={(e) => handleChangeUserDetails(e, "password")}
                    style={{ background: "#e8f0fe" }}
                  />
                  <span
                    className="input-group-text fs-5 encrypted eye-icon-container"
                    style={{
                      cursor: "pointer",
                      borderRadius: "0 50px 50px 0px",
                    }}
                  >
                    {showPassword ? (
                      <i
                        className="bi bi-eye-fill"
                        onClick={() => setShowPassword(false)}
                      ></i>
                    ) : (
                      <i
                        className="bi bi-eye-slash-fill"
                        onClick={() => setShowPassword(true)}
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
                    opacity:
                      checkEmailIsFilledAndValid() ||
                      checkPasswordIsFilledValid()
                        ? "0.65"
                        : "",
                  }}
                  onClick={handleSubmit}
                  disabled={
                    checkEmailIsFilledAndValid() || checkPasswordIsFilledValid()
                  }
                >
                  <span
                    style={{
                      fontFamily: "Montserrat!important",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    Sign In
                  </span>
                  <span
                    className="icon-btn_track"
                    style={{ marginLeft: "10px" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-right-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                    </svg>
                  </span>
                </button>

                <div className="d-flex justify-content-between align-items-start w-100 mt-2">
                  <a
                    href="/forget-password"
                    className="fs-13"
                    style={{ color: "#434343" }}
                  >
                    Forgot Password?
                  </a>
                  <a
                    href="/signup"
                    className="fs-13"
                    style={{ color: "#434343" }}
                  >
                    Create New Account?
                  </a>
                </div>
                <div
                  className="mt-3 fs-13 ff-ws text-inc-tundora"
                  style={{ color: "grey" }}
                >
                  <span
                    className="mt-3 fs-13 ff-ws text-inc-tundora"
                    style={{ margin: "3px 0px" }}
                  >
                    {" "}
                    Powered by TASC Outsourcing®
                  </span>
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

export default Login;
