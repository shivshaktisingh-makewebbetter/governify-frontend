import { PieChart } from "../common/PieChart";
import { BarChartHorizontal } from "../common/BarChartHorizontal";
import { BarChartVertical } from "../common/BarChartVertical";
import { useEffect } from "react";

export const ServiceReportViewChart = ({
  loading,
  setLoading,
  getPieChartDataSet,
  getPieChartBg,
  getPieChartLabel,
  getPieChartBorder,
  getDataSetForVerticalBarChart,
  getStepSizeForVerticalBarChart,
  getMaxForVerticalBarChart,
  hexToRgba,
  serviceReportViewData,
  getColumnTitleForTextChart,
  getColumnValueForTextChart,
}) => {
    
  const fetchData = async () => {
   try{

   }catch(err){

   }finally{

   }


  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div style={{ marginTop: "20px" }}>
      {serviceReportViewData.map((item) => {
        return (
          <div style={{ height: item.height }}>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#818181",
                textAlign: "left",
                marginBottom: "0px",
              }}
            >
              {item.title}
            </p>
            <div style={{ position: "relative" }}>
              {item.boxes.map((subItem) => {
                if (subItem.type === "Text Chart") {
                  return (
                    <div
                      style={{
                        width: subItem.size.width,
                        height: subItem.size.height,
                        position: "absolute",
                        left: subItem.position.x,
                        top: subItem.position.y,
                        background: "white",
                        border: "1px solid #E3E3E3",
                        borderRadius: "8px",
                        padding: "10px",
                        marginBottom: "10px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              width: "100%",
                              textAlign: "left",
                              fontSize: "14px",
                              fontWeight: "400",
                              color: "#6d7175",
                              marginBottom: "6px",
                            }}
                          >
                            {getColumnTitleForTextChart(subItem.column1)}
                          </p>
                          <p
                            style={{
                              width: "100%",
                              textAlign: "left",
                              fontSize: "24px",
                              fontWeight: "600",
                              color: "#202223",
                              marginBottom: "6px",
                            }}
                          >
                            {getColumnValueForTextChart(subItem.column1)}
                          </p>
                        </div>
                        <div>
                          <p
                            style={{
                              width: "100%",
                              textAlign: "right",
                              fontSize: "16px",
                              fontWeight: "600",
                              marginBottom: "6px",
                              borderRadius: "100px",
                              background: hexToRgba(subItem.color, "0.2"),
                              padding: "6px 12px",
                              color: subItem.color,
                            }}
                          >
                            {getColumnValueForTextChart(subItem.column2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (subItem.type === "Bar Chart") {
                  return (
                    <div
                      style={{
                        width: subItem.size.width,
                        height: subItem.size.height,
                        position: "absolute",
                        left: subItem.position.x,
                        top: subItem.position.y,
                        background: "white",
                        border: "1px solid #E3E3E3",
                        borderRadius: "8px",
                        padding: "10px",
                        marginBottom: "10px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {subItem.horizontal ? (
                        <BarChartHorizontal
                          dataset={getDataSetForVerticalBarChart(subItem)}
                          stepsize={getStepSizeForVerticalBarChart(subItem)}
                          max={getMaxForVerticalBarChart(subItem)}
                          title={subItem.heading}
                          description={subItem.description}
                        />
                      ) : (
                        <BarChartVertical
                          dataset={getDataSetForVerticalBarChart(subItem)}
                          stepsize={getStepSizeForVerticalBarChart(subItem)}
                          max={getMaxForVerticalBarChart(subItem)}
                          title={subItem.heading}
                          description={subItem.description}
                        />
                      )}
                    </div>
                  );
                }

                if (subItem.type === "Pie Chart") {
                  const title = subItem.heading;
                  const dataset = getPieChartDataSet(subItem);
                  const bgSet = getPieChartBg(subItem);
                  const pieChartLabel = getPieChartLabel(subItem);
                  const borderColorSetPie = getPieChartBorder(subItem);
                  const description = subItem.description;

                  return (
                    <div
                      style={{
                        width: subItem.size.width,
                        height: subItem.size.height,
                        position: "absolute",
                        left: subItem.position.x,
                        top: subItem.position.y,
                        background: "white",
                        border: "1px solid #E3E3E3",
                        borderRadius: "8px",
                        padding: "10px",
                        marginBottom: "10px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <PieChart
                        title={title}
                        dataset={dataset}
                        bgSet={bgSet}
                        pieChartLabel={pieChartLabel}
                        borderColorSetPie={borderColorSetPie}
                        description={description}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
