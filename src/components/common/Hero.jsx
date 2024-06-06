import React, { useState, useEffect } from "react";

const Hero = ({ heading, subheading, ...props }) => {
	const data = JSON.parse(sessionStorage.getItem('settings')) || {"image":"https://onboardify.tasc360.com/uploads/governify/1717570622_Products Logo (1).png","site_bg":"#ffffff","button_bg":"#5ac063","banner_bg":"#5ac063","banner_content":"Hire an attitude, not just experience and qualification. Greg Savage.","header_bg":"#f7f7f7","head_title_color":"#5ac063"};
	const [animation, setAnimation] = useState(true);
	useEffect(() => {
		setTimeout(() => {
			setAnimation(false);
		}, 300);
	}, []);
	return (
		<div
			className={`animation-container my-3 ${
				props?.forHome ? "mt-0" : "mt-5"
			} onboarding-margin-top-18 onboarding-min-height-120`}
			style={{ minHeight: subheading === "" ? "100px" : "160px" }}
		>
			<div
				className={animation ? "animation-content" : ""}
				style={{ transition: "transform 1s ease, opacity 2s ease" }}
			>
				<h1
					className={`header-heading1 ${
						props?.forHome ? "mt-0" : "mt-2"
					} fw-bold ff-ws onboarding-font-size-30`}
					style={{ color: data.head_title_color }}
				>
					{heading}
				</h1>
				<div className="d-flex flex-column justify-content-center align-items-center secondaryHeading">
					<p
						className="secondry-heading header-heading3 mb-0  fs-19"
					    style={{color:'#928f8f'}}
					>
						{subheading}
					</p>
					
					{props?.secondaryHeading && (
						<p
							className="header-heading3 mt-0 fs-6 text-secondary fs-19"
							style={{ width: "90vw"}}
						>
							{props.secondaryHeading}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Hero;
