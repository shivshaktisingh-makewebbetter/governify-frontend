import React, { useState, useEffect } from "react";
import { settings } from "../../utils/tools";

const Hero = ({ heading, subheading, ...props }) => {
	const { link_btn_color, link_btn_bg , link_headtitle } = settings;
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
					style={{ color: link_headtitle }}
				>
					{heading}
				</h1>
				<div className="d-flex flex-column justify-content-center align-items-center secondaryHeading">
					{/* @if ($subheading ?? false) */}
					<p
						className="secondry-heading header-heading3 mb-0  fs-19"
					    style={{color:'#928f8f'}}
					>
						{subheading}
					</p>
					{/* @endif
            @if ($secondaryHeading ?? false) */}
					{props?.secondaryHeading && (
						<p
							className="header-heading3 mt-0 fs-6 text-secondary fs-19"
							style={{ width: "90vw"}}
						>
							{props.secondaryHeading}
						</p>
					)}
					{/* @endif */}
				</div>
			</div>
		</div>
	);
};

export default Hero;
