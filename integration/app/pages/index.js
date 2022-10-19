import React from "react";

export default function Index() {
	return <h1>Index page</h1>;
}

Index.getInitialProps = function () {
	return {
		name: "foo",
	};
};
