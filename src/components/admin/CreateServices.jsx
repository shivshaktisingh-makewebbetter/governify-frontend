import { Button, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { fetcher } from "../../utils/helper";
import { toast } from "react-toastify";

export const CreateServices = ({
  setShowSkeleton,
  setLoading,
  loading,
  setModalOpen,
  portals,
}) => {
  const settingsData = JSON.parse(sessionStorage.getItem("settings"));
  const [categoryListig, setCategoryListing] = useState([]);
  const [portalOption, setPortalOption] = useState([]);
  const [serviceData, setServiceData] = useState({
    title: "",
    description: "",
    image: "",
    image_name: "",
    service_categorie_id: "",
    portal_credentials_id: "",
  });

  const handleCategoryChange = (e) => {
    setServiceData({ ...serviceData, service_categorie_id: e });
  };

  const handlePortalChange = (value) => {
    setServiceData({...serviceData, portal_credentials_id: value})
  }

  const handleCreateServices = async () => {
    let method = "POST";
    let url = "governify/admin/serviceRequests/create";
    let payload = JSON.stringify(serviceData);

    try {
      const response = await fetcher(url, method, payload);
      if (response.status) {
        setShowSkeleton(true);
        setModalOpen(false);
        toast.success("Service Created Successfully.");
        setServiceData({
          title: "",
          description: "",
          image: "",
          image_name: "",
          service_categorie_id: "",
          portal_credentials_id: ""
        });
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Error");
      console.log(err, "error");
    }
  };

  const getAllCategories = async () => {
    let method = "GET";
    let url = "governify/admin/serviceCategories";

    try {
      const response = await fetcher(url, method);
      if (response.status) {
        setCategoryListing(
          response.response.map((item) => {
            return { label: item.title, value: item.id };
          })
        );
        setShowSkeleton(false);
      }
    } catch (err) {
      throw new Error("Network response was not ok ", err);
    }
  };

  const handleTitleChange = (e) => {
    setServiceData({ ...serviceData, title: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setServiceData({ ...serviceData, description: e.target.value });
  };

  const handleFileSelect = (data, imageName) => {
    setServiceData({ ...serviceData, image: data, image_name: imageName });
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    if (portals.length) {
      let option = [];
      portals.map((item) => {
        option.push({
          label: (
            <div className="countryOption ff-ws">
              <span
                dangerouslySetInnerHTML={{
                  __html: `<img width="20px" src='${item.file_location}' />`,
                }}
                className="tw-max-w-[20px] tw-h-[20px]"
              ></span>
              {" " + item.title}
            </div>
          ),
          value: item.id,
        });
      });
      setPortalOption(option);
    }
  }, [portals]);

  return (
    <>
      <div
        title="status visibility manage"
        style={{ maxWidth: "550px", width: "100%", marginTop: "25px" }}
      >
        <div>
          <div className="text-white" style={{ backgroundColor: "#59C080" }}>
            <p className="p-2 m-0 fs-5">
              <strong>Create Services</strong>
            </p>
          </div>
          <div
            className="form_wrapper border border-success p-4 primary-shadow"
            style={{ height: "600px", overflowY: "auto" }}
          >
            <div>
              <ImageUpload
                onFileSelect={handleFileSelect}
                imageName={""}
                imageUrl={""}
              />
            </div>
            <Input
              placeholder="Service Title"
              className="mt-30"
              onChange={handleTitleChange}
              addonBefore="Title"
              style={{ borderRadius: "10px" }}
            />
            <Input
              placeholder="Service description"
              className="mt-10"
              onChange={handleDescriptionChange}
              addonBefore="Description"
              style={{ borderRadius: "10px" }}
            />

            <div className="mt-10">
              <Select
                showSearch
                placeholder="Select Category"
                style={{ width: "100%" }}
                popupMatchSelectWidth={false}
                placement="bottomLeft"
                onChange={handleCategoryChange}
                options={categoryListig}
              />
            </div>

            <div className="mt-10">
              <Select
                // showSearch
                placeholder="Select Portal (Optional)"
                style={{ width: "100%" }}
                popupMatchSelectWidth={false}
                placement="bottomLeft"
                onChange={handlePortalChange}
                // value={serviceData.portal_credentials_id}
                options={portalOption}
              />
            </div>

            <div
              style={{ display: "flex", justifyContent: "center" }}
              className="mt-60"
            >
              <Button
                className="mt-10"
                style={{
                  background: settingsData.button_bg,
                  color: "#fff",
                  border: "none",
                }}
                onClick={handleCreateServices}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
