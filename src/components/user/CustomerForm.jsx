import React, { useEffect, useState } from "react";
import { Button, Flex, Input } from "antd";
import { fetcher } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { Loader } from "../common/Loader";
import { Submit } from "../../assets/image";
import { UploadOutlined } from "@ant-design/icons";

export const CustomerForm = ({
  formData,
  serviceTitle,
  loading,
  setLoading,
  categoryName,
}) => {
  const data = JSON.parse(sessionStorage.getItem("settings"));
  const [formDetails, setFormDetails] = useState(formData.form_data);
  const [imageData, setImageData] = useState([]);
  const navigate = useNavigate();

  const [isFocused, setIsFocused] = useState(null);

  const handleFocus = (index) => setIsFocused(index);
  const handleBlur = () => setIsFocused(null);

  const inputFocusedStyle = {
    border: "2px solid",
    borderColor: "#3b99fc", // Change color based on focus
    outline: "none",
    transition: "border-color 0.3s ease",
  };

  const inputUnfocusedStyle = {
    border: "2px solid",
    borderColor: "#fff", // Change color based on focus
    outline: "none",
    transition: "border-color 0.3s ease",
  };

  const handleFileChange = (e) => {
    let files = e.target.files;
    const updatedImageData = [...imageData];

    if (files.length > 0) {
      Array.from(files).forEach((file, index) => {
        let reader = new FileReader();

        reader.onload = (function (theFile) {
          return function (e) {
            updatedImageData.push({
              file_name: file.name,
              file_image: e.target.result,
            });
            // Process the file content here (e.g., update state, send to server, etc.)
          };
        })(file);

        reader.readAsDataURL(file);
      });
    }
    setImageData(updatedImageData);
  };

  const getUploadLabel = (item) => {
    let newItem = item.split("\n");
    const data = newItem.map((subItem, index) => {
      return (
        <li style={{ color: "#2c2e38", fontSize: "18px" }} key={index}>
          {subItem}
        </li>
      );
    });
    return <ul>{data}</ul>;
  };

  const triggerFileInputClick = () => {
    document.getElementById("hiddenFileInput").click();
  };

  const handleSubmit = async () => {
    let complete = false;
    let tempFormData = [];
    formDetails.forEach((item, index) => {
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
      file_data: imageData,
      service_request: serviceTitle,
      service_category: categoryName,
    });
    setLoading(true);
    try {
      const response = await fetcher(url, method, payload);
      if (response.status) {
        navigate("track-request");
      }
    } catch (err) {
      console.log(err, "err");
    } finally {
      setTimeout(() => {
        setLoading(true);
      }, 2000);
    }
  };

  const handleChangeValue = (e, index) => {
    let updatedData = [...formDetails];
    updatedData[index].value = e.target.value;
    setFormDetails(updatedData);
  };

  const checkDisable = () =>{
    let flag = false;
   
    formData.form_data.forEach((item)=>{
      if(item.type==="textArea"){
        if(item.value === ''){
          flag = true;
        }
      }else if(item.type === "CheckBox"){
        // checkBoxPresent = true;
      }else{
        if(imageData.length === 0){
         flag = true;
        }
      }
    })

    return flag;

   
  }

  return (
    <div
      className="customer-form-container"
      style={{ maxWidth: "550px", width: "100%", marginTop: "25px" }}
    >
      {loading && <Loader />}

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
            style={{ fill: "none", stroke: data.button_bg, strokeWidth: "3px" }}
          ></path>
        </svg>
      </div>
      <div className="form-header-description">
        Please fill out the form to proceed with the needed action to provide
        you with this service
      </div>
      <Flex
          vertical
          gap={15}
          className="pt-5"
          style={{ paddingBottom: "35px" }}
        >
      {/* <div className="form-body"> */}
        {formData.form_data.map((item, index) => {
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
                  placeholder={item.required ? item.label + "*" : item.label}
                  onChange={(e) => handleChangeValue(e, index)}
                />
              </div>
            );
          } else if (item.type === "CheckBox") {
            const data = item;
            const options = data.subLabel.split(", ");
            return (
              <div key={data.key}>
                <h3 style={{color: '#2C2E38' ,fontSize: "18px"}}>{data.label}</h3>
                {options.map((option, index) => (
                  <div className="form-group">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`checkbox-${index}`}
                      required={data.required}
                    />
                    <label className="form-check-label" htmlFor={`checkbox-${index}`}>
                      {option}
                    </label>
                  </div>
                </div>
                ))}
              </div>
            );
          } else {
            return (
              <div
                key={item.key}
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
                  style={{ color: "#2c2e38", fontSize: "18px" }}
                >
                  {item.label || "Upload the following documents"}
                </label>
                <div>{getUploadLabel(item.subLabel)}</div>
                <input
                  id="hiddenFileInput"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden-file-input"
                />

                <Button
                  className="custom-button"
                  style={{ height: "40px", background: "#f3f4f8cc" }}
                  icon={<UploadOutlined />}
                  onClick={triggerFileInputClick}
                >
                  Choose File
                </Button>
                {imageData.length > 0 && (
                  <span key={imageData.length}>
                    {imageData.length} document uploaded.
                  </span>
                )}
              </div>
            );
          }
        })}
      {/* </div> */}
      </Flex>

      
      <div className="w-100 d-flex justify-content-center">
          <Button
            disabled={checkDisable()}
            size="large"
            style={{
              width: "100%",
              border: "none",
              background: "#ecedf5",
              color: "#32333861",
            }}
            icon={<Submit />}
            onClick={handleSubmit}
          >
            <span
              style={{ fontSize: "15px", fontFamily: "montserrat, sans-serif" }}
            >
              Submit
            </span>
          </Button>
        </div>



    </div>
  );
};
