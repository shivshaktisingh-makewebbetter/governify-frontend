import React, { useState } from "react";
import ReactQuill from "react-quill";
import { Button, Flex, Upload } from "antd";
import { AddFiles } from "../../assets/image";

const TextEditor = ({
  cancelUpdate,
  handleChangeTextEditor,
  updateValue,
  update,
  handleFileChange,

  props,
}) => {
  const [showEmoji, setShowEmoji] = useState(false);
  var modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] },
      ],
      [
        {
          color: [
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "#ffffff",
            "#facccc",
            "#ffebcc",
            "#ffffcc",
            "#cce8cc",
            "#cce0f5",
            "#ebd6ff",
            "#bbbbbb",
            "#f06666",
            "#ffc266",
            "#ffff66",
            "#66b966",
            "#66a3e0",
            "#c285ff",
            "#888888",
            "#a10000",
            "#b26b00",
            "#b2b200",
            "#006100",
            "#0047b2",
            "#6b24b2",
            "#444444",
            "#5c0000",
            "#663d00",
            "#666600",
            "#003700",
            "#002966",
            "#3d1466",
            "custom-color",
          ],
        },
      ],
    ],
  };

  var formats = [
    "header",
    "height",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "color",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "size",
  ];

  const handleProcedureContentChange = (content) => {
    handleChangeTextEditor(content);
  };

  const onEmojiClick = (event, emojiObject) => {
    // handleChangeEmoji(emojiObject.target, isUpdated);
    setShowEmoji(false);
    // setChosenEmoji(emojiObject);
  };

  return (
    <div className="">
      <div className="incorpify-text-editor" style={{}}>
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          placeholder="Jot something down ...."
          value={updateValue}
          onChange={handleProcedureContentChange}
          style={{ minHeight: "120px", background: "#ffffff" }}
        ></ReactQuill>
        <Flex justify="space-between" wrap className="mt-1">
          <Flex>
            <Upload
            //   {...props}
              showUploadList={false}
              onChange={(e) => handleFileChange(e, true)}
              multiple={false}
            >
              <Button type="text" icon={<AddFiles />}>
                Add files
              </Button>
            </Upload>
            {/* {!showEmoji ? (
              <Button
                type="text"
                icon={<Emoji />}
                onClick={() => setShowEmoji(true)}
              >
                Emoji
              </Button>
            ) : (
              <EmojiPicker
                reactionsDefaultOpen={false}
                onEmojiClick={onEmojiClick}

                // onReactionClick={handleReaction}
              />
            )} */}
          </Flex>
          <Flex gap={5}>
            <Button
              // size="large"
              type="text"
              onClick={() => cancelUpdate(false)}
            >
              Cancel
            </Button>
            <Button
              // size="large"
              style={{
                padding: "5px 10px",
                background: "#83acf1",
                color: "#ffffff",
              }}
              onClick={() => update()}
            >
              Update
            </Button>
          </Flex>
        </Flex>
      </div>
    </div>
  );
};

export default TextEditor;