import { Button, Card, Modal, Typography } from "antd";
import { fetcher } from "../utils/helper";
import { useEffect, useState } from "react";
import { Loader } from "./common/Loader";
import { UpdateComponent } from "./user/UpdateComponent";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer } from "react-toastify";

export const RequestComponent = ({ data, boardId, fetchData ,     statusItems }) => {
  const [open, setOpen] = useState(false);
  const [likeIds, setLikeIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState();

  const getBgColor = (item) => {
  
    if (item === 5) {
      return "#e7e7e8";
    }
    if (item === 5) {
      return "#e7e7e8";
    }
    if (item === 1) {
      return "#83f19c4a";
    }
    if (item === 0) {
      return "#f4c71f4a";
    }
    if (item === 2) {
      return "#e118184a";
    }
    if (item === 3) {
      return "#b6b6ba";
    }
  };

  const getStatusColor = (item) => {
    if (item === 5) {
      return "#939498";
    }
    if (item === 1) {
      return "#29CF10";
    }
    if (item === 0) {
      return "#F4981F";
    }
    if (item === 2) {
      return "#E14014";
    }
    if (item === 3) {
      return "#757575";
    }
  };

  const getAllLikes = async () => {
    let ids = [];
    let likes = await fetcher("incorpify/listAllLikes", "GET");
    if (likes.success) {
      likes.data.map((item) => {
        ids.push(item.item_type_id);
      });
    } else {
      ids = [];
    }

    setLikeIds(ids);
  };

  const getStatusText = (item) => {
   
   
    if (item  === 1) {
      return "COMPLETED";
    }
    if (item === 0) {
      return "IN PROGRESS";
    }
    if (item === 2) {
      return "PENDING";
    }
    if (item === 3) {
      return "CANCELLED";
    }
    if (item === 5) {
      return "AWAITING ACTION";
    }
  };

  const getCreatedDate = (dateStr) => {
    const date = new Date(dateStr);

    // Define options for formatting the date
    const options = { year: "numeric", month: "long", day: "numeric" };

    // Format the date
    const formattedDate = date.toLocaleDateString("en-US", options);

    // Create the final string
    const result = `Created at ${formattedDate}`;

    return result;
  };

  const cancelRequest = async (item) => {
    let endpoint = "governify/customer/cancelRequest";
    let method = "POST";
    let payload = JSON.stringify({
      request_id: item.id,
      board_id: boardId,
      column_id: "status__1",
      value: "Canceled",
    });
    // setLoading(true);

    try {
      const response = await fetcher(endpoint, method, payload);
      if (response.status) {
        fetchData();
      }
    } catch (err) {
    } finally {
      // setLoading(false)
    }
  };

  const handleUpdate = (details) => {
    setRequestId(details.id);
    setOpen(!open);
  };

  const revokeCancelRequest = async (item) => {
    let endpoint = "governify/customer/reverseCancelRequest";
    let method = "POST";
    let payload = JSON.stringify({
      board_id: boardId,
      pulse_id: item.id,
      column_id: "status__1",
    });
    try {
      const response = await fetcher(endpoint, method, payload);
      if (response.status) {
        fetchData();
      }
    } catch (err) {}
  };

  const getCategoryName = (item) => {
    let tempCategoryName = "Category";
    item.column_values.forEach((subItem) => {
      if (subItem.id === "service_category__1") {
        tempCategoryName = subItem.text;
      }
    });

    return tempCategoryName;
  };

  const getStatusKey = (item) =>{
  let tempStatus = '';
  let key = 0;
    item.column_values.forEach((subItem)=>{
      if(subItem.id === 'status__1'){
         tempStatus = subItem.label;
      }
    })

    statusItems.forEach((subItem ) =>{
      if(tempStatus === subItem.label){
          key = subItem.key;
      }
    })

  console.log(key)
  return key;
  }

  useEffect(() => {
    getAllLikes();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {data.map((item, index) => {
           const getKey = getStatusKey(item);
        const bgColor = getBgColor(getKey);
        const statusColor = getStatusColor(getKey);
        const statusText = getStatusText(getKey);
        const createdDate = getCreatedDate(item.created_at);
        const categoryName = getCategoryName(item);
     
        return (
          <Card
            style={{ background: bgColor, marginBottom: "24px" }}
            key={index}
          >
            <Typography style={{ textAlign: "left" }}>
              <span className="text-color-928f8f fs-15">{categoryName}</span>{" "}
              <span style={{ color: "#212529bf" }}>|</span>{" "}
              <span className="text-color-928f8f fs-15">{createdDate}</span>
            </Typography>
            <Typography
              className="mt-8 mb-8 fs-26 text-color-434343 fw-700 font-family-hind"
              style={{ textAlign: "left" }}
            >
              {item.name}
            </Typography>
            <Typography
              className="mt-16 mb-8 fs-17 fw-800 font-family-hind"
              style={{ textAlign: "left", color: statusColor }}
            >
              {statusText}
            </Typography>
            <div
              className="mt-24"
              style={{ display: "flex", justifyContent: "start", gap: "10px" }}
            >
              {getKey === 5 && (
                <div>
                  <Button
                    style={{
                      background: statusColor,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      height: "40px",
                      borderRadius: "10px",
                      border: "none",
                    }}
                    className="border-radius-10"
                    onClick={() => handleUpdate(item)}
                  >
                    <span className="fs-12 fw-700 font-family-montse">
                      Updates
                    </span>{" "}
                    <span className="fs-16">
                      <i className="bi bi-arrow-right-circle-fill"></i>
                    </span>
                  </Button>
                </div>
              )}
              {getKey === 1 && (
                <div>
                  <Button
                    style={{
                      background: "#00B34D",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      height: "40px",
                      borderRadius: "10px",
                      border: "none",
                    }}
                    className="border-radius-10"
                    onClick={() => handleUpdate(item)}
                  >
                    <span className="fs-12 fw-700 font-family-montse">
                      Updates
                    </span>{" "}
                    <span className="fs-16">
                      <i className="bi bi-arrow-right-circle-fill"></i>
                    </span>
                  </Button>
                </div>
              )}
              {getKey === 0 && (
                <div style={{ display: "flex", gap: "20px" }}>
                  <Button
                    style={{
                      background: statusColor,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      height: "40px",
                      borderRadius: "10px",
                      border: "none",
                    }}
                    className="border-radius-10"
                    onClick={() => handleUpdate(item)}
                  >
                    <span className="fs-12 fw-700 font-family-montse">
                      Updates
                    </span>{" "}
                    <span className="fs-16">
                      <i className="bi bi-arrow-right-circle-fill"></i>
                    </span>
                  </Button>
                  <Button
                    style={{
                      color: statusColor,
                      display: "flex",
                      background: "transparent",
                      borderColor: statusColor,
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      height: "40px",
                      borderRadius: "10px",
                    }}
                    className="border-radius-10"
                  >
                    <span
                      className="fs-12 fw-700 font-family-montse"
                      onClick={() => cancelRequest(item)}
                    >
                      Cancel Request
                    </span>{" "}
                  </Button>
                </div>
              )}
              {getKey === 2 && (
                <div style={{ display: "flex", gap: "20px" }}>
                  <Button
                    style={{
                      background: statusColor,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      height: "40px",
                      borderRadius: "10px",
                      border: "none",
                    }}
                    className="border-radius-10"
                    onClick={() => handleUpdate(item)}
                  >
                    <span className="fs-12 fw-700 font-family-montse">
                      Updates
                    </span>{" "}
                    <span className="fs-16">
                      <i className="bi bi-arrow-right-circle-fill"></i>
                    </span>
                  </Button>
                  <Button
                    style={{
                      color: statusColor,
                      display: "flex",
                      background: "transparent",
                      borderColor: statusColor,
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      height: "40px",
                      borderRadius: "10px",
                    }}
                    className="border-radius-10"
                  >
                    <span
                      className="fs-12 fw-700 font-family-montse"
                      onClick={() => cancelRequest(item)}
                    >
                      Cancel Request
                    </span>{" "}
                  </Button>
                </div>
              )}
              {getKey === 3 && (
                <div>
                  <Button
                    style={{
                      background: statusColor,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      height: "40px",
                      borderRadius: "10px",
                      border: "none",
                    }}
                    className="border-radius-10"
                    onClick={() => revokeCancelRequest(item)}
                  >
                    <span className="fs-12 fw-700 font-family-montse">
                      Revoke
                    </span>{" "}
                    <span className="fs-16">
                      <i className="bi bi-arrow-right-circle-fill"></i>
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </Card>
        );
      })}

      <Modal
        open={open}
        centered
        footer={(_) => <></>}
        onCancel={() => setOpen(false)}
        width={800}
      >
        <UpdateComponent
          key={uuidv4()}
          id={requestId}
          fetchData={fetchData}
          setOpen={setOpen}
          likeIds={likeIds}
          getAllLikes={getAllLikes}
        />
      </Modal>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
