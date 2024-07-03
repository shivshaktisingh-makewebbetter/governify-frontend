import { Button, Modal, Typography } from "antd";
import { useState } from "react";
import { CustomerForm } from "./user/CustomerForm";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { Loader } from "./common/Loader";
import { ThankyouModal } from "./user/ThankyouModal";

export const TabContent = ({ details, categoryName }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState();
  const [serviceTitle, setServiceTitle] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  const handleOpen =() =>{
    setOpen(false);
    setFormSubmitted(false)
  }

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
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    {!isExpanded && <span style={{whiteSpace:"nowrap"}}> Read More</span>}
                  </span>
                )}
              </Typography>

              <Button
                className="tabcontent-create-request-btn"
                style={{
                  position: "absolute",
                  bottom: "0px",
                  borderRadius: "10px",
                }}
                icon={<PlusOutlined />}
                onClick={() =>
                  handleModalForm(
                    item.service_forms,
                    item.service_request.title
                  )
                }
                disabled={Object.keys(item.service_forms).length === 0}
              >
                Create a Request
              </Button>
            </div>
          );
        })}
      </div>

   {open &&   <Modal open={open} centered footer={null} onCancel={() => setOpen(false)} width={formSubmitted ? 50 : 600}>
        <CustomerForm
          formData={formData}
          serviceTitle={serviceTitle}
          categoryName={categoryName}
          key={uuidv4()}
          handleOpen={handleOpen}
          formSubmitted={formSubmitted}
          setFormSubmitted={setFormSubmitted}
        />
      </Modal> }


    </div>
  );
};
