import {
  ComplianceReportIconEmpty,
  ServiceReportIconEmpty,
} from "../../assets/image";

export const EmptyReports = ({ activeReport }) => {
  return (
    <>
      {activeReport === "service" && (
        <div
          style={{
            marginTop: "12px",
            padding: "24px",
            background: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #858b932E",
            borderRadius: "8px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          <span
            style={{
              fontWeight: "600",
              fontSize: "24px",
              lineHeight: "33.6px",
              color: "#202223",
              fontFamily: "Graphie-Regular",
            }}
          >
            Service Reports
          </span>{" "}
        </div>
      )}
      <div
        style={{
          background: "white",
          margin: "auto",
          marginTop: "10px",
          marginLeft: "20px",
          marginRight: "20px",
          padding: "40px 0 56px 0",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div>
          {activeReport === "compliance" ? (
            <ComplianceReportIconEmpty />
          ) : (
            <ServiceReportIconEmpty />
          )}
        </div>
        <div>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "600",
              lineHeight: "33.6px",
              textAlign: "center",
              color: "#202223",
            }}
          >
            You do not have any reports Yet!
          </p>
          <p
            style={{
              fontSize: "16px",
              fontWeight: "400",
              lineHeight: "22.4px",
              textAlign: "center",
              color: "#6d7175",
            }}
          >
            {activeReport === "compliance"
              ? "All of your Compliance Reports will appear here."
              : "All of your Service Reportss will appear here."}
          </p>
        </div>
      </div>
    </>
  );
};
