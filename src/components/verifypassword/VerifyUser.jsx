import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetcher } from "../../utils/helper";
import { Loader } from "../common/Loader";

const VerifyUser = () => {
  const location = useLocation();
  const queryParameters = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const VerifingUser = async () => {
    let payload = JSON.stringify({
      token: queryParameters.get("token"),
      email: queryParameters.get("email"),
    });
    try {
      let res = await fetcher("common/verifyUser", "POST", payload);
      if(res.status) {
        setTimeout(() => {
            navigate('signin');
        }, 2000)
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    VerifingUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="inc-verify-user">
        <div>User Verified Successfully, Redirecting to the login Page.</div>
      </div>
    </>
  );
};

export default VerifyUser;