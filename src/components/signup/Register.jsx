import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { fetcher } from "../../utils/helper";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { Loader } from "../common/Loader";
import CountrySelect from "../common/CountrySelect";

const Register = () => {
  const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/;

  const [showPassword, setShowPassword] = useState(false);
  const [animation, setAnimation] = useState(true);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaExpired, setRecaptchaExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    company_name: "",
    country: null,
    phone: "",
    email: "",
    password: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [params, setParams] = useState({});
  const [filteredParams, setFilteredParams] = useState({});

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Initialize an object to hold the final decoded params
    const paramsObj = {};

    urlParams.forEach((value, key) => {
      const decodedKey = decodeURIComponent(key);
      const decodedValue = decodeURIComponent(value);

      // Check if the key is something like plateform[0] or plateform[1]
      const arrayKeyMatch = decodedKey.match(/^(.*)\[(\d+)\]$/);
      if (arrayKeyMatch) {
        const baseKey = arrayKeyMatch[1];
        if (!paramsObj[baseKey]) {
          paramsObj[baseKey] = [];
        }
        paramsObj[baseKey].push(decodedValue);
      } else {
        paramsObj[decodedKey] = decodedValue;
      }
    });

    // Set the original params state
    setParams(paramsObj);

    // Filter out specific keys and set the filteredParams state
    const filteredObj = Object.fromEntries(
      Object.entries(paramsObj).filter(
        ([key]) =>
          !["company_name", "invited_user_email", "user_email"].includes(key)
      )
    );

    setFilteredParams(filteredObj);
  }, []);

  const onRecaptchaExpired = () => {
    setRecaptchaToken(null);
    setRecaptchaExpired(true);
  };

  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    setRecaptchaExpired(false);
  };

  useEffect(() => {
    if (params?.company_name) {
      setFormData({
        ...formData,
        company_name: params.company_name,
        email: params.invited_user_email,
      });
    }
  }, [params]);

  useEffect(() => {
    const { name, company_name, email, country, password, phone } = formData;
    setIsFormValid(
      name.trim() !== "" &&
        company_name.trim() !== "" &&
        email.trim() !== "" &&
        emailRegex.test(email) &&
        country !== null &&
        country !== "" &&
        country !== undefined &&
        password.trim() !== "" &&
        recaptchaToken !== "" &&
        !recaptchaExpired &&
        phone.length > 0
    );
  }, [formData, recaptchaToken, recaptchaExpired]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) {
      return;
    }
    formData.domain = "governify";
    let url = "onboardify/newSignup";
    let method = "POST";
    let payload = JSON.stringify({
      ...formData,
      ...(filteredParams?.profile_id && filteredParams),
    });
    try {
      setLoading(true);
      const response = await fetcher(url, method, payload);
      if (response.status) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.log(err, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if(isFormValid) {
        handleSubmit(event);
      }
    }
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
        <div className="cover-container w-100 h-100 p-3">
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
          <div className="form-container mx-auto" style={{ maxWidth: "440px" }}>
            <div>
              <img src="/newlogo.svg" alt="TASC logo" style={{ maxWidth: "220px" }} />
              <div
                className="fs-24 ff-ws mb-3 text-inc-tundora"
                style={{ fontWeight: 600, color: "#434343" }}
              >
                Sign Up
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="form-auth"
              id="registration-custom-form"
              onKeyDown={handleKeyDown}
            >
              <input
                type="text"
                placeholder="Name*"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{ background: "#e8f0fe" }}
                className="input-customer-focus form-control"
              />
              <input
                type="text"
                placeholder="Company name*"
                name="company_name"
                value={formData.company_name || params?.company_name}
                onChange={handleInputChange}
                disabled={params?.company_name}
                style={{
                  background: params?.company_name ? "#ececec" : "#e8f0fe",
                  color: params?.company_name ? "darkgrey" : "",
                }}
                className="input-customer-focus form-control"
              />
              <CountrySelect formData={formData} setFormData={setFormData} />
              <input
                type="text"
                placeholder="+966 011 XXX XXXX*"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={{ background: "#e8f0fe" }}
                className="input-customer-focus form-control"
              />
              <input
                type="text"
                placeholder="Email*"
                name="email"
                value={formData.email || params?.invited_user_email}
                onChange={handleInputChange}
                disabled={params?.invited_user_email}
                style={{
                  background: params?.invited_user_email
                    ? "#ececec"
                    : "#e8f0fe",
                  color: params?.invited_user_email ? "darkgrey" : "",
                }}
                className="input-customer-focus form-control"
              />
              <div className="input-group flex-nowrap" id="password-filled">
                <input
                  className="form-control input-customer-focus"
                  id="input-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{ background: "#e8f0fe" }}
                />
                <span
                  className="input-group-text fs-5 encrypted"
                  style={{ cursor: "pointer", borderRadius: "0 50px 50px 0" }}
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
              <div className="w-100 d-flex justify-content-center">
                <ReCAPTCHA
                  sitekey="6LdmFMQpAAAAAGwLfYZopzckKXOu0obCtpHW0obV"
                  onChange={onRecaptchaChange}
                  onExpired={onRecaptchaExpired}
                />
              </div>
              <button
                id="login-button"
                className="btn btn-newgradiant btn-to-link btn-secondary mt-4 d-flex align-items-center"
                type="button"
                style={{
                  border: "0",
                  borderRadius: "50px",
                  gap: "10px",
                  padding: "15px",
                  display: "flex",
                  alignItems: "center",

                  transition: "0.5s",
                  height: "46px",
                }}
                disabled={!isFormValid}
                onClick={handleSubmit}
              >
                <span
                  style={{
                    fontFamily: "Montserrat!important",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  Sign Up
                </span>
                <span className="icon-btn_track" style={{ marginLeft: "10px" }}>
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
            </form>
            <div className="mt-4">
              <a href="/signin" className="fs-13" style={{ color: "#434343" }}>
                Already have an Account?
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
        <ToastContainer position="bottom-right" className="custom-toast" />
      </div>
    </div>
  );
};

export default Register;
