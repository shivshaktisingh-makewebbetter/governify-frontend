import React, { useEffect, useState } from "react";
import Hero from "../common/Hero";
import { Credentials } from "../../utils/Icons";
import AddPortalButton from "./child/AddPortalButton";
import CredentialsCard from "./child/CredentialsCard";
import AddPortal from "./child/AddPortal";
import { fetcher } from "../../utils/helper";
import { ToastContainer } from "react-toastify";

const CredentialManagement = () => {
  const [portalCredentials, setPortalCredentials] = useState([]);
  const [openAddPortalDrawer, setOpenAddPortalDrawer] = useState(false);
  const [usedPortals, setUsedPortals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [portalImageAndLogo, setPortalImageAndLogo] = useState([]);

  const fetchPortals = async () => {
    const url = "governify/customer/getPortalDetails";
    const method = "GET";
    try {
      const response = await fetcher(url, method);
      if (response.status) {
        setPortalImageAndLogo(response.response);
      }
    } catch (error) {
      console.log("error");
    }
  };

  const fetchPortalCredentials = async () => {
    setLoading(true);
    let url = "governify/customer/getPortalCredentials";
    const method = "GET";
    try {
      const response = await fetcher(url, method);
      if (response.status) {
        setPortalCredentials(response.response);
      } else {
        setPortalCredentials([]);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalCredentials();
  }, []);

  useEffect(() => {
    fetchPortals();
  }, [portalCredentials]);

  useEffect(() => {
    if (portalCredentials.length) {
      let portals = [];
      portalCredentials.forEach((item) => {
        if (!portals.includes(item.portal_credential_id)) {
          portals.push(item.portal_credential_id);
        }
      });
      setUsedPortals(portals);
    }
  }, [portalCredentials]);

  return (
    <>
      <div style={{ paddingLeft: "16px", paddingRight: "16px" }}>
        <Hero
          heading={"Portal Credentials Management"}
          subheading="Manage and securely your credentials for multiple portals, ensuring easy access and efficient control."
          forHome={false}
        />
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex">
            <span>
              <a href="/" style={{ color: "#6c757d" }}>
                Home
              </a>
            </span>
            <span style={{ marginLeft: "5px" }}>
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="right"
                width="12px"
                height="12px"
                fill="#6c757d"
                aria-hidden="true"
              >
                <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
              </svg>
            </span>
            <span style={{ color: "#0D6EFD", marginLeft: "2px" }}>
              Portal Credentials Management
            </span>
          </div>
          {portalCredentials.length ? (
            <AddPortalButton setOpenAddPortalDrawer={setOpenAddPortalDrawer} />
          ) : (
            ""
          )}
        </div>
        {portalCredentials.length ? (
          <div className="mt-5">
            <div className="d-flex" style={{ gap: "24px", flexWrap: "wrap" }}>
              {portalCredentials.map((item) => {
                return (
                  <CredentialsCard
                    item={item}
                    logoAndName={portalImageAndLogo.filter(
                      (port) => port.id === item.portal_credential_id
                    )}
                    usedPortals={usedPortals}
                    portals={portalImageAndLogo}
                    fetchPortalCredentials={fetchPortalCredentials}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className="text-centre d-flex align-items-center justify-content-center flex-column"
            style={{ gap: "20px", height: "300px" }}
          >
            <div>
              <Credentials width="64px" height="64px" fill="#5C5F62" />
            </div>
            <div>
              <div className="fw-semibold fs-24" style={{ color: "#202223" }}>
                You haven't added any portal Credentials yet!
              </div>
              <div style={{ color: "#6D7175" }} className="fs-16">
                All of your portal Credentials will be displayed here.
              </div>
              <div className="mt-3 d-flex justify-content-center">
                <AddPortalButton
                  setOpenAddPortalDrawer={setOpenAddPortalDrawer}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <AddPortal
        open={openAddPortalDrawer}
        setOpenAddPortalDrawer={setOpenAddPortalDrawer}
        usedPortals={usedPortals}
        portals={portalImageAndLogo}
        fetchPortalCredentials={fetchPortalCredentials}
      />
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default CredentialManagement;
