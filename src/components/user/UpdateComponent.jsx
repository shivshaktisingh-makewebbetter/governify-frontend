import { Button, Flex, Popover, Upload } from "antd";
import {
  AdobeAcrobat,
  AiIcon,
  ApkIcon,
  CssIcon,
  Csvicon,
  DmgIcon,
  Docicon,
  Docxicon,
  HtmlIcon,
  Jpegicon,
  Jpgicon,
  Mp3icon,
  Mp4icon,
  Pngicon,
  PptIcon,
  PptxIcon,
  PsdIcon,
  RarIcon,
  Svgicon,
  Txticon,
  UploadIcon,
  XlsIcon,
  Xlsxicon,
  ZipIcon,
} from "../../assets/image";
import { useEffect, useState } from "react";
import TextEditor from "./TextEditor";
import { appendEmoji, fetcher } from "../../utils/helper";
import UpdateAndReply from "./UpdateAndReply";
import { Loader } from "../common/Loader";
import axios from "axios";
import { toast } from "react-toastify";

export const UpdateComponent = ({
  id,
  fetchData,
  setOpen,
  likeIds,
  getAllLikes,
  description
}) => {
  const [data, setData] = useState("");
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [updateValue, setUpdateValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyValue, setReplyValue] = useState("");
  
  const settingsData = JSON.parse(sessionStorage.getItem("settings")) || {
    image:
      "https://onboardify.tasc360.com/uploads/governify/1717570622_Products Logo (1).png",
    site_bg: "#ffffff",
    button_bg: "#5ac063",
    banner_bg: "#5ac063",
    banner_content:
      "Hire an attitude, not just experience and qualification. Greg Savage.",
    header_bg: "#f7f7f7",
    head_title_color: "#5ac063",
  };

  const unlikeComment = async (commentId) => {
    setLoading(true);
    try {
      const res = await fetcher(
        `incorpify/dislikeUpdateOrReply/${commentId}`,
        "DELETE"
      );
      if (res.success) {
        await getAllLikes();
        setLoading(false);
      } else {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };
  const props = {
    multiple: true,
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

  const cancelUpdate = (value) => {
    setShowTextEditor(false);
  };
  const handleChangeReplyValue = (content) => {
    setReplyValue(content);
  };
  const handleChangeTextEditor = (content) => {
    setUpdateValue(content);
  };

  const reply = async (mode, updateId) => {
    setLoading(true);
    let payload = {
      mode: mode,
      update_id: updateId,
      item_id: id,
      item_type: "update",
      text_body: `From ${sessionStorage.getItem("userEmail")}: ${replyValue}`,
    };
    try {
      const reply = await fetcher(
        "incorpify/updateReplyOrLike",
        "POST",
        JSON.stringify(payload)
      );
      if (reply.success) {
        // getSubItemData();
        setReplyValue("");
        newFetchData();
        if (mode === "like") {
          getAllLikes();
        }
      } else {
        // toast.error("Something went wrong!");
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const newFetchData = async () => {
    setLoading(true);
    try {
      let url = `incorpify/getSubItemDetailsById/${id}`;
      let method = "GET";
      const response = await fetcher(url, method);
      if (response.success) {
        setData(response.data.response.data.items[0]);
      }
    } catch (err) {
      console.log(err, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmoji = (content, isUpdate) => {
    let value = appendEmoji(updateValue, content);
    if (isUpdate) {
      handleChangeTextEditor(value);
    } else {
      handleChangeReplyValue(value);
    }
  };

  const update = async () => {
    setLoading(true);
    let payload = {
      parent_id: "",
      item_id: id,
      text_body: `From ${sessionStorage.getItem("userEmail")}: ${updateValue}`,
      email: sessionStorage.getItem("userEmail"),
    };
    try {
      const response = await fetcher(
        "incorpify/update",
        "POST",
        JSON.stringify(payload)
      );
      if (response.success) {
        // getSubItemData();
        setUpdateValue("");
        newFetchData();
      } else {
        // toast.error("Something went wrong!");
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const getSvgIcon = (name) => {
    let tempArray = name.split(".");
    let svgType = tempArray[tempArray.length - 1];

    let icons = {
      csv: <Xlsxicon />,
      doc: <Docicon />,
      docx: <Docxicon />,
      png: <Pngicon />,
      jpg: <Jpgicon />,
      jpeg: <Jpegicon />,
      mp4: <Mp4icon />,
      svg: <Svgicon />,
      xlsx: <Xlsxicon />,
      pdf: <AdobeAcrobat />,
      mp3: <Mp3icon />,
      txt: <Txticon />,
      ppt: <PptIcon />,
      psd: <PsdIcon />,
      dmg: <DmgIcon />,
      ai: <AiIcon />,
      html: <HtmlIcon />,
      css: <CssIcon />,
      xls: <XlsIcon />,
      zip: <ZipIcon />,
      apk: <ApkIcon />,
      pptx: <PptxIcon />,
      rar: <RarIcon />,
    };
    
    return icons[svgType] !== undefined ? icons[svgType] : <AdobeAcrobat />;
  };

  const handleFileChange = async (e, name, mode) => {
    let files = e.file;
    let reader = new FileReader();
    if (files) {
      reader.onload = (function (theFile) {
        return async function (event) {
          let formData = new FormData();
          formData.append("item_id", id);
          formData.append("file_name", files.name);
          formData.append("file", files);
          let token = sessionStorage.getItem("token");
          try {
            setLoading(true);
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
            setTimeout(() => {
              if (response.data.success) {
                toast.success(files.name +" Updated.")
                if (name) {
                  let value = `<a href="${response.data.data.data.add_file_to_column.url}">${response.data.data.data.add_file_to_column.name}</a>`;
                  if (mode === "update") {
                    setUpdateValue(updateValue + value);
                  } else {
                    setReplyValue(replyValue + value);
                  }
                }
                newFetchData();
              } else {
                setLoading(false);
              }
            }, 2000);
          } catch (error) {
            setLoading(false);
          }
        };
      })(files);

      reader.readAsDataURL(files);
    }
  };

  useEffect(() => {
    newFetchData();
  }, []);

  return (
    <>
      {loading && (
        <div>
          <Loader />
        </div>
      )}
      {data === "" ? (
        <div style={{ height: "600px" }}></div>
      ) : (
        <div className="mt-24">
          <div style={{ overflowY: "auto", maxHeight: "600px" }}>
            <div
              className="text-start inc-detail-container"
              style={{ borderRadius: "10px" }}
            >
              <div
                style={{
                  color: "#6F7490",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "23px",
                  paddingTop: "10px",
                }}
              >
                {data.name}
              </div>
              <div
                style={{
                  color: "#6F7490",
                  fontWeight: "400",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "18px",
                  paddingTop: "10px",
                  textAlign:"center"
                }}
              >
                {description}
              </div>
              <div
                className="d-flex flex-column border-bottom py-3 p-10"
                style={{ gap: "20px" }}
              >
                <span
                  className="fw-bold"
                  style={{ color: "#6F7490", fontSize: "17px" }}
                >
                  Documents
                </span>
                {data.assets.length > 0 && (
                  <Flex gap={10} wrap>
                    {data.assets.map((item, i) => {
                      return (
                        <>
                          <div>
                            <a
                              href={item.public_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {getSvgIcon(item.name)}
                              {/* <AdobeAcrobat /> */}
                            </a>
                            <div className="mt-1">
                              <Popover content={item.name} trigger="hover">
                                <span>{item.name.slice(0, 6)}...</span>
                              </Popover>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </Flex>
                )}
                <span>
                  <Upload
                    {...props}
                    showUploadList={false}
                    onChange={(e) => handleFileChange(e, false, "update")}
                  >
                    <Button
                      className="fs-12 fw-700"
                      icon={<UploadIcon />}
                      size="large"
                      iconPosition="end"
                      style={{
                        background: "#00B34D",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "10px",
                        width: "100px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }}
                    >
                      Upload
                    </Button>
                  </Upload>
                </span>
              </div>
              <div
                className="d-flex flex-column"
                style={{ paddingBottom: "15px", paddingTop: "15px" }}
              >
                <span
                  className="fw-bold"
                  style={{
                    color: "#6F7490",
                    fontSize: "17px",
                    padding: "0 10px",
                  }}
                >
                  Latest Updates
                </span>
                <div className="mt-4 incorpify-comment-section p-10">
                  {showTextEditor ? (
                    <div>
                      <TextEditor
                        cancelUpdate={cancelUpdate}
                        handleChangeTextEditor={handleChangeTextEditor}
                        updateValue={updateValue}
                        update={update}
                        handleFileChange={handleFileChange}
                        handleChangeEmoji={handleChangeEmoji}
                        isUpdated={true}
                        type="update"
                        props={props}
                      />
                    </div>
                  ) : (
                    <span className="d-block">
                      <input
                        type="text"
                        placeholder="Write an update..."
                        className="w-100 border border-info-subtle incorpify-update-input"
                        style={{ borderRadius: "5px", padding: "5px 10px" }}
                        onFocus={() => {
                          setShowTextEditor(true);
                        }}
                        // disabled={showTextEditor}
                      />
                    </span>
                  )}
                  {data.updates.length > 0 &&
                    data.updates.map((item, i) => {
                      return (
                        <UpdateAndReply
                          item={item}
                          key={i}
                          reply={reply}
                          handleChangeReplyValue={handleChangeReplyValue}
                          replyValue={replyValue}
                          handleFileChange={handleFileChange}
                          handleChangeEmoji={handleChangeEmoji}
                          isUpdated={true}
                          likeIds={likeIds.includes(item.id)}
                          unlikeComment={unlikeComment}
                          props={props}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
