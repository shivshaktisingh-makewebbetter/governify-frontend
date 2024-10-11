import React from "react";
import { userSettingData } from "../../utils/tools";

const StepCard = ({ step }) => {
  const { link_btn_color, link_btn_bg } = userSettingData();
  return (
    <div
      className="w-100 border-bottom d-flex align-item-center justify-content-between text-start p-3"
      style={{ gap: "5px" }}
    >
      <div className="step-count fs-1 ">
        <span
          className="fw-bolder ff-ws "
          style={{ fontSize: "70px", color: link_btn_bg }}
        >
          {step < 10 ? "0" + step : step}
        </span>
      </div>
      <div className="m-0 p-0 d-flex flex-column align-items-start justify-content-center">
        <p className="fs-4 fw-bolder m-0 p-0 my-1">
          Preparing and submitting documents
        </p>
        <p
          className={`status fw-bold  ${
            step % 2 ? "text-warning" : "text-success"
          } m-0 p-0`}
        >
          {step % 2 ? "In Progress" : "Completed"}
        </p>
      </div>
      <div className="d-flex flex-column align-items-start justify-content-center">
        <strong className="text-secondary my-1">Last Update</strong>
        <small className="text-secondary my-1">January 26, 2024</small>
      </div>

      <div className="d-flex align-items-center">
        <button
          style={{ background: link_btn_bg, color: link_btn_color }}
          className="hit-loading btn btn-to-link btn-secondary ms-3 btn-gradiant  d-flex align-items-center justify-content-around"
          type="button"
        >
          <span>Learn more</span>
          <span
            className="icon-btn_track d-flex align-items-center"
            style={{ height: "fit-content", width: "22px", paddingLeft: "5px" }}
          >
            <i className="bi bi-arrow-right-circle-fill"></i>
          </span>
        </button>
      </div>
    </div>
  );
};

export default StepCard;
