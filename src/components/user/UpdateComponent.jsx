import { Button, Flex, Popover, Upload } from "antd";
import { AdobeAcrobat, UploadIcon } from "../../assets/image";
import { useEffect, useState } from "react";
import TextEditor from "./TextEditor";
import { fetcher } from "../../utils/helper";
import UpdateAndReply from "./UpdateAndReply";
import { Loader } from "../common/Loader";
import axios from "axios";

export const UpdateComponent = ({ id, fetchData, setOpen , likeIds , getAllLikes }) => {
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

  const unlikeComment = async(commentId) => {
    setLoading(true);
    try {
      const res = await fetcher(
        `/incorpify/dislikeUpdateOrReply/${commentId}`,
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
  }
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

  const update = async () => {
    setLoading(true);
    let payload = {
      parent_id: "",
      item_id: id,
      text_body: `From ${sessionStorage.getItem("userEmail")}: ${updateValue}`,
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

  const handleFileChange = async (e, name) => {
    let files = e.file;
    let reader = new FileReader();
    if (files) {
      reader.onload = (function (theFile) {
        return async function (event) {
          let formData = new FormData();
          formData.append("item_id", id);
          formData.append("file_name", files.name);
          formData.append("file", files);
          let token =
            sessionStorage.getItem("token") ||
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29uYm9hcmRpZnkudGFzYzM2MC5jb20vY29tbW9tLWxvZ2luIiwiaWF0IjoxNzE5NDYzOTE4LCJleHAiOjE3MTk3MjMxMTgsIm5iZiI6MTcxOTQ2MzkxOCwianRpIjoiR0ZvNnp3ZHFjOW1yUnRMcCIsInN1YiI6IjM0IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.LxgEKrpXDnlLODpu9bqrRAl_H9-PZXYIzhrYNF7UBu8";
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
              if (response.success) {
                if (name) {
                  let value = `<a href="${response.data.data.add_file_to_column.url}">${response.data.data.add_file_to_column.name}</a>`;
                  setUpdateValue(value);
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
              style={{ background: "#6f74900f", borderRadius: "10px" }}
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
                  <Flex gap={10}>
                    {data.assets.map((item, i) => {
                      return (
                        <>
                          <div>
                            <a
                              href={item.public_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <AdobeAcrobat />
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
                    onChange={(e) => handleFileChange(e, false)}
                    multiple={false}
                  >
                    <Button
                      icon={<UploadIcon />}
                      size="large"
                      iconPosition="end"
                      style={{
                        padding: "5px 10px",
                        background: settingsData.button_bg,
                        color: "#ffffff",
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
                  style={{ color: "#6F7490", fontSize: "17px", padding: "0 10px" }}
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
                        handleFileChange={() => {}}
                        handleChangeEmoji={() => {}}
                        isUpdated={true}
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
                          likeIds ={likeIds.includes(item.id)}
                          unlikeComment={unlikeComment}
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
