import { Button } from "antd";
import { ExportIcon } from "../utils/Icons";

export const ExportBy = ({ handleExport }) => {
  return (
    <>
      <Button
        style={{ display: "flex", alignItems: "center", gap: "5px" }}
        type="text"
        className="governify-sortby-button"
        onClick={handleExport}
      >
        {" "}
        <span>
          <ExportIcon />
        </span>
        <span className="fs-16 text-color-928f8f">Export</span>{" "}
      </Button>
    </>
  );
};
