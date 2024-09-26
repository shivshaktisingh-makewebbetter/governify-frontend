import { Table } from "antd";

export const ComplianceReportViewList = ({
  dataSource,
  tableColumns,
  rowSelection,
}) => {
  return (
    <div
      style={{
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
 
      }}
    >
      <Table
        className="governify-report-table custom-table"
        rowSelection={rowSelection}
        columns={tableColumns}
        dataSource={dataSource}
        pagination={{ className: "custom-pagination" }}
      />
    </div>
  );
};
