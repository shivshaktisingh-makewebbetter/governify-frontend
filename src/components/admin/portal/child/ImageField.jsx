import React from "react";
import { Button, Popover, Upload } from "antd";
import { Trash2 } from "react-feather";
const { Dragger } = Upload;

const ImageField = ({ image, setImage, error }) => {
  const props = {
    name: "file",
    multiple: false,
    onChange(info) {
      let reader = new FileReader();
      reader.onload = function (e) {
        let sizeInMB = info.file.originFileObj.size / (1024 * 1024);
        setImage({
          name: info.file.originFileObj.name,
          image: e.target.result,
          size: sizeInMB.toFixed(2) + " MB",
          change: true,
        });
      };

      reader.readAsDataURL(info.file.originFileObj);
    },
  };

  return (
    <>
      {image === "" || image === undefined ? (
        <div
          style={{
            border: "1px dashed",
            borderColor: error ? "#FD5749" : "#C9CCCF",
            borderRadius: "8px",
            background: error ? "#FFF4F4" : "#FAFBFB",
            paddingTop: "5px",
            paddingBottom: "5px",
          }}
        >
          <Dragger showUploadList={false} {...props}>
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
              Accepts .JPG, .PNG, and .svg
            </p>
          </Dragger>
        </div>
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
              <img
                src={image?.image}
                width="48px"
                height="48px"
                alt={image?.name}
              />
            </div>
            <div className="d-flex flex-column ">
              <span style={{ color: "#202223" }} className="fs-16 fw-semibold">
                {image?.name}
              </span>
              <span style={{ color: "#6D7175" }}>{image?.size}</span>
            </div>
          </div>
          <div>
            <Popover content="Delete">
              <div
                onClick={() => {
                  setImage("");
                }}
              >
                <span
                  style={{
                    background: "#EF4444",
                    borderRadius: "8px",
                    padding: "5px 8px 8px",
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
      {error && image === "" && (
        <span style={{ color: "#FD5749", marginTop: "5px" }} className="fs-s" >
          This field is required.
        </span>
      )}
    </>
  );
};
export default ImageField;
