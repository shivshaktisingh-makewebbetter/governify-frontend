import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

export const CustomTooltip = ({ description }) => {
  return (
    <span style={{ marginLeft: "10px" , cursor:"pointer" }}>
      <Tooltip placement="top" title={description}>
        <InfoCircleOutlined style={{ fontSize: "14px" }} />
      </Tooltip>
    </span>
  );
};
