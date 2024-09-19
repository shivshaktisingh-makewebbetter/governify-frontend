import React from "react";
import Hero from "../common/Hero";
import { BreadcrumbComponent } from "../common/BreadcrumbComponent";
import { useLocation } from "react-router-dom";

const CredentialManagement = () => {
  let location = useLocation();
  const breadCrumbData = ['Portal Credentials Management'];
  return (
    <div style={{ paddingLeft: "16px", paddingRight: "16px" }}>
      {/* {loading && <Loader />} */}
      <Hero
        heading={"Portal Credentials Management"}
        subheading="Easily monitor, manage, and track the status and progress of all your service requests in real-time."
        forHome={false}
      />
      <BreadcrumbComponent data={breadCrumbData} />
    </div>
  );
};

export default CredentialManagement;
