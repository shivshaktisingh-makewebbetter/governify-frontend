import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRole, getToken, isTokenValid } from "../../utils/helper";

const RoleWrapper = ({ children }) => {
  const navigate = useNavigate();
  const role = getRole();
  const token = getToken();

  useEffect(() => {
    if (role === undefined || role === null || role === "") {
      navigate("signin");
    }
    if (role === "superAdmin") {
      if (token !== null && token !== undefined && token !== "") {
        let status = isTokenValid(token);
        if (status.valid) {
          navigate("admin");
        }else{
          navigate("signin");
        }
      }else{
        navigate("signin");
      }
    }
  }, [role, navigate]);

  return <>{children}</>;
};

export default RoleWrapper;
