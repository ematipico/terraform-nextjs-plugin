import React from "react";

export default function Contacts() {
	return <h1>Contacts page</h1>;
}

Contacts.getInitialProps = function() {
	return {
		name: "foo"
	};
};
