import { useNavigate } from "react-router-dom";
import { Optionslist } from "./Optionslist";
import { useEffect } from "react";
import { getRole, getToken, isTokenValid } from "../../utils/helper";
import { userSettingData } from "../../utils/tools";

export const Adminhome = () => {
  const navigate = useNavigate();
  const role = getRole();
  const token = getToken();

  useEffect(() => {
    if (role === undefined || role === null || role === "") {
      navigate("/signin");
    }
    if (role === "customer") {
      if (token !== null && token !== undefined && token !== "") {
        let status = isTokenValid(token);
        if (status.valid) {
          navigate("/");
        } else {
          navigate("/signin");
        }
      } else {
        navigate("/signin");
      }
    }
  }, [role, navigate]);

  useEffect(() => {
    userSettingData();
    return () => {};
  }, []);

  return (
    <>
      <Optionslist />
    </>
  );
};
