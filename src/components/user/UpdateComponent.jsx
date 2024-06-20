import { Button, Flex, Popover, Upload } from "antd";
import { AdobeAcrobat, UploadIcon } from "../../assets/image";
import { useState } from "react";
import TextEditor from "./TextEditor";
import { fetcher } from "../../utils/helper";
import UpdateAndReply from "./UpdateAndReply";

export const UpdateComponent = ({data}) =>{

  const [showTextEditor, setShowTextEditor] = useState(false);
  const [updateValue, setUpdateValue] = useState("");
  const[loading , setLoading] = useState(false);
  const [replyValue, setReplyValue] = useState("");
  const settingsData =
  JSON.parse(sessionStorage.getItem("settings")) ||
  {
    image:
      "https://onboardify.tasc360.com/uploads/governify/1717570622_Products Logo (1).png",
    site_bg: "#ffffff",
    button_bg: "#5ac063",
    banner_bg: "#5ac063",
    banner_content:
      "Hire an attitude, not just experience and qualification. Greg Savage.",
    header_bg: "#f7f7f7",
    head_title_color: "#5ac063"
  };

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

  const reply = async (mode, id) => {
    setLoading(true);
    let payload = {
      mode: mode,
      update_id: data.id,
      item_id: id,
      text_body: `From ${sessionStorage.getItem("userEmail")}: ${replyValue}`,
    };
    try {
      const reply = await fetcher(
        "governify/customer/addGovernifyLike",
        "POST",
        JSON.stringify(payload)
      );
      if (reply.status) {
        // getSubItemData();
        setReplyValue("");
      } else {
        // toast.error("Something went wrong!");
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };


  const update = async () => {
    setLoading(true);
    let payload = {
      parent_id: "",
      item_id: data.id,
      text_body: `From ${localStorage.getItem("userEmail")}: ${updateValue}`,
    };
    try {
      const response = await fetcher(
        "governify/customer/addGovernifyLike",
        "POST",
        JSON.stringify(payload)
      );
      if (response.success) {
        // getSubItemData();
        setUpdateValue("");
      } else {
        // toast.error("Something went wrong!");
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const handleFileChange =  async (e , name) =>{
    let files = e.file;
    let fileData = {};
    let reader = new FileReader();
    if (files) {
      reader.onload = (function (theFile) {
        return async function (event) {
          fileData = {
            item_id: data.id,
            file_name: files.name,
            file: event.target.result,
          };
          try {
            setLoading(true);
            const res = await fetcher(
              "/incorpify/uploadMondayFiles",
              "POST",
              JSON.stringify(fileData)
            );
            if (res.success) {
              if (name) {
                setUpdateValue(files.name);
              }
              // getSubItemData();
            } else {
              // toast.error("Something went wrong!");
              setLoading(false);
            }
          } catch (error) {
            // toast.error("Something went wrong!");
            setLoading(false);
          }
        };
      })(files);

      reader.readAsDataURL(files);
    }
  }


    return (<div style={{overflowY:"auto" ,maxHeight:"600px" }}>

      <div
        className="text-start inc-detail-container"
        style={{ background: "#6f74900f", borderRadius: "10px"  }}
      >
        <div style={{color:"#6F7490" ,fontWeight: "bold" ,display: "flex" ,
          justifyContent: "center" , fontSize: "23px" , paddingTop:"10px"}}>{data.name}</div>
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
          {data.updates.length > 0 && (
  <Flex gap={10}>
    {data.updates.map((item, i) => (
      <div key={i} style={{display:"flex" ,justifyContent:"start" , gap:"10px"}}>
        {item.assets.map((asset, j) => ( 
          <div key={j}>
            <div >
              <a href={asset.url} target="_blank" rel="noreferrer">
                <AdobeAcrobat />
              </a>
              <div className="mt-1">
                <Popover content={asset.name} trigger="hover">
                  <span>{asset.name.slice(0, 6)}...</span>
                </Popover>
              </div>
            </div>
          </div>
        ))}
      </div>
    ))}
  </Flex>
)}
          <span>
            <Upload
              // {...props}
              showUploadList={false}
              onChange={(e) => handleFileChange(e , false)}
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
            style={{ color: "#6F7490", fontSize: "17px" }}
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
                  handleFileChange={()=>{}}
                  handleChangeEmoji={()=>{}}
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
                  onFocus={()=>{setShowTextEditor(true)}}
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
                  />
                );
              })}
          </div>
         
        </div>
      </div>
   
    </div>)
}