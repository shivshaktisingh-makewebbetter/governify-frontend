import { Button, Modal, Typography } from "antd";
import { useState } from "react";
import { CustomerForm } from "./user/CustomerForm";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer } from "react-toastify";

export const TabContent = ({ details, categoryName }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState();
  const [serviceTitle, setServiceTitle] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  
  const settingsData = JSON.parse(sessionStorage.getItem("settings")) || {
    image: "https://onboardify.tasc360.com/uploads/governify/1718271730_1718195689_Products%20Logo%20(1).png",
    site_bg: "#ffffff",
    button_bg: "#5ac063",
    banner_bg: "#5ac063",
    banner_content: "Hire an attitude, not just experience and qualification. Greg Savage.",
    header_bg: "#f7f7f7",
    head_title_color: "#5ac063",
    form_description: "Please fill out the form to proceed with the needed action to provide you with this service",
  };

  const handleModalForm = (formData, title) => {
    const formDetails = Object.entries(formData)[0][1];
    setFormData(formDetails);
    setServiceTitle(title);
    setOpen(true);
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(false);
    setFormSubmitted(false);
  };

  const buttonStyle = {
    border: `1px solid ${settingsData.button_bg}`,
    color: settingsData.button_bg,
    transition: "all 0.3s ease",
    height: "41px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: "transparent", // Ensure the default background is transparent
  };

  const buttonHoverStyle = {
    backgroundColor: settingsData.button_bg,
    color: "#ffffff",
  };

  return (
    <div key={uuidv4()}>
      <div className="service-parent-div">
        {details.map((item) => {
          const description = item.service_request.description;
          const isExpanded = expandedDescriptions[item.service_request.id];
          const truncatedDescription =
            description.length > 117
              ? description.substring(0, 80) + "..."
              : description;
          const imageLink = item.service_request.file_location;
          const title = item.service_request.title;
        

          return (
            <div className="service-repetitive-div" key={uuidv4()}>
              <div className="service-image-wrapper">
                <img
                  className="service-image"
                  src={imageLink}
                  alt="No Preview"
                />
              </div>
              <Typography className="service-child-title font-family-hind">
                {title}
              </Typography>
              <Typography className="service-child-subtitle font-family-hind">
                {isExpanded ? description : truncatedDescription}
                {description.length > 117 && !isExpanded && (
                  <span
                    className="read-more-btn"
                    onClick={() => toggleDescription(item.service_request.id)}
                    style={{ cursor: "pointer", color: "#4096ff" }}
                  >
                    {!isExpanded && (
                      <span style={{ whiteSpace: "nowrap" }}> Read More</span>
                    )}
                  </span>
                )}
              </Typography>

              <Button
                key={title}
                className="tabcontent-create-request-btn"
                style={buttonStyle}
                icon={<PlusOutlined style={{ color: settingsData.button_bg }} />}
                onClick={() =>
                  handleModalForm(
                    item.service_forms,
                    item.service_request.title
                  )
                }
                disabled={Object.keys(item.service_forms).length === 0}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor;
                  e.currentTarget.style.color = buttonHoverStyle.color;
                  e.currentTarget.querySelector(".anticon").style.color = buttonHoverStyle.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = settingsData.button_bg;
                  e.currentTarget.querySelector(".anticon").style.color = settingsData.button_bg;
                }}
              >
                Create a Request
              </Button>
            </div>
          );
        })}
      </div>
      <ToastContainer position="bottom-right" />

      {open && (
        <Modal
          open={open}
          centered
          footer={null}
          onCancel={() => setOpen(false)}
          width={formSubmitted ? 50 : 450}
        >
          <CustomerForm
            formData={formData}
            serviceTitle={serviceTitle}
            categoryName={categoryName}
            key={uuidv4()}
            handleOpen={handleOpen}
            formSubmitted={formSubmitted}
            setFormSubmitted={setFormSubmitted}
          />
        </Modal>
      )}
    </div>
  );
};
