import React from "react";

export default function BlogPost() {
	return <h1>Blog post page</h1>;
}

BlogPost.getInitialProps = function () {
	return {
		name: "foo",
	};
};
