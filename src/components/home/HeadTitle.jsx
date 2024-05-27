import React from "react";
import Hero from "../common/Hero";

const HeadTitle = () => {

	return (
		<div className='pt-84'>
			<p className="lead mb-0">
				<span
					className="btn-lg btn-light fw-bold border-white bg-white text-color-434343"
					style={{ fontSize: "26px", fontWeight: "700" }}
				>
					Welcome to
				</span>
			</p>
			<Hero
				heading={"Governify"}
				subheading="Experience hassle-free management of all legal and bureaucratic processes with Governify. Our platform ensures smooth and effective liaison with key government authorities in KSA."
				forHome={true}
			/>
		</div>
	);
};

export default HeadTitle;
