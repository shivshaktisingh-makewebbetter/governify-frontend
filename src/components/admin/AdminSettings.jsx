import { useEffect, useState } from "react";
import { fetcher } from "../../utils/helper";
import { Button, Select } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { Loader } from "../common/Loader";
import { userSettingData } from "../../utils/tools";
import { Collapse } from "antd";

export const AdminSettings = () => {
  const [uiData, setUiData] = useState({
    site_bg: "",
    button_bg: "",
    banner_bg: "",
    banner_content: "",
    header_bg: "",
    head_title_color: "",
    form_description: "",
  });
  const [logoData, setLogoData] = useState({ logo_name: "", logo_image: "" });
  const [loading, setLoading] = useState(false);
  const [buttonObj, setButtonObj] = useState([]);
  const [trackRequestSetting, setTrackRequestSetting] = useState([]);
  const [boardId, setBoardId] = useState("1472103835");
  const [allBoardId, setAllBoardId] = useState([]);
  const [columnList, setColumnList] = useState([]);
  const [columnSelectedData, setColumnSelectedData] = useState({
    head: "",
    mid: "",
    update: "",
    email: "",
  });
  const [buttonData, setButtonData] = useState([
    {
      type: "In Progress",
      bg: "#fdecb9",
      buttonBg: "#f4992d",
      value: 0,
    },
    {
      type: "Completed",
      bg: "#d5f9e2",
      buttonBg: "#55b44e",
      value: 1,
    },
    {
      type: "Pending",
      bg: "#f4bab6",
      buttonBg: "#e14120",
      value: 2,
    },
    {
      type: "Canceled",
      bg: "#b6b6ba",
      buttonBg: "#757575",
      value: 3,
    },
    {
      type: "Awaiting Action",
      bg: "#e7e7e8",
      buttonBg: "#939498",
      value: 5,
    },
  ]);

  const navigate = useNavigate();

  const handleChangeBg = (e) => {
    setUiData({ ...uiData, site_bg: e.target.value });
  };

  const handleChangeBgBtn = (e) => {
    setUiData({ ...uiData, button_bg: e.target.value });
  };

  const handleChangeLogo = async (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    if (file) {
      reader.onload = (function (theFile) {
        return function (e) {
          setLogoData({ logo_image: e.target.result, logo_name: file.name });
        };
      })(file);
      reader.readAsDataURL(file);
    }
  };

  const handleChangeBgBanner = (e) => {
    setUiData({ ...uiData, banner_bg: e.target.value });
  };

  const handleChangeHeaderBg = (e) => {
    setUiData({ ...uiData, header_bg: e.target.value });
  };

  const handleChangeHeadTitleColor = (e) => {
    setUiData({ ...uiData, head_title_color: e.target.value });
  };

  function startsWithHttp(url) {
    return (
      url.toLowerCase().startsWith("http://") ||
      url.toLowerCase().startsWith("https://")
    );
  }

  const handleChangeBannerText = (e) => {
    setUiData({ ...uiData, banner_content: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      boardId === "" ||
      columnSelectedData.email === "" ||
      columnSelectedData.update === "" ||
      columnSelectedData.head === "" ||
      columnSelectedData.mid === ""
    ) {
      toast.error("Please Enter all the fields");
      return;
    }
    let url = "governify/admin/governifySiteSetting";
    let method = "POST";
    uiData.trackRequestData = buttonData;
    uiData.selectedColumn = columnSelectedData;

    let payload = JSON.stringify({
      ui_settings: uiData,
      logo_name: startsWithHttp(logoData.logo_image) ? "" : logoData.logo_name,
      logo_image: startsWithHttp(logoData.logo_image)
        ? ""
        : logoData.logo_image,
      board_id: boardId,
    });

    setLoading(true);
    try {
      let response = await fetcher(url, method, payload);
      if (response.status) {
        toast.success("Settings Updated.");
        userSettingData();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
        window.location.reload();
      }, 1000);
    }
  };

  const handleChangeFormDescription = (e) => {
    setUiData({ ...uiData, form_description: e.target.value });
  };

  const handleBackNavigation = () => {
    navigate(-1);
  };

  const handleChangeBgBtnForRequest = (e, item, index) => {
    const tempColor = e.target.value;
    let tempButtonData = [...buttonData];
    tempButtonData.forEach((status) => {
      if (status.type === item) {
        status.buttonBg = tempColor;
      }
    });

    setButtonData(tempButtonData);
  };

  const handleChangeBgColorForRequest = (e, item, index) => {
    const tempColor = e.target.value;
    let tempButtonData = [...buttonData];
    tempButtonData.forEach((status) => {
      if (status.type === item) {
        status.bg = tempColor;
      }
    });

    setButtonData(tempButtonData);
  };

  const getValueButtonStatus = (item) => {
    let tempColor = "";
    buttonData.forEach((status) => {
      if (status.type === item) {
        tempColor = status.buttonBg;
      }
    });
    return tempColor;
  };

  const getValueBgStatus = (item) => {
    let tempColor = "";
    buttonData.forEach((status) => {
      if (status.type === item) {
        tempColor = status.bg;
      }
    });
    return tempColor;
  };

  const getButtonBackColorForStatus = (item, filter) => {
    let tempColor = "";
    filter.forEach((subItem) => {
      if (subItem.type === item) {
        tempColor = subItem.buttonBg;
      }
    });
    return tempColor;
  };

  const getBackColorForStatus = (item, filter) => {
    let tempColor = "";
    filter.forEach((subItem) => {
      if (subItem.type === item) {
        tempColor = subItem.bg;
      }
    });
    return tempColor;
  };

  const handleChangeBoardId = async (item) => {
    setBoardId(item);
    setColumnSelectedData({ head: "", mid: "", update: "", email: "" });
    let url = `governify/admin/fetchBoardWiseColumn/${item}`;
    let method = "GET";
    try {
      let response = await fetcher(url, method);
      let columnData = [];
      response.response.forEach((item) => {
        columnData.push({ label: item.title, value: item.id });
      });
      setColumnList(columnData);
    } catch (err) {
    } finally {
    }
  };

  const handleChangeColumn = (e, filter) => {
    setColumnSelectedData({ ...columnSelectedData, [filter]: e });
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      let method = "GET";
      let endpoint = "governify/admin/governifySiteSetting";
      let response = await fetcher(endpoint, method);
      if (response.status) {
        let uiSettings = JSON.parse(response.response.ui_settings);
        setLogoData({
          logo_image: response.response.logo_location,
          logo_name: response.response.logo_name,
        });
        setBoardId(response.response.board_id);
        setUiData({
          form_description: uiSettings.form_description,
          site_bg: uiSettings.site_bg,
          button_bg: uiSettings.button_bg,
          banner_bg: uiSettings.banner_bg,
          banner_content: uiSettings.banner_content,
          header_bg: uiSettings.header_bg,
          head_title_color: uiSettings.head_title_color,
          trackRequestData: uiSettings.trackRequestData,
        });
        setColumnSelectedData({
          head: uiSettings.selectedColumn.head,
          mid: uiSettings.selectedColumn.mid,
          update: uiSettings.selectedColumn.update,
          email: uiSettings.selectedColumn.email,
        });
        let columnListingRespose = await fetcher(
          `governify/admin/fetchBoardWiseColumn/${response.response.board_id}`,
          "GET"
        );
        let columnData = [];
        columnListingRespose.response.forEach((item) => {
          columnData.push({ label: item.title, value: item.id });
        });
        setColumnList(columnData);

        let method1 = "GET";
        let endpoint1 = "governify/admin/overallStatus";
        let response1 = await fetcher(endpoint1, method1);
        if (response1.status) {
          setTrackRequestSetting(response1.response);
          let tempButtonData = response1.response.map((item) => {
            return {
              type: item.label,
              bg: getBackColorForStatus(
                item.label,
                uiSettings.trackRequestData
              ),
              buttonBg: getButtonBackColorForStatus(
                item.label,
                uiSettings.trackRequestData
              ),
              value: item.value,
            };
          });
          setButtonData(tempButtonData);
        }
        let response2 = await fetcher("governify/admin/fetchAllBoards", "GET");
        if (response2.status_code === 200) {
          let tempBoardIds = [];
          response2.response.data.boards.forEach((item) => {
            tempBoardIds.push({ label: item.name, value: item.id });
          });
          setAllBoardId(tempBoardIds);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup action to set isMounted to false
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (isMounted && trackRequestSetting.length > 0 && buttonData.length > 0) {
      let statuses = trackRequestSetting.map((status, index) => ({
        ...status,
        key: status.label,
        children: (
          <div>
            <div>
              <label htmlFor="site_bg" className="form-label">
                Button-color<i className="bi bi-pen"></i>
              </label>
              <input
                type="color"
                className="w-100"
                id="button_bg"
                name="button_bg"
                value={getValueButtonStatus(status.label)}
                required
                onChange={(e) =>
                  handleChangeBgBtnForRequest(e, status.label, index)
                }
              />
            </div>
            <div>
              <label className="form-label">
                Background-color<i className="bi bi-pen"></i>
              </label>
              <input
                type="color"
                className="w-100"
                id="button_bg"
                name="button_bg"
                value={getValueBgStatus(status.label)}
                required
                onChange={(e) =>
                  handleChangeBgColorForRequest(e, status.label, index)
                }
              />
            </div>
          </div>
        ),
      }));

      setButtonObj(statuses);
    }

    return () => {
      isMounted = false;
    };
  }, [trackRequestSetting, buttonData]);

  const filterOption = (input, option) => {
    return (
      option.label.toLowerCase().includes(input.toLowerCase()) ||
      option.value.toString().toLowerCase().includes(input.toLowerCase())
    );
  };

  return (
    <>
      {loading && <Loader />}
      <div className="w-100 d-flex flex-column align-items-center p-2">
        <div className="col-md-7 col-lg-8 text-start">
          <h4 className="mb-3">
            <Button
              icon={
                <LeftOutlined
                  style={{
                    color: uiData.button_bg,
                    borderColor: uiData.button_bg,
                  }}
                />
              }
              onClick={handleBackNavigation}
            ></Button>
            <span className="mt-1 ms-2">General Settings</span>
          </h4>
          <hr />

          <div className="row g-3">
            <div className="col-sm-6">
              <div className="col-sm-12 mb-5">
                <label className="form-label">
                  Background-color<i className="bi bi-pen"></i>
                </label>
                <br />
                <input
                  type="color"
                  className="w-100"
                  name="site_bg"
                  id="site_bg"
                  value={uiData.site_bg}
                  required
                  onChange={handleChangeBg}
                />

                <small className="text-danger text-start ms-2"></small>
              </div>
              <div className="col-sm-12">
                <label className="form-label">
                  Button background-color&nbsp;<i className="bi bi-pen"></i>
                </label>
                <br />
                <input
                  type="color"
                  className="w-100"
                  id="button_bg"
                  name="button_bg"
                  value={uiData.button_bg}
                  required
                  onChange={handleChangeBgBtn}
                />

                <small className="text-danger text-start ms-2"></small>
              </div>
            </div>

            <div className="col-sm-6 ">
              <div className="">
                <label for="logo_image" className="form-label">
                  Choose Logo Image&nbsp;<i className="bi bi-pen"></i>
                </label>
                <input
                  className="form-control"
                  name="logo_image"
                  type="file"
                  id="logo_image"
                  onChange={handleChangeLogo}
                />

                <small className="text-danger text-start ms-2"></small>

                <div
                  id="imageContainer"
                  className="card  mt-2"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    width: "150px",
                    minHeight: "90px",
                  }}
                >
                  {logoData.logo_image === "" ? (
                    <></>
                  ) : (
                    <img src={logoData.logo_image} alt="No preview" />
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 row mt-3">
              <div className="col-sm-6">
                <label for="banner_bg" className="form-label">
                  Banner background color&nbsp;<i className="bi bi-pen"></i>
                </label>
                <br />
                <input
                  type="color"
                  className="w-100"
                  id="banner_bg"
                  name="banner_bg"
                  value={uiData.banner_bg}
                  required
                  onChange={handleChangeBgBanner}
                />

                <small className="text-danger text-start ms-2"></small>
              </div>
              <div className="col-sm-6">
                <label for="header_bg" className="form-label">
                  Header Background Color&nbsp;<i className="bi bi-pen"></i>
                </label>
                <br />
                <input
                  type="color"
                  className="w-100"
                  id="header_bg"
                  name="header_bg"
                  value={uiData.header_bg}
                  required
                  onChange={handleChangeHeaderBg}
                />

                <small className="text-danger text-start ms-2"></small>
              </div>
            </div>
            <div className="col-12">
              <div className="col-sm-12">
                <label for="head_title_color" className="form-label">
                  Heading Title Color&nbsp;<i className="bi bi-pen"></i>
                </label>
                <br />
                <input
                  type="color"
                  className="w-100"
                  id="head_title_color"
                  name="head_title_color"
                  value={uiData.head_title_color}
                  required
                  onChange={handleChangeHeadTitleColor}
                />

                <small className="text-danger text-start ms-2"></small>
              </div>
            </div>
            <div className="col-12">
              <label for="banner_content" className="form-label">
                Banner <span className="text-muted"></span>
              </label>
              <textarea
                type="text"
                className="form-control"
                name="banner_content"
                id="banner_content"
                placeholder="Enter the banner text content ."
                onChange={handleChangeBannerText}
                value={uiData.banner_content}
              ></textarea>

              <small className="text-danger text-start ms-2"></small>
            </div>
            <div className="col-12">
              <label for="form_description" className="form-label">
                Form Description <span className="text-muted"></span>
              </label>
              <textarea
                type="text"
                className="form-control"
                name="form_description"
                id="form_description"
                placeholder="Enter the Form Description ."
                onChange={handleChangeFormDescription}
                value={uiData.form_description}
              ></textarea>

              <small className="text-danger text-start ms-2"></small>
            </div>

            <div
              style={{
                marginBottom: "5px",
                fontWeight: "bold",
                fontSize: "16px",
                color: "#212529",
              }}
            >
              Track Request Setting
            </div>
            <Collapse size="large" items={buttonObj} />

            <div className="col-sm-12">
              <label className="form-label">BoardId</label>
              <Select
                placeholder="Select BoardId"
                allowClear
                showSearch
                style={{ width: "100%", borderRadius: "10px" }}
                popupMatchSelectWidth={false}
                placement="bottomLeft"
                onChange={handleChangeBoardId}
                options={allBoardId}
                value={boardId}
                filterOption={filterOption}
              />
            </div>

            {boardId.length > 0 && (
              <>
                <div className="col-sm-12">
                  <label className="form-label">Top Details column* </label>
                  <Select
                    placeholder={"Select Columns"}
                    style={{ width: "100%", borderRadius: "10px" }}
                    popupMatchSelectWidth={false}
                    placement="bottomLeft"
                    onChange={(e) => handleChangeColumn(e, "head")}
                    options={columnList}
                    value={columnSelectedData.head}
                  />
                </div>
                <div className="col-sm-12">
                  <label className="form-label">Mid Heading column* </label>
                  <Select
                    placeholder={"Select Columns"}
                    style={{ width: "100%", borderRadius: "10px" }}
                    popupMatchSelectWidth={false}
                    placement="bottomLeft"
                    onChange={(e) => handleChangeColumn(e, "mid")}
                    options={columnList}
                    value={columnSelectedData.mid}
                  />
                </div>
                <div className="col-sm-12">
                  <label className="form-label">Document Column* </label>
                  <Select
                    placeholder={"Select Documnent Column"}
                    style={{ width: "100%", borderRadius: "10px" }}
                    popupMatchSelectWidth={false}
                    placement="bottomLeft"
                    onChange={(e) => handleChangeColumn(e, "update")}
                    options={columnList}
                    value={columnSelectedData.update}
                  />
                </div>
                <div className="col-sm-12">
                  <label className="form-label">
                    Select User Email Column*{" "}
                  </label>
                  <Select
                    placeholder={"Select Email"}
                    style={{ width: "100%", borderRadius: "10px" }}
                    popupMatchSelectWidth={false}
                    placement="bottomLeft"
                    onChange={(e) => handleChangeColumn(e, "email")}
                    options={columnList}
                    value={columnSelectedData.email}
                  />
                </div>
              </>
            )}

            <Button
              style={{ background: "#5AC063", color: "white", border: "none" }}
              onClick={handleSubmit}
            >
              SAVE SETTINGS
            </Button>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
};
