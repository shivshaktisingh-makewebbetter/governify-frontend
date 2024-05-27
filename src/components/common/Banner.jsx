import React from "react";

const Banner = () => {
	return (
		<div
			id="notification-banner"
			style={{ display:"none" }}
			className=" position-relative custom-banner banner w-100 bg-success  text-center p-2"
		
		>
			<div
				className="fs-7 banner-content text-light"
				style={{ paddingRight:'50px',paddingLeft:'50px' }}
			>
				Seeting_content{" "}
			</div>
			<button
				id="remove-n-btn"
				style={{ position:"absolute",right:0,margin:"8px",height: "calc(100% - 16px)" }}
				className="remove-notification text-light p-0 top-0 mx-2 fs-6 px-2 outline-0 bg-transparent border-0"
			>
				<i className="bi bi-x-circle"></i>
			</button>
		</div>
	);
};

export default Banner;
