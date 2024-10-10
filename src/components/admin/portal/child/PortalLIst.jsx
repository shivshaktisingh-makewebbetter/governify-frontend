import { Popover, Space, Table } from "antd";
import React, { useState } from "react";
import { Edit, Trash2 } from "react-feather";
import AddAndEditPortalDrawer from "./AddAndEditPortalDrawer";

const PortalLIst = ({ data, editPortalData, setEditPortalData, setOpenDeleteModal, fetchPortal }) => {
  const [openEditPortalDrawer, setOpenEditPortalDrawer] = useState(false);

  const columns = [
    {
      title: "Portal Id",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (_, record) => (
        <img width="48px" height="auto" src={record.image} alt={record.title} />
      ),
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popover content="Edit">
            <div
              onClick={() => {
                setEditPortalData(record);
                setOpenEditPortalDrawer(true);
              }}
            >
              <span
                style={{
                  background: "#EEEEEE",
                  borderRadius: "8px",
                  padding: "5px 8px",
                  cursor: "pointer",
                }}
              >
                <Edit
                  style={{
                    width: "20px",
                    height: "auto",
                    color: "#3D3D3D",
                  }}
                />
              </span>
            </div>
          </Popover>
          <Popover content="Delete">
            <div
              onClick={() => {
                setEditPortalData(record);
                setOpenDeleteModal(true);
              }}
            >
              <span
                style={{
                  background: "#FDE9E9",
                  borderRadius: "8px",
                  padding: "5px 8px",
                  cursor: "pointer",
                }}
              >
                <Trash2
                  style={{
                    width: "20px",
                    height: "auto",
                    color: "#EF4444",
                  }}
                />
              </span>
            </div>
          </Popover>
        </Space>
      ),
      width: 80,
      fixed: "right",
    },
  ];

  return (
    <>
      <div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: 768 }}
        />
      </div>
      <AddAndEditPortalDrawer
        open={openEditPortalDrawer}
        setOpenAddPortalDrawer={setOpenEditPortalDrawer}
        type="edit"
        data={editPortalData}
        fetchPortal={fetchPortal}
      />
    </>
  );
};

export default PortalLIst;
