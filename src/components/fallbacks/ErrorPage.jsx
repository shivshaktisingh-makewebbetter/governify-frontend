import React from "react";

const ErrorPage = () => {
	return (
		<div
			className="d-flex flex-column align-items-center justify-content-center"
			style={{ width: "100vw", height: "100vh" }}
		>
			<h1 className="text-warning">Something Went Wrong</h1>
			<p className="">Fall back error page <code className="">Boilerplate Fallback <small>Designed by -j</small></code></p>
		</div>
	);
};

export default ErrorPage;
