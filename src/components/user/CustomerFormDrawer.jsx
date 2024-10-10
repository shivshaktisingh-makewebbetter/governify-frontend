import { CloseOutlined, LockOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Drawer, Flex, Popover } from "antd";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import MobileNumberField from "./InputFields/MobileNumberField";
import EmailField from "./InputFields/EmailField";
import FileInput from "./InputFields/FileInput";
import AdditionalNoteArea from "./InputFields/AdditionalNoteArea";
import Credential from "./InputFields/Credential";
import EditCredentials from "./InputFields/EditCredentials";
import { fetcher } from "../../utils/helper";
import { toast } from "react-toastify";
import { Loader } from "../common/Loader";
import AddCredentials from "./InputFields/AddCredentials";
import NormalInputField from "./InputFields/NormalInputField";
import axios from "axios";

const CustomerFormDrawer = ({
  open,
  formData,
  serviceTitle,
  portalId,
  portalImageAndLogo,
  portalCredentials,
  fetchPortalCredentials,
  setOpen,
  categoryName,
  handleOpen,
  formSubmitted,
  setFormSubmitted,
  categoryId,
  selectedFormId,
  selectedServiceId,
}) => {
  const data = JSON.parse(sessionStorage.getItem("settings")) || {
    image:
      "https://onboardify.tasc360.com/uploads/governify/1718271730_1718195689_Products%20Logo%20(1).png",
    site_bg: "#ffffff",
    button_bg: "#5ac063",
    banner_bg: "#5ac063",
    banner_content:
      "Hire an attitude, not just experience and qualification. Greg Savage.",
    header_bg: "#f7f7f7",
    head_title_color: "#5ac063",
    form_description:
      "Please fill out the form to proceed with the needed action to provide you with this service",
  };

  const [formDetails, setFormDetails] = useState([]);
  const [formErrorFields, setFormErrorFields] = useState([]);
  const [isSingleSelectEnable, setSingleSelect] = useState({
    enable: false,
    value: [],
  });
  const [isUploadEnable, setIsUploadEnable] = useState({
    enable: false,
    required: false,
  });

  // console.log('portal', portalCredentials,portalImageAndLogo);

  const [loading, setLoading] = useState(false);
  const [portalCred, setPortalCred] = useState("");

  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+971");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const [addAndEditCredFormData, setAddAndEditCredFormData] = useState({
    portal: null,
    username: "",
    password: "",
  });

  const [errorAddAndEditSchema, setErrorAddAndEditSchema] = useState({
    username: false,
    password: false,
  });
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  const [type, setType] = useState("");

  //  change width of drawer based on screen...

  const isLargeScreen = useMediaQuery({ query: "(min-width: 1200px)" });
  const isMediumScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 767px)" });

  let DrawerWidth = "520px";
  if (isLargeScreen) {
    DrawerWidth = "540px";
  } else if (isMediumScreen) {
    DrawerWidth = "540px";
  } else if (isSmallScreen) {
    DrawerWidth = "95%";
  }

  const setFormData = (value) => {
    if(formData.form_data) {
      let form = [];
      formData.form_data.map((item) => {
        if(item.type === 'image') {
          // if(item.subLabel.includes("\n")) {
          let fields = item.subLabel.split("\n");
          fields.map((document) => {
            form.push({label: document, required: item.required, subLabel: item.label, type: item.type, value: undefined});
          })
        // } else {
        //   form.push({label: item.subLabel, required: item.required, type: item.type, value: undefined});
        // }
        } else if(item.type.toLowerCase() === 'checkbox') {
          form.push({label: item.label, required: item.required, subLabel: item.subLabel, singleSelect: item.singleSelect, type: item.type, value: undefined});
          setSingleSelect({ enable: item.singleSelect, value: "" });
        } else if(item.type === "textArea" && (item.label.toLowerCase() === "misa portal username" ||item.label.toLowerCase() === "misa portal password")) {

          return;
        } else {
          form.push({label: item.label, required: item.required, subLabel: item.subLabel, type: item.type, value: item.value || undefined});
        }
      })
      setFormDetails(form);
    }
  }
  
  useEffect(() => {
    setFormData(1);
  },[])

  const getCheckBoxOptions = (options) => {
    const tempData = options.map((item) => ({
      label: item,
      value: item,
    }));
    return tempData;
  };

  const onChangeCheckBox = (e, index) => {
    let singleSelect = false;
    formDetails.forEach((item) => {
      if (item.type === "CheckBox") {
        singleSelect = item.singleSelect;
      }
    });

    if (singleSelect) {
      if (e.length > 0) {
        const newValues = e.filter(
          (item) => !isSingleSelectEnable.value.includes(item)
        );

        // If there are new values, update the form data and the state
        if (newValues.length > 0) {
          formDetails[index].value = newValues[0];
          setSingleSelect({ ...isSingleSelectEnable, value: newValues });
        }
      } else {
        formDetails[index].value = "";
        setSingleSelect({ ...isSingleSelectEnable, value: [] });
      }
    } else {
      formDetails[index].value = e.join(",");
      setSingleSelect({ ...isSingleSelectEnable, value: e });
    }
  };

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const updatedFields = [...formDetails];
    updatedFields[index].value = value;
    setFormDetails(updatedFields);
  };

  const handleImageUpload = (value, index) => {
    const updatedFields = [...formDetails];
    updatedFields[index].value = value[0];
    setFormDetails(updatedFields);
  }

  const removeImage = (value, index) => {
    const updatedFields = [...formDetails];
    updatedFields[index].value = value;
    setFormDetails(updatedFields);
  }

  const validateForm = () => {
    let valid = true;
    let errorObj = [];
    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/;
    console.log('portalCred', portalCred);
    if(portalCredentials.length === 0 && portalCred === "") {
      valid = false;
      errorObj.push("portal");
    } else {
      valid = true;
    }
    if(email === '') {
      valid = false;
      errorObj.push("email");
      setEmailErrorMessage("this field is required.")
    } else if(!emailRegex.test(email)) {
      valid = false;
      errorObj.push("email");
      setEmailErrorMessage("Please enter a valid email address.")
    } else {
      if(valid){
        valid = true;
      }
      setEmailErrorMessage("");
    }
    if(phoneNumber === "") {
      valid = false;
      errorObj.push("phoneNumber");
    } else {
      if(valid) {
        valid = true;
      }
    }
    formDetails.forEach((item) => {
      if(item.value) {
        if(valid) {
          valid = true;
        }
      } else {
        if(item.required) {
          errorObj.push(item.label);
          valid = false;
        }
      }
    })

    setFormErrorFields(errorObj);

    return { valid };
  }

  const saveDataForFutureUse = async (id) => {
    let method = "POST";
    let url = "governify/customer/createGovernifyServiceRecord";
    let payload = JSON.stringify({
      user_id: sessionStorage.getItem("userId"),
      category_id: categoryId.toString(),
      service_id: selectedServiceId.toString(),
      form_id: selectedFormId.toString(),
      governify_item_id: id.toString(),
    });
    try {
      const response = await fetcher(url, method, payload);
      console.log(response, "response");
    } catch (err) {
    } finally {
    }
  };

  const uploadImage = async (image, idForImage) => {
    let formData = new FormData();
    formData.append("item_id", idForImage);
    formData.append("file_name", image.file_name);
    formData.append("file", image.file);
    formData.append("column_id", data.selectedColumn.update);

    let token = sessionStorage.getItem("token");

    try {
      // Start with 0% progress
      // setProgress((prevProgress) => ({
      //   ...prevProgress,
      //   [image.file_name]: 0,
      // }));

      // Simulating progress with setInterval
      let progress = 0;
      const interval = setInterval(() => {
        // Check if progress has reached 100% or more
        if (progress >= 90) {
          clearInterval(interval);
          return;
        }

        // Update progress by increments
        progress += 10; // Simulate progress steps
        // setProgress((prevProgress) => ({
        //   ...prevProgress,
        //   [image.file_name]: progress,
        //   name: image.file_name,
        // }));
      }, 1000); // Adjust interval time as needed

      const response = await axios.post(
        "http://127.0.0.1:8000/incorpify/uploadMondayFiles",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If upload completes before interval, clear interval for this file
      if (progress < 100) {
        clearInterval(interval);
      }

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      // Set progress to 100% after successful response
      // setProgress((prevProgress) => ({
      //   ...prevProgress,
      //   [image.file_name]: 100,
      // }));

      return response.data.success; // Assuming the API returns a success field
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      return false;
    }
  };

  const uploadAllImage = async (imageData, idForImage) => {
    const uploadPromises = imageData.map((image) =>
      uploadImage(image, idForImage)
    );
    const results = await Promise.all(uploadPromises);
    
    return results.every((result) => result === true);
  };

  const handleSubmit = async () => {
    let complete = false;
    let cred = {};
    if(portalCredentials.length) {
      cred = {portal_name: portalImageAndLogo[0].title, portal_username: portalCredentials[0].username, portal_password: portalCredentials[0].password};
    }
    let tempFormData = [portalCredentials.length ? cred: {credentials: portalCred} , {email: email},{phoneCode: phoneCode},{phoneNumber: phoneNumber}];
    formDetails.forEach((item) => {
      if (item.type !== "image") {
        if (item.required && (item.value === "" || item.value === undefined)) {
          complete = true;
        } else {
          tempFormData.push({ [item.label]: item.value });
        }
      }
    });

    if (complete) {
      return;
    }
    let method = "POST";
    let url = "governify/customer/createRequestDashboard";
    let payload = JSON.stringify({
      form_data: tempFormData,
      service_request: serviceTitle,
      service_category: categoryName,
    });

    try {
      const response = await fetcher(url, method, payload);
      if (response.status) {
        await saveDataForFutureUse(
          response.response.response.data.create_item.id
        );
        return response;
      }
    } catch (err) {
      console.log(err, "err");
    }
  };

  const handleSubmitAll = async () => {
    const { valid } = validateForm();
    if(!valid) {
      return;
    }

    setLoading(true);

    try {
      const response1 = await handleSubmit();
      const id = response1.response.response.data.create_item.id;
      const tempImageData = [];

      if (!response1.status) {
        toast.error("Form Submission Failed.");
        return;
      }

      if (isUploadEnable.enable) {
        formDetails.forEach((item) => {
          if (item.type === "image" || item.type === "Document") {
            if (item.value !== undefined) {
                tempImageData.push({
                  file: item.value.file,
                  file_name: item.value.file_name, // Ensure the property name is correct
                  item_id: 'id',
                });
            }
          }
        });
        if (tempImageData.length > 0) {
          const response2 = await uploadAllImage(tempImageData, id);
          if (response2) {
            toast.success('form Submitted Successfully!')
            setTimeout(() => {
              setFormSubmitted(true);
              setLoading(false);
              setOpen(false);
            }, 2000);
          } else {
            setLoading(false);
            toast.error("Image Not Uploaded.");
          }
        } else {
          setFormSubmitted(true); // No images to upload but form is submitted
        }
      } else {
        if (response1.status) {
          setFormSubmitted(true);
        } else {
          toast.error("Form Submission Failed");
        }
      }
    } catch (error) {
      console.error("Error in handleSubmitAll:", error);
    } finally {
      setTimeout(() => {
        setFormSubmitted(true);
        setLoading(false);
      }, 1000);
    }
  }

  const parseCredentials = (input) => {
    const result = {};
    const pairs = input.split(",");

    pairs.forEach((pair) => {
      const [key, value] = pair.split(":").map((item) => item.trim());
      result[key] = value;
    });

    return result;
  };

  const fetchPreviousData = async () => {

    let userId = sessionStorage.getItem("userId");
    let tempObject = {};
    try {
      let method = "GET";
      let url = `governify/customer/getGovernifyServiceRecord?user_id=${userId}&category_id=${categoryId}&service_id=${selectedServiceId}&form_id=${selectedFormId}`;
      const response = await fetcher(url, method);
      if (response.status) {
        response.response[0].column_values.forEach((item) => {
          // console.log('item', item);
          if (item.id === "form_infomation__1") {
            tempObject = parseCredentials(item.text);
          }
        });

        let flag = false;
        let required = false;
        let singleSelect = false;
        formData.form_data.forEach((item) => {

          if (item.type === "image" || item.type === "Document") {
            flag = true;
            required = item.required;
          }
          if (item.type === "CheckBox") {
            singleSelect = true;
          } else {
            item.value = tempObject[item.label];
          }
        });
        if("email" in tempObject){
          setEmail(tempObject["email"]);
        } 
        if("phoneCode" in tempObject) {
          setPhoneCode(tempObject["phoneCode"]);
        }
        if("phoneNumber" in tempObject) {
          setPhoneNumber(tempObject["phoneNumber"]);
        }
        setIsUploadEnable({ enable: flag, required: required });
        setSingleSelect({ enable: singleSelect, value: "" });

        setFormData();
      }else{
        let flag = false;
        let required = false;
        let singleSelect = false;
        formData.form_data.forEach((item) => {

          if (item.type === "image" || item.type === "Document") {
            flag = true;
            required = item.required;
          }
          if (item.type === "CheckBox") {
            singleSelect = true;
          } else {
            item.value = tempObject[item.label];
          }
        });
        setIsUploadEnable({ enable: flag, required: required });
        setSingleSelect({ enable: singleSelect, value: "" });
      }
      // console.log(tempObject);
    } catch (err) {}
  };

  useEffect(() => {

      fetchPreviousData();
  },[])

  // edit and add credentials functionality...

  const validateEditCredentialsForm = () => {
    let valid = true;
    let errorObj = { username: false, password: false };
    if (addAndEditCredFormData.username === "") {
      valid = false;
      errorObj.username = true;
    } else {
      valid = true;
      errorObj.username = false;
    }
    if (addAndEditCredFormData.password === "") {
      valid = false;
      errorObj.password = true;
      setPasswordErrorMsg("This field is required.");
    } else if (addAndEditCredFormData.password.trim().length < 8) {
      valid = false;
      errorObj.password = true;
      setPasswordErrorMsg(
        "Password should be greater than or equal to 8 digits"
      );
    } else {
      if (valid) {
        valid = true;
      }
      errorObj.password = false;
      setPasswordErrorMsg("");
    }

    setErrorAddAndEditSchema({
      username: errorObj.username,
      password: errorObj.password,
    });

    return { valid };
  };

  const handleAddAndEditCredSubmit = async () => {
    let { valid } = validateEditCredentialsForm();
    if (!valid) {
      return;
    }
    let url =
      type === "add"
        ? "governify/customer/addPortalCredentials"
        : `governify/customer/updatePortalCredentials/${portalCredentials[0]?.id}`;
    let method = type === "add" ? "POST" : "PUT";
    let payload = JSON.stringify({
      portal_id: addAndEditCredFormData.portal,
      username: addAndEditCredFormData.username,
      password: addAndEditCredFormData.password,
    });
    setLoading(true);
    try {
      const response = await fetcher(url, method, payload);
      if (response.status) {
        toast.success(response.message);
        await fetchPortalCredentials();
        setType("");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Oops! Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {loading && <Loader />}
      <Drawer
        open={open}
        closable={false}
        width={DrawerWidth}
        onClose={() => {
          setOpen(false);
          setType("");
        }}
        title={null}
        zIndex={90}
        className={`custom-form-drawer ${
          type === "edit" || type === "add" ? "overflow-disable" : ""
        }`}
        footer={
          <div className="d-flex justify-content-between pt-2">
            <button
              style={{
                background: "#f2f3f7",
                color: "#202223",
                maxWidth: "224px",
                borderRadius: "8px",
                gap: "5px",
                padding: "10px 20px",
                border: "1px solid #8C9196",
              }}
              className="fw-semibold"
              onClick={() => {
                type === "edit" || type === "add"
                  ? setType("")
                  : setOpen(false);
              }}
            >
              Cancel
            </button>
            {type === "" ? (
              <button
                style={{
                  background: "#00BF63",
                  color: "#fff",
                  maxWidth: "224px",
                  borderRadius: "8px",
                  gap: "5px",
                  padding: "10px 20px",
                  border: "none",
                }}
                className="fw-semibold"
                onClick={() => handleSubmitAll()}
              >
                Submit Request
              </button>
            ) : (
              <button
                style={{
                  background: "#00BF63",
                  color: "#fff",
                  maxWidth: "224px",
                  borderRadius: "8px",
                  gap: "5px",
                  padding: "10px 20px",
                  border: "none",
                }}
                className="fw-semibold"
                onClick={() => handleAddAndEditCredSubmit()}
              >
                Save Changes
              </button>
            )}
          </div>
        }
      >
        <div>
          <div className="d-flex flex-column" style={{ gap: "15px" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="fs-24 pt-1 fw-semibold">{serviceTitle}</div>
              <span>
                <Button
                  className="cancel-btn"
                  type="text"
                  style={{ padding: "0 !important" }}
                  onClick={() => setOpen(false)}
                >
                  <CloseOutlined />
                </Button>
              </span>
            </div>
            <div
              style={{ maxWidth: "90%", color: "#6D7175" }}
              className="fs-16"
            >
              Please fill out the form below to request this service. If you
              need assistance, feel free to contact our support team.
            </div>
          </div>
          <div className="d-flex flex-column mt-4" style={{ gap: "15px" }}>
            <div className="d-flex flex-column" style={{ gap: "5px" }}>
              <div className="fs-16" style={{ color: "#202223" }}>
                Portal Credentials
              </div>
              {portalCredentials.length === 0 && (
                <div className="fs-16" style={{ color: "#6D7175" }}>
                  You haven't added any portal credentials for this service yet!
                </div>
              )}
            </div>
            {portalCredentials === null ||
            portalCredentials.length === 0 ||
            portalId === null ? (
              <div className="d-flex flex-column" style={{ gap: "10px" }}>
                {portalId === null ? (
                  <Popover title="This Service is not associated with any Portal">
                    <Button
                      icon={<PlusOutlined />}
                      iconPosition="start"
                      style={{
                        border: "1px solid #008080",
                        color: "#008080",
                        maxWidth: "190px",
                      }}
                      type="default"
                      className="form-btn"
                      disabled
                    >
                      Add portal credentials
                    </Button>
                  </Popover>
                ) : (
                  <Button
                    icon={<PlusOutlined />}
                    iconPosition="start"
                    style={{
                      border: "1px solid #008080",
                      color: "#008080",
                      maxWidth: "190px",
                    }}
                    type="default"
                    className="form-btn"
                    onClick={() => setType("add")}
                  >
                    Add portal credentials
                  </Button>
                )}
                <Button
                  icon={<LockOutlined />}
                  iconPosition="start"
                  style={{
                    border: "1px solid #008080",
                    color: portalCred !== "" ? "#ffffff" : "#008080",
                    maxWidth: "215px",
                    background: portalCred !== "" ? "#008080" : "#ffffff"
                  }}
                  type="default"
                  className="form-btn"
                  onClick={() => setPortalCred("I don’t have credentials yet")}
                >
                  I don't have credentials yet
                </Button>
              </div>
            ) : (
              <Credential
                item={portalCredentials[0]}
                logoAndName={portalImageAndLogo}
                setType={setType}
                // portals={portalCredentials}
                fetchPortalCredentials={fetchPortalCredentials}
              />
            )}
            {formErrorFields.includes('portal') && <span style={{ color: "#FD5749" }} className="fs-s">This field is required.</span>}
            <div className="d-flex mt-2 flex-column" style={{ gap: "5px" }}>
              <div className="fs-16" style={{ color: "#202223" }}>
                Mobile Number
              </div>
              <MobileNumberField setPhoneNumber={setPhoneNumber} formErrorFields={formErrorFields} phoneNumber={phoneNumber} phoneCode={phoneCode} setPhoneCode={setPhoneCode} />
            </div>
            <div className="d-flex mt-1 flex-column" style={{ gap: "5px" }}>
              <EmailField email={email} setEmail={setEmail} formErrorFields={formErrorFields} emailErrorMessage={emailErrorMessage} />
            </div>
            <Flex vertical gap={15} style={{ paddingBottom: "20px" }}>
              {formDetails.map((item, index) => {
                if (
                  item.type === "textArea" &&
                  item.label.toLowerCase() === "additional notes"
                ) {
                  return (
                    <div className="d-flex flex-column" style={{ gap: "5px" }}>
                      <div className="fs-16" style={{ color: "#202223" }}>
                        {item.label}
                      </div>
                      <AdditionalNoteArea item={item} index={index} handleInputChange={handleInputChange} formErrorFields={formErrorFields} />
                    </div>
                  );
                } else if (
                  item.type === "textArea" &&
                  item.label.toLowerCase() !== "misa portal username" &&
                  item.label.toLowerCase() !== "misa portal password" &&
                  item.label.toLowerCase() !== "additional notes"
                ) {
                  return (
                    <div className="d-flex flex-column" style={{ gap: "5px" }}>
                      <div className="fs-16" style={{ color: "#202223" }}>
                        {item.label}
                      </div>
                      <NormalInputField item={item} index={index} handleInputChange={handleInputChange} formErrorFields={formErrorFields} />
                    </div>
                  );
                } else if (item.type === "image") {
                    return (
                      <div
                        className="d-flex mt-2 flex-column"
                        style={{ gap: "5px" }}
                      >
                        <div className="fs-16" style={{ color: "#202223" }}>
                          {item.label}
                        </div>
                        <FileInput item={item} index={index} handleImageUpload={handleImageUpload} removeImage={removeImage} formErrorFields={formErrorFields} />
                      </div>
                    );
                } else if (item.type === "CheckBox") {
                  const data = item;
                  const options = getCheckBoxOptions(data.subLabel.split(","));
                  if (isSingleSelectEnable.enable) {
                    return (
                      <div
                        key={data.key}
                        style={{
                          // background: "#0000000A",
                          // padding: "10px",
                          // borderRadius: "10px",
                        }}
                      >
                        <div style={{ color: "#2C2E38", fontSize: "16px" }}>
                          {data.label} {item.required && ""}
                        </div>
                        <Checkbox.Group
                          style={{ fontSize: "16px", borderRadius: "4px", padding: "5px 0", width: "100%" }}
                          options={options}
                          onChange={(e) => onChangeCheckBox(e, index)}
                          value={isSingleSelectEnable.value}
                          key={data.key}
                        />
                        {formErrorFields.includes(item.label) && <span style={{ color: "#FD5749", marginTop: '5px' }} className="fs-s">This field is required.</span>}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={data.key}
                        style={{
                          // background: "#0000000A",
                          // padding: "10px 10px 0 0",
                          // borderRadius: "10px",
                        }}
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
                          onChange={(e) => onChangeCheckBox(e, index)}
                        />
                        {formErrorFields.includes(item.label) && <span style={{ color: "#FD5749", marginTop: '5px' }} className="fs-s">This field is required.</span>}
                      </div>
                    );
                  }
                }
              })}
            </Flex>
          </div>
        </div>
        <EditCredentials
          type={type}
          item={portalCredentials[0]}
          setType={setType}
          portals={portalImageAndLogo}
          errorSchema={errorAddAndEditSchema}
          passwordErrorMsg={passwordErrorMsg}
          formData={addAndEditCredFormData}
          setEditCredFormData={setAddAndEditCredFormData}
        />
        <AddCredentials
          type={type}
          item={portalCredentials[0]}
          setType={setType}
          portals={portalImageAndLogo}
          errorSchema={errorAddAndEditSchema}
          passwordErrorMsg={passwordErrorMsg}
          formData={addAndEditCredFormData}
          setEditCredFormData={setAddAndEditCredFormData}
        />
      </Drawer>
    </>
  );
};

export default CustomerFormDrawer;
