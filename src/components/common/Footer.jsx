import React from "react";

const Footer = () => {
	return (
		<footer className="mt-100 text-white-50 d-flex justify-content-center">
			<div className="mt-5 mb-5 align-center text-secondary fs-6">
				<small>Powered by TASC Outsourcing®</small>
			</div>
			<div id="full-loader" style={{ display: "none" }}>
				<div className="full-loader d-flex align-items-center justify-content-center">
					<img
						height="90"
						className="rotating-img"
						src=""
						alt=""
					/>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
