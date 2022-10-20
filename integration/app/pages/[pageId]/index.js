import React from "react";

export default function BlogPage() {
	return <h1>Blog post page</h1>;
}

BlogPage.getInitialProps = function () {
	return {
		name: "foo",
	};
};
