import React from "react";

import { Govern, GovernifyTeam } from "../../assets/image";
import { extractUsernameFromMessage, getFirstLettersOfName, showUserName } from "../../utils/helper";

const Replies = ({ item }) => {
  let userName = showUserName(item.body);
  return (
    <div className="d-flex align-items-center" style={{ gap: "5px" }}>
      <div>
        <span
          className="rounded-circle fw-bold text-white d-flex align-items-center justify-content-center"
          style={{width: "40px", height: "40px" , background:"#5AC063" }}
        >
          {userName === "Incorpify Team" ? <GovernifyTeam /> : getFirstLettersOfName(userName)}
        </span>
      </div>
      <div className="rounded-2 px-3 py-2" style={{ background: "#6f74900f" }}>
        <div className="text-primary">{showUserName(item.body)}</div>
        <div
          className="inc-reply-container"
          style={{ color: "#6F7490" }}
          dangerouslySetInnerHTML={{
            __html: extractUsernameFromMessage(item.body),
          }}
        />
      </div>
    </div>
  );
};

export default Replies;