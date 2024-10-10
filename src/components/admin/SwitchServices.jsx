import { Select } from "antd";
import { useEffect, useState } from "react";
import { fetcher } from "../../utils/helper";

export const SwitchServices = ({
  data,
  setShowSkeleton,
  setLoading,
  loading,
  setSwapModal,
  updateDataSource,
}) => {
  const settingsData = JSON.parse(sessionStorage.getItem("settings"));
  const [categoryListig, setCategoryListing] = useState([]);
  const [serviceData, setServiceData] = useState({
    title: "",
    description: "",
    image: "",
    image_name: "",
    form: "",
    service_categorie_id: "",
  });

  const [dataFound, setFoundData] = useState([]);

  const handleCategoryChange = (e) => {
    const tempData = [];
    data.forEach((item) => {
      // if(e === item.service_categorie_id){
      tempData.push(item);
      // }
    });
    setFoundData(tempData);

    setServiceData({ ...serviceData, service_categorie_id: e });
  };

  const getAllCategories = async () => {
    let method = "GET";
    let url = "governify/admin/serviceCategories";

    try {
      const response = await fetcher(url, method);
      if (response.status) {
        setCategoryListing(
          response.response.map((item) => {
            return { label: item.title, value: item.id };
          })
        );
        setShowSkeleton(false);
      }
    } catch (err) {
      throw new Error("Network response was not ok ", err);
    }
  };

  const styles = {
    headerParent: {
      backgroundColor: "#5AC063",
    },
    header: {
      padding: "10px",
      textAlign: "left",
      borderBottom: "2px solid #ddd",
      color: "white",
      paddingTop: "15px",
      paddingBottom: "15px",
    },
    headerFirst: {
      padding: "10px",
      textAlign: "left",
      borderBottom: "2px solid #ddd",
      color: "white",
      paddingTop: "15px",
      paddingBottom: "15px",
      borderTopLeftRadius: "5px",
    },
    headerLast: {
      padding: "10px",
      textAlign: "left",
      borderBottom: "2px solid #ddd",
      color: "white",
      paddingTop: "15px",
      paddingBottom: "15px",
      borderTopRightRadius: "5px",
    },
    row: {
      backgroundColor: "#ffffff",
      transition: "background-color 0.3s ease",
    },
    cell: {
      padding: "8px",
      borderBottom: "1px solid #ddd",
      paddingTop: "15px",
      paddingBottom: "15px",
      textAlign: "left",
    },
    spanPadding: {
      paddingRight: "10px",
    },
  };

  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetItem) => {
    e.preventDefault();
    let payloadData = [];
    let url = "governify/admin/serviceRequests/swap";
    let method = "POST";

    const updatedData = [...dataFound];
    const fromIndex = updatedData.findIndex((i) => i.id === draggedItem.id);
    const toIndex = updatedData.findIndex((i) => i.id === targetItem.id);

    if (fromIndex !== toIndex) {
      const [removed] = updatedData.splice(fromIndex, 1);
      updatedData.splice(toIndex, 0, removed);
      data.forEach((item, index) => {
        if (item.service_categorie_id === serviceData.service_categorie_id) {
          payloadData.push({ from: updatedData[index].id, to: index + 1 });
        } else {
          payloadData.push({
            from: updatedData[index].id,
            to: updatedData[index].id,
          });
        }
      });
      let payload = {
        service_request: payloadData,
      };
      setFoundData(updatedData);
      const response = await fetcher(url, method, JSON.stringify(payload));
      if (response.status) {
        updateDataSource(response.response);

        setSwapModal(false);
      }
    }

    setDraggedItem(null);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <>
      <div
        title="status visibility manage"
        style={{ maxWidth: "550px", width: "100%", marginTop: "25px" }}
      >
        <div>
          <div className="text-white" style={{ backgroundColor: "#59C080" }}>
            <p className="p-2 m-0 fs-5">
              <strong>Switch Services</strong>
            </p>
          </div>
          <div
            className="form_wrapper border border-success p-4 primary-shadow"
            style={{ overflowY: "auto" }}
          >
            <Select
              showSearch
              placeholder="Select Category"
              style={{ width: "100%" }}
              popupMatchSelectWidth={false}
              placement="bottomLeft"
              onChange={handleCategoryChange}
              options={categoryListig}
            />

            {dataFound.length > 0 && (
              <div className="mt-10">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={styles.headerParent}>
                      {/* <th style={styles.headerFirst}>Index</th> */}
                      <th style={styles.headerFirst}>Title</th>
                      <th style={styles.header}>
                        <span style={styles.spanPadding}>|</span>Description
                      </th>
                      <th style={styles.header}>
                        <span style={styles.spanPadding}>|</span>Linked Category
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataFound.map((item) => {
                      if (
                        item.service_categorie_id ===
                        serviceData.service_categorie_id
                      ) {
                        return (
                          <tr
                            style={styles.row}
                            key={item.id}
                            onDragStart={(e) => handleDragStart(e, item)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, item)}
                            draggable
                          >
                            {/* <td style={styles.cell}>{item.id}</td> */}
                            <td style={styles.cell}>{item.title}</td>
                            <td style={styles.cell}>{item.description}</td>
                            <td style={styles.cell}>
                              {item.service_categorie.title}
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
