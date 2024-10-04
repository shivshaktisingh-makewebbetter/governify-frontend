import { Button, Table } from "antd";
import { ExportReportViewIcon } from "../../assets/image";

export const ComplianceReportViewList = ({
  dataSource,
  tableColumns,
  rowSelection,
  activeReport ,
  activeView ,
  noData ,
  selectedRowKeys ,
  handleExport
}) => {
  return (
    <div
      style={{
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
        marginLeft:"20px" ,
        marginRight:"20px" , 
      }}
    >
      {activeReport === "compliance" &&
        !noData &&
        activeView === "list" &&
        selectedRowKeys.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "white",
              padding: "16px",
            }}
          >
            <span
              style={{
                color: "#5ac063",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              {selectedRowKeys.length} items selected
            </span>
            <Button
              style={{
                background: "#5ac063",
                color: "white",
                border: "none",
                fontSize: "16px",
                fontWeight: 600,
                height: "35px",
              }}
              icon={<ExportReportViewIcon />}
              iconPosition="start"
              onClick={handleExport}
            >
              Export{" "}
            </Button>
          </div>
        )}

      <Table
        scroll={{ x: 768 }}
        className="governify-report-table custom-table"
        rowSelection={rowSelection}
        columns={tableColumns}
        dataSource={dataSource}
        pagination={{ className: "custom-pagination" }}
      />
    </div>
  );
};
