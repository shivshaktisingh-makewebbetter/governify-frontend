import {
  PlusOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import PortalLIst from "./child/PortalLIst";
import { fetcher } from "../../../utils/helper";
import { Loader } from "../../common/Loader";
import AddAndEditPortalDrawer from "./child/AddAndEditPortalDrawer";
import { toast, ToastContainer } from "react-toastify";
import DeletPortalModal from "./child/DeletPortalModal";

const Portals = () => {
  const [portalList, setPortalList] = useState([]);
  const [openAddPortalDrawer, setOpenAddPortalDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editPortalData, setEditPortalData] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const fetchPortal = async () => {
    setLoading(true);
    const url = "governify/admin/getPortalDetails";
    const method = "GET";
    try {
      const res = await fetcher(url, method);
      if (res.status) {
        let portals = [];
        res.response.forEach((item) => {
          portals.push({
            id: item.id,
            image: item.file_location,
            name: item.title,
            size: item.image_size,
          });
        });
        setPortalList(portals);
      } else {
        setPortalList([]);
      }
    } catch (error) {
      console.log("something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const deletePortal = async () => {
    setLoading(true);
    const url = `governify/admin/deletePortalDetails/${editPortalData.id}`;
    const method = "DELETE";
    try {
      const res = await fetcher(url, method);
      if (res.status) {
        toast.success(res.message);
        setOpenDeleteModal(false);
        fetchPortal();
      } else {
        toast.error("Something goes wrong! while deleting this portal.");
      }
    } catch (error) {
      toast.error("Something goes wrong! while deleting this portal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortal();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="mt-5">
        <div className="d-flex align-items-center justify-content-between">
          <span className="fs-20 fw-semibold">Portal List</span>
          {portalList.length ? (
            <button
              style={{
                background: "#00BF63",
                color: "#fff",
                maxWidth: "224px",
                borderRadius: "8px",
                gap: "5px",
                padding: "10px 20px",
              }}
              className={`border-0 d-flex align-items-center justify-content-center`}
              onClick={() => setOpenAddPortalDrawer(true)}
            >
              <PlusOutlined className="fs-semibold fs-16" />
              <span className="fs-semibold fs-16">Add Portal</span>
            </button>
          ) : (
            ""
          )}
        </div>
        {portalList.length ? (
          <div className="mt-4">
            <PortalLIst
              data={portalList}
              editPortalData={editPortalData}
              setEditPortalData={setEditPortalData}
              setOpenDeleteModal={setOpenDeleteModal}
              fetchPortal={fetchPortal}
            />
          </div>
        ) : (
          <div
            className="text-centre d-flex align-items-center mt-3 justify-content-center flex-column"
            style={{ gap: "20px", height: "300px" }}
          >
            <div>
              <ProductOutlined style={{ fontSize: "64px", color: "#00BF63" }} />
            </div>
            <div>
              <div className="fw-semibold fs-24" style={{ color: "#202223" }}>
                You haven't added any portal yet!
              </div>
              <div style={{ color: "#6D7175" }} className="fs-16">
                All of your portal will be displayed here.
              </div>
              <div className="mt-3 d-flex justify-content-center">
                <button
                  style={{
                    background: "#00BF63",
                    color: "#fff",
                    maxWidth: "224px",
                    borderRadius: "8px",
                    gap: "5px",
                    padding: "10px 20px",
                  }}
                  className={`border-0 d-flex align-items-center justify-content-center`}
                  onClick={() => setOpenAddPortalDrawer(true)}
                >
                  <PlusOutlined className="fs-semibold fs-16" />
                  <span className="fs-semibold fs-16">Add Portal</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" />
      <AddAndEditPortalDrawer
        open={openAddPortalDrawer}
        setOpenAddPortalDrawer={setOpenAddPortalDrawer}
        type="add"
        fetchPortal={fetchPortal}
      />
      <DeletPortalModal
        open={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        editPortalData={editPortalData}
        setEditPortalData={setEditPortalData}
        deletePortal={deletePortal}
      />
    </>
  );
};

export default Portals;
