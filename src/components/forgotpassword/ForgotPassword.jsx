import React, { useEffect, useState } from "react";
import { Loader } from "../common/Loader";
import { fetcher } from "../../utils/helper";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const ForgotPassword = () => {
  const [animation, setAnimation] = useState(true);
  const [email , setEmail] = useState('');
  const [loading , setLoading] = useState(false);

  const handleEmail = (e) =>{
   setEmail(e.target.value);
  }

  const handleSubmit = async ()=>{
    let url = 'onboardify/forgot';
    let method = 'POST';
    let payload = JSON.stringify({email:email})
    try{
        setLoading(true);
        const response = await fetcher(url , method , payload);
        if(response.status){
            toast.success('Mail Sent Successfully.')
        }else{
            toast.error(response.message);
        }

    }catch(err){
    console.log(err , 'error')

    }finally{
        setLoading(false);

    }
    

  }

  const buttonDisable = () =>{
    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/;
    if (email && emailRegex.test(email)) {
        return false;
    }
    return true;
  }
  useEffect(() => {
    setTimeout(() => {
      setAnimation(false);
    }, 300);
  }, []);
  return (
    <div className="container auth-container text-center">
        {loading && <Loader/>}
      <div className="cover-container w-100 h-100 p-3 pb-2 ">
        <div>
          <div className="animation-container" style={{ minHeight: "160px" }}>
            <div
              className={`header-heading1 ${
                animation ? "animation-content" : ""
              } ff-ws `}
              style={{
                transition: "transform 1s ease, opacity 2s ease",
              }}
            >
              Governify
            </div>
          </div>
          {/* <div class="d-flex justify-content-center">
        <div class="alert alert-{{ $status }}" style={{maxWidth:"400px"}}>
        </div>
      </div> */}
          <div className="form-container mx-auto">
            <div>
              <div>
                {/* <span className="inc-tasc-gradient-btn">TASC</span><span className="fs-48 ff-ws"> 360</span> */}
                <img
                  src="/tasc.svg"
                  alt="TASC logo"
                  style={{ maxWidth: "250px" }}
                />
              </div>
              <div className="fs-36 ff-ws mb-3 text-inc-tundora">
                Forgot Password
              </div>
            </div>
            <div class="form-auth">
              <input placeholder="Email" type="email" value={email} onChange={handleEmail}/>
              <button
                id="login-button"
                class="btn btn-to-link btn-secondary btn-gradiant mt-4 d-flex align-items-center bg-inc-orange"
                type="button"
                disabled={buttonDisable()}
                onClick={handleSubmit}
              >
                <span className="fw-bold">Email me a recovery link</span>
                <span class="icon-btn_track" style={{ marginLeft: "10px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-arrow-right-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                  </svg>
                </span>
              </button>
              <div class="d-flex justify-content-center w-100 mt-2">
                <a href="/signin">Back to login?</a>
              </div>
              <div
                className="mt-3 fs-18 ff-ws text-inc-tundora"
              >
                Powered by TASC Outsourcing®
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ForgotPassword;



