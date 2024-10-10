import React from "react";
import { Button, Popover, Upload } from "antd";
import { Trash2 } from "react-feather";
import { getIcon } from "../../admin/portal/child/AddAndEditPortalDrawer";
const { Dragger } = Upload;

const FileInput = ({ item, index, handleImageUpload, removeImage, formErrorFields }) => {
  const props = {
    onRemove: (file) => {
      //   const index = fileList.indexOf(file);
      //   const newFileList = fileList.slice();
      //   newFileList.splice(index, 1);
      //   setFileList(newFileList);
    },
    beforeUpload: (file) => {
      return false;
    },
  };

  const handleFileChange = (e, index) => {
    console.log('e', e);
    const files = e.file;
    // if (files) {
    //   let reader = new FileReader();
    //   reader.onload = (function (theFile) {
    //     return function (event) {
    //       // const tempFormData = [...formDetails];
    //       let tempImageData = [];
    //       // tempFormData.forEach((item) => {
    //       //   if (item.type === "Document" || item.type === "image") {
    //       //     if (item.value == undefined) {
    //       //       tempImageData = [];
    //       //     } else {
    //       //       tempImageData = item.value;
    //       //     }
    //       //   }
    //       // });
    //       tempImageData.push({ file: files, file_name: files.name, file_size: (files.size / (1024 * 1024)).toFixed(2) + " MB" });
    //       // tempFormData.forEach((item) => {
    //       //   if (item.type === "Document" || item.type === "image") {
    //       //     item.value = tempImageData;
    //       //   }
    //       //   console.log('tempImageData', tempImageData);
    //       // });
    //       console.log('tempImageData', tempImageData);
    //       handleImageUpload(tempImageData, index);
    //     };
    //   })(files);

    //   reader.readAsDataURL(files);
    // }
    let tempImageData = [];
    tempImageData.push({
      file: files,
      file_name: files.name,
      file_size: (files.size / (1024 * 1024)).toFixed(2) + " MB",
    });
    handleImageUpload(tempImageData, index);
  };

  return (
    <>
      {item?.value == undefined ? (
        <>
        <div
          style={{
            border: "1px dashed",
            borderColor: formErrorFields.includes(item.label) ? "#FD5749" : "#C9CCCF",
            borderRadius: "8px",
            background: formErrorFields.includes(item.label) ? "#FFF4F4" : "#FAFBFB",
            paddingTop: "5px",
            paddingBottom: "5px",
          }}
        >
          <Dragger
            showUploadList={false}
            {...props}
            onChange={(e) => handleFileChange(e, index)}
          >
            <p
              className="ant-upload-drag-icon"
              style={{ marginBottom: "10px", marginTop: "5px" }}
            >
              <Button style={{ background: "#008080", color: "#fff" }}>
                Add files
              </Button>
            </p>
            <p
              className="ant-upload-text"
              style={{ color: "#6D7175", fontSize: "12px" }}
            >
              Accepts .PDF, .JPG, and .PNG
            </p>
          </Dragger>
        </div>
        {formErrorFields.includes(item.label) && <span style={{ color: "#FD5749", marginTop: '10px' }} className="fs-s">This field is required.</span>}
        </>
      ) : (
        <div
          style={{
            border: "1px solid #C9CCCF",
            borderRadius: "8px",
            background: "#FAFBFB",
            padding: "15px 10px",
          }}
          className="d-flex justify-content-between align-items-center"
        >
          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
            <div>
              {/* <img
                src="https://gratisography.com/wp-content/uploads/2024/03/gratisography-funflower-800x525.jpg"
                width="48px"
                height="48px"
                alt="text"
                // alt={image?.name}
              /> */}
              {getIcon(item.value.file_name)}
            </div>
            <div className="d-flex flex-column ">
              <span style={{ color: "#202223" }} className="fs-16 fw-semibold">
                {item.value.file_name}
                {/* {image?.name} */}
              </span>
              <span style={{ color: "#6D7175" }}>{item.value.file_size}</span>
              {/* <span style={{ color: "#6D7175" }}>{image?.size}</span> */}
            </div>
          </div>
          <div>
            <Popover content="Delete">
              <div
                onClick={() => {
                  removeImage(undefined, index);
                }}
              >
                <span
                  style={{
                    background: "#EF4444",
                    borderRadius: "8px",
                    padding: "5px 8px",
                    cursor: "pointer",
                  }}
                >
                  <Trash2
                    style={{
                      width: "20px",
                      height: "auto",
                      color: "#fff",
                    }}
                  />
                </span>
              </div>
            </Popover>
          </div>
        </div>
      )}
    </>
  );
};
export default FileInput;
