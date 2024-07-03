import { Button, Card, Input, Select, Switch, Dropdown, Space } from "antd";
import { useEffect, useState } from "react";
import { fetcher } from "../../utils/helper";
import { DeleteOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

export const EditForms = ({
  setShowSkeleton,
  setLoading,
  loading,
  setEditModalOpen,
  data,
}) => {
  const settingsData = JSON.parse(sessionStorage.getItem("settings"));
  const [field, setField] = useState(data.form_data);
  const [formDetail, setFormDetail] = useState({ formName: data.name });
  const [categoryListing, setCategoryListing] = useState([]);
  const [servicesListing, setServicesListing] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [categoryServicesMapping, setCategoryServicesMapping] = useState([
    {
      category_id: "",
      services_id: "",
    },
  ]);

  const handleDeleteField = (subItem) => {
    let tempField = field.filter((item) => item.key !== subItem.key);
    setField(tempField);
  };

  const getSelectedServiceDisable = () => {
    let tempServiceListing = { ...servicesListing };
    for (let key in tempServiceListing) {
      if (tempServiceListing.hasOwnProperty(key)) {
        tempServiceListing[key].forEach((item) => {
          if (selectedServices.includes(item.value)) {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
        });
      }
    }
    setServicesListing(tempServiceListing);
  };

  const handleChangeLabel = (event, index) => {
    const tempField = [...field];
    tempField[index].label = event.target.value;
    setField(tempField);
  };

  const publishForm = async () => {
    let flag = false;
    let message = "";
    let url = `governify/admin/serviceRequestForms/${data.id}`;
    let method = "PUT";
    let categoryData = {
      name: formDetail.formName,
      form_data: field,
      category_services_mapping: categoryServicesMapping,
    };

    field.forEach((item) => {
      if (item.label === "") {
        flag = true;
        message = "Please Enter all the label of Form";
        return;
      }
    });

    if (flag) {
      toast.error(message);
      return;
    }

    field.forEach((item) => {
      if (item.type === "CheckBox") {
        if (item.subLabel === "") {
          flag = true;
          message = "Please Enter Options for Checkbox";
          return;
        }
      }
    });

    if (flag) {
      toast.error(message);
      return;
    }

    let payload = JSON.stringify(categoryData);

    try {
      const response = await fetcher(url, method, payload);

      if (response.status) {
        setShowSkeleton(true);
        setEditModalOpen(false);
        toast.success("Form Updated Successfully.");
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Error");
      console.log(err, "error");
    }
  };

  const handleChangeFormName = (event) => {
    setFormDetail({ ...formDetail, formName: event.target.value });
  };

  const onChangeUploadSettingsEnabled = (index) => {
    const updatedFields = field.map((item, idx) => {
      if (idx === index) {
        if (item.enabled) {
          return { ...item, type: "textArea", enabled: false };
        } else {
          return { ...item, type: "image", enabled: true };
        }
      } else {
        if (item.type === "CheckBox") {
          return item;
        } else {
          return { ...item, type: "textArea", enabled: false };
        }
      }
    });
    setField(updatedFields);
  };

  const handleChangeLabelOfDocuments = (event, index) => {
    let tempField = [...field];
    tempField[index].subLabel = event.target.value;
    setField(tempField);
  };

  const onChangeRequiredSettingsEnabled = (index) => {
    const updatedField = [...field];
    updatedField[index].required = !updatedField[index].required;
    setField(updatedField);
  };

  const onChangeSingleSelectEnabled = (index) => {
    const updatedField = [...field];
    updatedField[index].singleSelect = !updatedField[index].singleSelect;
    setField(updatedField);
  };

  const checkServiceAlreadyExist = (id) => {
    let flag = false;
    data.category_service_form_mappings.forEach((item) => {
      if (item.service_id === id) {
        flag = true;
      }
    });
    return flag;
  };

  const getAllCategories = async () => {
    let method = "GET";
    let url = "governify/admin/getCategoriesWithAllService";

    try {
      const response = await fetcher(url, method);
      if (response.status) {
        setCategoryListing(
          response.response.map((item) => {
            return { label: item.title, value: item.id };
          })
        );

        let tempServiceListingData = {};

        response.response.forEach((item) => {
          const categoryId = item.id;

          if (!tempServiceListingData[categoryId]) {
            tempServiceListingData[categoryId] = [];
          }

          item.service_requests.forEach((subItem) => {
            tempServiceListingData[categoryId].push({
              label: subItem.title,
              value: subItem.id,
            });
          });
        });

        setServicesListing(tempServiceListingData);
        setShowSkeleton(false);
      }
    } catch (err) {
      throw new Error("Network response was not ok ", err);
    } finally {
    }
  };

  const handleCategoryChange = (e, index) => {
    const tempData = [...categoryServicesMapping];
    let tempSelectedServices = [];
    tempData[index].category_id = e;
    tempData[index].services_id = "";
    tempData.forEach((item) => {
      tempSelectedServices.push(item.services_id);
    });
    setSelectedServices(tempSelectedServices);

    setCategoryServicesMapping(tempData);
  };

  const checkSameCategoryServiceAlreadyExist = async (data) => {
    let url = "governify/admin/rejectServiceCategoryMapping";
    let method = "POST";
    let payload = JSON.stringify(data);
    const response = await fetcher(url, method, payload);
    return response;
  };

  const mappedDataAlreadyPresentInSession = (tempData) => {
    let sessionData = JSON.parse(sessionStorage.getItem("mappedServices"));
    let flag = isObjectInArray(sessionData, tempData);
    return flag;
  };

  function isObjectInArray(array, obj) {
    return array.some((element) => {
      return JSON.stringify(element) === JSON.stringify(obj);
    });
  }

  const handleServiceChange = async (e, index) => {
    const tempData = [...categoryServicesMapping];
    let flag = mappedDataAlreadyPresentInSession({
      category_id: categoryServicesMapping[index].category_id,
      services_id: e,
    });

    if (flag) {
      let tempSelectedServices = [];
      tempData[index].services_id = e;

      tempData.forEach((item) => {
        tempSelectedServices.push(item.services_id);
      });
      setCategoryServicesMapping(tempData);
      setSelectedServices(tempSelectedServices);
      return;
    }
    // callEndpointToCheckSameCategoryAndServicePairExistOrNot
    try {
      setLoading(true);
      const response = await checkSameCategoryServiceAlreadyExist({
        category_id: categoryServicesMapping[index].category_id,
        service_id: e,
      });

      if (!response.status) {
        toast.error(
          response.message ||
            "Form already assigned with the same service and category."
        );
        tempData[index].services_id = "";
        let tempSelectedServices = [];
        tempData.forEach((item) => {
          if (item.services_id !== "") {
            tempSelectedServices.push(item.services_id);
          }
        });
        setSelectedServices(tempSelectedServices);
        setCategoryServicesMapping(tempData);
        return;
      }
    } catch (err) {
      console.log(err, "error");
    } finally {
      setLoading(false);
    }
    let tempSelectedServices = [];
    tempData[index].services_id = e;

    tempData.forEach((item) => {
      tempSelectedServices.push(item.services_id);
    });
    setCategoryServicesMapping(tempData);
    setSelectedServices(tempSelectedServices);
  };

  const handleAddCatAndServe = () => {
    const tempData = [...categoryServicesMapping];
    tempData.push({
      category_id: "",
      services_id: "",
    });

    setCategoryServicesMapping(tempData);
  };

  const removeCatAndServe = (index) => {
    let newSelectedServices = selectedServices.filter(
      (item) => item !== categoryServicesMapping[index].services_id
    );
    setSelectedServices(newSelectedServices);
    const updatedMapping = categoryServicesMapping
      .slice(0, index)
      .concat(categoryServicesMapping.slice(index + 1));
    setCategoryServicesMapping(updatedMapping);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    let tempData = [];
    let tempSelectedServices = [];
    if (data.category_service_form_mappings.length > 0) {
      data.category_service_form_mappings.forEach((item) => {
        tempSelectedServices.push(item.service_id);
        tempData.push({
          category_id: item.categorie_id,
          services_id: item.service_id,
        });
      });

      setCategoryServicesMapping(tempData);
      setSelectedServices(tempSelectedServices);
      sessionStorage.setItem("mappedServices", JSON.stringify(tempData));
    }
  }, []);

  const handleMenuClick = (e) => {
    let newField = {
      key: field.length,
      label: "",
      subLabel: "",
      type: "",
      defaultValue: "",
      enabled: false,
      required: false,
    };

    if (e.key === "0") {
      newField.type = "textArea";
      newField.value = "";
    }
    if (e.key === "1") {
      newField.type = "CheckBox";
      newField.singleSelect = false;
      newField.value = "";
    }
    if (e.key === "2") {
      newField.type = "textArea";
    }

    let fields = [...field];
    fields.push(newField);
    setField(fields);
  };

  const items = [
    {
      label: "Text Box",
      key: "0",
    },
    {
      label: "CheckBox",
      key: "1",
    },
    {
      label: "Document",
      key: "2",
    },
  ];
  const menuProps = {
    items,
    selectable: true,
    defaultSelectedKeys: ["9"],
    onClick: handleMenuClick,
  };

  useEffect(() => {
    getSelectedServiceDisable();
  }, [categoryServicesMapping]);

  useEffect(async () => {
      let tempSelectedServices = [];




      let method = "GET";
      let url = "governify/admin/getCategoriesWithAllService";
  
      try {
        const response = await fetcher(url, method);
        if (response.status) {
          setCategoryListing(
            response.response.map((item) => {
              return { label: item.title, value: item.id };
            })
          );
  
          let tempServiceListingData = {};
  
          response.response.forEach((item) => {
            const categoryId = item.id;
  
            if (!tempServiceListingData[categoryId]) {
              tempServiceListingData[categoryId] = [];
            }
  
            item.service_requests.forEach((subItem) => {
              tempServiceListingData[categoryId].push({
                label: subItem.title,
                value: subItem.id,
              });
            });
          });


          data.category_service_form_mappings.forEach((item) => {
            tempSelectedServices.push(item.service_id);
          });
          setSelectedServices(tempSelectedServices);
          for (let key in tempServiceListingData) {
            if (tempServiceListingData.hasOwnProperty(key)) {
              tempServiceListingData[key].forEach((item) => {
                if (tempSelectedServices.includes(item.value)) {
                  item.disabled = true;
                } else {
                  item.disabled = false;
                }
              });
            }
          }
          setServicesListing(tempServiceListingData);
  
          setShowSkeleton(false);
        }
      } catch (err) {
        throw new Error("Network response was not ok ", err);
      } finally {
      }

   
  }, []);

  return (
    <>
      <div
        title="status visibility manage"
        style={{ maxWidth: "550px", width: "100%", marginTop: "25px" }}
      >
        <div>
          <div
            className="text-white"
            style={{ backgroundColor: settingsData.button_bg }}
          >
            <p
              className="p-2 m-0 fs-5"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <strong>Edit Form</strong>
              <Dropdown menu={menuProps}>
                <Button
                  type="text"
                  style={{ border: "none", background: "white" }}
                  icon={<PlusOutlined />}
                  iconPosition="start"
                >
                  <Space>Add Field</Space>
                </Button>
              </Dropdown>
            </p>
          </div>
          <div
            className="form_wrapper border border-success p-4 primary-shadow"
            style={{ height: "600px", overflowY: "auto" }}
          >
            <Input
              placeholder="Form name"
              className="mt-10"
              onChange={(e) => handleChangeFormName(e)}
              value={formDetail.formName}
              addonBefore="Form Name"
            />
            <div
              style={{ display: "flex", justifyContent: "end" }}
              className="mt-10"
            >
              <Button onClick={handleAddCatAndServe}>
                Add Category/Services
              </Button>
            </div>

            <div className="mt-10">
              {categoryServicesMapping.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="mt-10">
                      <Select
                        showSearch
                        placeholder={"Select Category"}
                        style={{ width: "100%", borderRadius: "10px" }}
                        popupMatchSelectWidth={false}
                        placement="bottomLeft"
                        onChange={(e) => handleCategoryChange(e, index)}
                        options={categoryListing}
                        value={
                          categoryServicesMapping[index].category_id === ""
                            ? "Select Category"
                            : categoryServicesMapping[index].category_id
                        }
                      />
                    </div>
                    {categoryServicesMapping[index].category_id !== "" && (
                      <div className="mt-10">
                        <Select
                          showSearch
                          placeholder="Select Services"
                          style={{ width: "100%", borderRadius: "10px" }}
                          popupMatchSelectWidth={false}
                          placement="bottomLeft"
                          onChange={(e) => handleServiceChange(e, index)}
                          options={
                            servicesListing[
                              categoryServicesMapping[index].category_id
                            ]
                          }
                          value={
                            categoryServicesMapping[index].services_id === ""
                              ? "Select Service"
                              : categoryServicesMapping[index].services_id
                          }
                          disabled={
                            categoryServicesMapping[index].category_id === ""
                          }
                        />
                      </div>
                    )}
                    <div
                      className="mt-10"
                      style={{ display: "flex", justifyContent: "end" }}
                    >
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => removeCatAndServe(index)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-10">
              {field.map((item, index) => {
                if (item.type === "textArea") {
                  return (
                    <Card className="mt-10">
                      <Input
                        className="mt-10"
                        placeholder="Label"
                        value={item.label}
                        onChange={(event) => handleChangeLabel(event, index)}
                        addonBefore="Label"
                      />
                      <div className="mt-10">
                        <span>Enable Documents Upload</span>
                        <Switch
                          className="ml-10"
                          onChange={() => onChangeUploadSettingsEnabled(index)}
                          value={item.enabled}
                        />
                      </div>
                      <div className="mt-10">
                        <span>Make Field Required</span>
                        <Switch
                          className="ml-10"
                          onChange={() =>
                            onChangeRequiredSettingsEnabled(index)
                          }
                          value={item.required}
                        />
                      </div>
                      <div className="mt-10">
                        {item.enabled && (
                          <textarea
                            style={{ width: "100%" }}
                            value={item.subLabel}
                            onChange={(event) =>
                              handleChangeLabelOfDocuments(event, index)
                            }
                            placeholder="Enter points (one per line)"
                            rows={5}
                            cols={50}
                          />
                        )}
                      </div>
                      <Button
                        className="mt-10"
                        onClick={() => handleDeleteField(item)}
                      >
                        Delete
                      </Button>
                    </Card>
                  );
                } else if (item.type === "CheckBox") {
                  return (
                    <Card className="mt-10">
                      <Input
                        className="mt-10"
                        placeholder="Label"
                        value={item.label}
                        onChange={(event) => handleChangeLabel(event, index)}
                        addonBefore="Label"
                      />

                      <div className="mt-10">
                        <span>Make Field Required</span>
                        <Switch
                          className="ml-10"
                          onChange={() =>
                            onChangeRequiredSettingsEnabled(index)
                          }
                          value={item.required}
                        />
                      </div>
                      <div className="mt-10">
                        <span>Enable Single Select</span>
                        <Switch
                          className="ml-10"
                          onChange={() => onChangeSingleSelectEnabled(index)}
                          value={item.singleSelect}
                        />
                      </div>
                      <div className="mt-10">
                        <textarea
                          style={{ width: "100%" }}
                          value={item.subLabel}
                          onChange={(event) =>
                            handleChangeLabelOfDocuments(event, index)
                          }
                          placeholder="Enter options for checkbox separated by comma"
                          rows={5}
                          cols={50}
                        />
                      </div>
                      <Button
                        className="mt-10"
                        onClick={() => handleDeleteField(item)}
                      >
                        Delete
                      </Button>
                    </Card>
                  );
                } else {
                  return (
                    <Card className="mt-10">
                      <Input
                        className="mt-10"
                        placeholder="Label"
                        value={item.label}
                        onChange={(event) => handleChangeLabel(event, index)}
                        addonBefore="Label"
                      />
                      <div className="mt-10">
                        <span>Enable Documents Upload</span>
                        <Switch
                          className="ml-10"
                          onChange={() => onChangeUploadSettingsEnabled(index)}
                          value={item.enabled}
                        />
                      </div>
                      <div className="mt-10">
                        <span>Make Field Required</span>
                        <Switch
                          className="ml-10"
                          onChange={() =>
                            onChangeRequiredSettingsEnabled(index)
                          }
                          value={item.required}
                        />
                      </div>
                      <div className="mt-10">
                        {item.enabled && (
                          <textarea
                            style={{ width: "100%" }}
                            value={item.subLabel}
                            onChange={(event) =>
                              handleChangeLabelOfDocuments(event, index)
                            }
                            placeholder="Enter points (one per line)"
                            rows={5}
                            cols={50}
                          />
                        )}
                      </div>
                      <Button
                        className="mt-10"
                        onClick={() => handleDeleteField(item)}
                      >
                        Delete
                      </Button>
                    </Card>
                  );
                }
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "end" }}>
              {field.length > 0 && (
                <Button
                  className="mt-10"
                  style={{
                    background: settingsData.button_bg,
                    color: "#fff",
                    border: "none",
                  }}
                  onClick={publishForm}
                >
                  Update
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
