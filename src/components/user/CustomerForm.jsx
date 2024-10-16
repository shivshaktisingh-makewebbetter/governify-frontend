import React, { useState, useEffect } from "react";
import { Button, Flex, Input, Upload, Checkbox, Modal, Progress } from "antd";
import { fetcher } from "../../utils/helper";
import { Loader } from "../common/Loader";
import { Submit } from "../../assets/image";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { ThankyouModal } from "./ThankyouModal";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";

export const CustomerForm = ({
  formData,
  serviceTitle,
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

  const [formDetails, setFormDetails] = useState(formData.form_data);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isSingleSelectEnable, setSingleSelect] = useState({
    enable: false,
    value: [],
  });
  const [isUploadEnable, setIsUploadEnable] = useState({
    enable: false,
    required: false,
  });
  const [progress, setProgress] = useState({});
  const [buttonLoading, setButtonLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaExpired, setRecaptchaExpired] = useState(false);
   const [selected, setSelected] = useState(null);

  const props = {
    multiple: true,
    onRemove: (file) => {
      setTimeout(() => {
        const tempFormData = [...formDetails];
        const tempNewSelection = [];
        let imageName = file.name;
        tempFormData.forEach((item) => {
          if (item.type === "Document" || item.type === "image") {
            item.value.forEach((subItem) => {
              if (subItem.file_name !== imageName) {
                tempNewSelection.push(subItem);
              }
            });
          }
        });

        tempFormData.forEach((item) => {
          if (item.type === "Document" || item.type === "image") {
            item.value = tempNewSelection;
          }
        });
        setFormDetails(tempFormData);
      }, 500);
      console.log(file);
    },
    beforeUpload: (file) => {
      return false;
    },
  };

  const handleFileChange = async (event, index) => {
    const files = event.file;

    if (files) {
      let reader = new FileReader();
      reader.onload = (function (theFile) {
        return function (event) {
          const tempFormData = [...formDetails];
          let tempImageData = [];
          tempFormData.forEach((item) => {
            if (item.type === "Document" || item.type === "image") {
              if (item.value == undefined) {
                tempImageData = [];
              } else {
                tempImageData = item.value;
              }
            }
          });
          tempImageData.push({ file: files, file_name: files.name });
          tempFormData.forEach((item) => {
            if (item.type === "Document" || item.type === "image") {
              item.value = tempImageData;
            }
          });
          setFormDetails(tempFormData);
        };
      })(files);

      reader.readAsDataURL(files);
    }
  };

  const onRecaptchaExpired = () => {
    setRecaptchaToken(null);
    setRecaptchaExpired(true);
  };

  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    setRecaptchaExpired(false);
  };

  const getUploadLabel = (item) => {
    if (item === null || undefined) {
      return <div></div>;
    }
    let newItem = item.split("\n");
    const data = newItem.map((subItem, index) => (
      <li style={{ color: "#2c2e38", fontSize: "13px" }} key={index}>
        {subItem}
      </li>
    ));
    return <ul>{data}</ul>;
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
      setProgress((prevProgress) => ({
        ...prevProgress,
        [image.file_name]: 0,
      }));

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
        setProgress((prevProgress) => ({
          ...prevProgress,
          [image.file_name]: progress,
          name: image.file_name,
        }));
      }, 1000); // Adjust interval time as needed

      const response = await axios.post(
        "https://onboardify.tasc360.com/incorpify/uploadMondayFiles",
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
      setProgress((prevProgress) => ({
        ...prevProgress,
        [image.file_name]: 100,
      }));

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

  const handleSubmitAll = async () => {
    setButtonLoading(true);

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
            if (item.value !== undefined && item.value.length > 0) {
              item.value.forEach((subItem) => {
                tempImageData.push({
                  file: subItem.file,
                  file_name: subItem.file_name, // Ensure the property name is correct
                  item_id: id,
                });
              });
            }
          }
        });
        if (tempImageData.length > 0) {
          const response2 = await uploadAllImage(tempImageData, id);
          if (response2) {
            setTimeout(() => {
              setFormSubmitted(true);
              setButtonLoading(false);
            }, 1000);
          } else {
            setButtonLoading(false);
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
        setButtonLoading(false);
      }, 1000);
    }
  };

  const handleSubmit = async () => {
    let complete = false;
    let tempFormData = [];
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

  // Assuming you call handleSubmitAll somewhere in your code to trigger the process

  const handleChangeValue = (e, index) => {
    let updatedData = [...formDetails];
    updatedData[index].value = e.target.value;
    setFormDetails(updatedData);
  };

  const onChangeCheckBox = (e, index) => {
    let singleSelect = false;
    formData.form_data.forEach((item) => {
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
          formData.form_data[index].value = newValues[0];
          setSingleSelect({ ...isSingleSelectEnable, value: newValues });
        }
      } else {
        formData.form_data[index].value = "";
        setSingleSelect({ ...isSingleSelectEnable, value: [] });
      }
    } else {
      formData.form_data[index].value = e.join(",");
      setSingleSelect({ ...isSingleSelectEnable, value: e });
    }
  };

  const checkDisable = () => {
    let flag = false;

    formDetails.forEach((item) => {
      if (item.required) {
        if (
          (item.type === "textArea" || item.type === "CheckBox") &&
          (item.value === undefined || item.value === null || item.value === "")
        ) {
          flag = true;
        } else if (
          item.value === null ||
          item.value === undefined ||
          item.value.length === 0
        ) {
          flag = true;
        }
      }
    });

    flag = flag || recaptchaExpired || recaptchaToken === "";

    return flag;
  };

  const getCheckBoxOptions = (options) => {
    const tempData = options.map((item) => ({
      label: item,
      value: item,
    }));
    return tempData;
  };

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
        setIsUploadEnable({ enable: flag, required: required });
        setSingleSelect({ enable: singleSelect, value: "" });

        setFormDetails(formData.form_data);
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
    setIsButtonDisabled(checkDisable());
  }, [formDetails, isSingleSelectEnable, recaptchaExpired, recaptchaToken]);

  useEffect(() => {
    fetchPreviousData();
  }, []);

  return (
    <div
      className="customer-form-container"
      style={{ maxWidth: "550px", width: "100%", marginTop: "25px" }}
    >
      {buttonLoading && <Loader />}

      {!formSubmitted && (
        <>
          {" "}
          <div className="form-header">{serviceTitle}</div>
          <div
            className="w-divider-component-wrapper divider-component-wrapper_XE2"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3000px"
              height="33"
              style={{ width: "12%" }}
            >
              <path
                d="M0 16.5 L3000 16.5"
                style={{
                  fill: "none",
                  stroke: data.button_bg,
                  strokeWidth: "3px",
                }}
              ></path>
            </svg>
          </div>
          <div className="form-header-description">
            {data.form_description ||
              "Please fill out the form to proceed with the needed action to provide you with this service"}
          </div>
          <Flex
            vertical
            gap={15}
            style={{ paddingBottom: "20px", paddingTop: "24px" }}
          >
            {formDetails.map((item, index) => {
              if (item.type === "textArea") {
                return (
                  <div
                    className="form-field"
                    style={{ display: "flex" }}
                    key={item.key}
                  >
                    <Input
                      style={{
                        fontSize: "13px",
                      }}
                      size="large"
                      variant="filled"
                      placeholder={
                        item.required ? item.label + " *" : item.label
                      }
                      onChange={(e) => handleChangeValue(e, index)}
                      value={item.value}
                    />
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
                        background: "#0000000A",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <p style={{ color: "#2C2E38", fontSize: "13px" }}>
                        {data.label} {item.required && " *"}
                      </p>
                      <Checkbox.Group
                        style={{ fontSize: "13px" }}
                        options={options}
                        onChange={(e) => onChangeCheckBox(e, index)}
                        value={isSingleSelectEnable.value}
                        key={data.key}
                      />
                     
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={data.key}
                      style={{
                        background: "#0000000A",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <p style={{ color: "#2C2E38", fontSize: "13px" }}>
                        {data.label} {item.required && " *"}
                      </p>
                      <Checkbox.Group
                        style={{ fontSize: "13px" }}
                        options={options}
                        onChange={(e) => onChangeCheckBox(e, index)}
                    
                      />
                    </div>
                  );
                }
              } else {
                return (
                  <div
                    className="form-field"
                    style={{
                      background: "#0000000A",
                      padding: "10px",
                      borderRadius: "10px",
                      color: "#2c2e38",
                    }}
                  >
                    <label
                      htmlFor={`upload-${index}`}
                      style={{ color: "#2c2e38", fontSize: "13px" }}
                    >
                      {item.label || "Upload the following documents"}{" "}
                      {item.required && " *"}
                    </label>
                    <div>{getUploadLabel(item.subLabel)}</div>

                    <Upload
                      {...props}
                      onChange={(e) => handleFileChange(e, index)}
                    >
                      <div>
                        <Button
                          icon={<UploadOutlined />}
                          style={{ fontSize: "13px", color: "#2c2e38" }}
                        >
                          Click to Upload
                        </Button>
                        <span
                          style={{
                            paddingLeft: "5px",
                            color: "grey",
                            fontSize: "13px",
                          }}
                        >
                          Maximum Size allowed is 25 MB.
                        </span>
                      </div>
                    </Upload>
                  </div>
                );
              }
            })}
          </Flex>
          {!buttonLoading && (
            <div
              className="w-100 d-flex justify-content-center "
              style={{ marginBottom: "10px" }}
            >
              <ReCAPTCHA
                sitekey="6LdmFMQpAAAAAGwLfYZopzckKXOu0obCtpHW0obV"
                onChange={onRecaptchaChange}
                onExpired={onRecaptchaExpired}
              />
            </div>
          )}
          <div className="w-100 d-flex justify-content-center">
            <Button
              disabled={isButtonDisabled}
              size="large"
              style={{
                width: "100%",
                border: "none",
                background: isButtonDisabled ? "#ecedf5" : data.button_bg,
                color: isButtonDisabled ? "#32333861" : "#fff",
              }}
              icon={<Submit />}
              onClick={handleSubmitAll}
            >
              <span
                style={{
                  fontSize: "15px",
                  fontFamily: "montserrat, sans-serif",
                }}
              >
                Submit
              </span>
            </Button>
          </div>
        </>
      )}

      <div style={{ marginTop: "10px" }}>
        {Object.keys(progress).length > 0 && (
          <div>
            {Object.keys(progress).map((file, index) => {
              if (file !== "name") {
                return (
                  <>
                    <div>{file}</div>
                    <Progress
                      key={index}
                      percent={progress[file]}
                      status="active"
                      style={{ marginBottom: "10px" }}
                      strokeColor={{
                        from: "#108ee9",
                        to: "#87d068",
                      }}
                    />
                  </>
                );
              }
            })}
          </div>
        )}
      </div>

      {formSubmitted && (
        <Modal
          open={formSubmitted}
          centered
          footer={null}
          onCancel={handleOpen}
          width={400}
        >
          <ThankyouModal handleOpen={handleOpen} />
        </Modal>
      )}
    </div>
  );
};
