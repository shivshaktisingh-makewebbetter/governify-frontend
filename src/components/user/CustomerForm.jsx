import React, { useState, useEffect } from "react";
import { Button, Flex, Input, Upload, message, Checkbox } from "antd";
import { fetcher } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { Loader } from "../common/Loader";
import { Submit } from "../../assets/image";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

export const CustomerForm = ({
  formData,
  serviceTitle,
  loading,
  setLoading,
  categoryName,
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
  };;
  const [formDetails, setFormDetails] = useState(formData.form_data);
  const [imageData, setImageData] = useState([]);
  const [checkedValue, setCheckedValue] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [idForImage, setIdForImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsButtonDisabled(checkDisable());
  }, [formDetails, imageData]);

  const props = {
    multiple: true,
    onRemove: (file) => {},
    beforeUpload: (file) => {
      return false;
    },
  };

  const handleFileChange = async (event) => {
    const fileList = event.fileList;

    const convertToBinary = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target.result;
          const binaryString = new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          );
          resolve(binaryString);
        };
        reader.onerror = (e) => {
          reject(e);
        };
        reader.readAsArrayBuffer(file);
      });
    };

    const processFiles = async () => {
      const filesArray = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i].originFileObj; // Access the original file object
        const binaryFile = await convertToBinary(file);
        filesArray.push({ file_name: file.name, file: binaryFile });
      }
      setImageData(filesArray);
      // return filesArray;
    };

    processFiles();
    // setImageData(data);
  };

  const getUploadLabel = (item) => {
    let newItem = item.split("\n");
    const data = newItem.map((subItem, index) => (
      <li style={{ color: "#2c2e38", fontSize: "13px" }} key={index}>
        {subItem}
      </li>
    ));
    return <ul>{data}</ul>;
  };

  const uploadImage = async (image, idForImage) => {
    image.item_id = idForImage;
    console.log(image , idForImage)

    let token = sessionStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://onboardify.tasc360.com/incorpify/uploadMondayFiles",
        image,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.success; // assuming the API returns a success field
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

  const handleSubmitAll = async () => {
    const response1 = await handleSubmit();

    const response2 = await uploadAllImage(imageData, idForImage);

    console.log(response1, response2);
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
        setIdForImage(response.response.response.data.create_item.id);
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

  const onChangeCheckBox = (checkedValues) => {
    let singleSelect = false;
    formData.form_data.forEach((item) => {
      if (item.type === "CheckBox") {
        singleSelect = item.singleSelect;
      }
    });

    if (singleSelect) {
      setCheckedValue([checkedValues]);
    } else {
      setCheckedValue([...checkedValue, checkedValues]);
    }
    console.log("checked = ", checkedValues);
  };

  const checkDisable = () => {
    let flag = false;
    formData.form_data.forEach((item) => {
      if (
        item.type === "textArea" &&
        (item.value === "" || item.value === undefined)
      ) {
        flag = true;
      } else if (
        item.type === "CheckBox" &&
        checkedValue.length === 0 &&
        item.required
      ) {
        flag = true;
      } else if (
        item.type === "image" &&
        imageData.length === 0 &&
        item.required
      ) {
        flag = true;
      }
    });
    return flag;
  };

  const getCheckBoxOptions = (options) => {
    const tempData = options.map((item) => ({
      label: item,
      value: item,
    }));
    return tempData;
  };

  return (
    <div
      className="customer-form-container"
      style={{ maxWidth: "550px", width: "100%", marginTop: "25px" }}
      key={imageData.length}
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
        style={{ paddingBottom: "20px" }}
      >
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
                  placeholder={item.required ? item.label + " *" : item.label}
                  onChange={(e) => handleChangeValue(e, index)}
                />
              </div>
            );
          } else if (item.type === "CheckBox") {
            const data = item;
            const options = getCheckBoxOptions(data.subLabel.split(","));
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
                  {data.label}
                </p>
                <Checkbox.Group
                  options={options}
                  defaultValue={["Apple"]}
                  onChange={onChangeCheckBox}
                />
              </div>
            );
          } else {
            return (
              <div
                key={imageData.length}
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
                  {item.label || "Upload the following documents"}
                </label>
                <div>{getUploadLabel(item.subLabel)}</div>

                <Upload {...props} onChange={(e) => handleFileChange(e, false)}>
                  <Button icon={<UploadOutlined />}
                  style={{fontSize:"13px" , color:"#2c2e38"}}>Click to Upload</Button>
                </Upload>
                <span style={{ marginLeft: "5px" ,marginTop:"5px" }}>
                  {imageData.length + " files uploaded"}
                </span>
              </div>
            );
          }
        })}
      </Flex>

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
            style={{ fontSize: "15px", fontFamily: "montserrat, sans-serif" }}
          >
            Submit
          </span>
        </Button>
      </div>
    </div>
  );
};
