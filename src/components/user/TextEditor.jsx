import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { Button, Flex, Upload } from "antd";
import { AddFiles, Emoji } from "../../assets/image";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const TextEditor = ({
  cancelUpdate,
  handleChangeTextEditor,
  handleChangeEmoji,
  isUpdated,
  updateValue,
  update,
  handleFileChange,
  type,
  props,
}) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const editorRef = useRef(null);
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

  const onEmojiClick = (event) => {
    handleChangeEmoji(event.native, isUpdated);
    setShowEmoji(false);
    // setChosenEmoji(emojiObject);
  };

  useEffect(() => {
    editorRef.current.focus();
  }, []);

  return (
    <div className="">
      <div className="incorpify-text-editor" style={{}}>
        <ReactQuill
          ref={editorRef}
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
              {...props}
              showUploadList={false}
              onChange={(e) => handleFileChange(e, true, type)}
              multiple={false}
            >
              <Button type="text" icon={<AddFiles />}>
                Add files
              </Button>
            </Upload>
            <span className="position-relative emoji-wrapper">
              <Button
                type="text"
                icon={<Emoji />}
                onClick={() => setShowEmoji(!showEmoji)}
              >
                Emoji
              </Button>
              {showEmoji && (
                <span className="emoji-container">
                  <EmojiPicker
                    data={data}
                    previewPosition="none"
                    // reactionsDefaultOpen={false}
                    onEmojiSelect={(e) => onEmojiClick(e)}

                    // onReactionClick={handleReaction}
                  />
                </span>
              )}
            </span>
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
