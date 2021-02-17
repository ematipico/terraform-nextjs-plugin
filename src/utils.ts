/**
 * From an array of parts of an URL, it generates a string
 * with only dash.
 *
 * It can be used inside a terraform configuration
 *
 * @param {string[]} pathParts
 * @returns {string}
 */
export const generateUniqueName = (pathParts) => {
	return pathParts
		.filter(Boolean)
		.map((p) => p.replace(":", "").replace("?", ""))
		.join("-");
};
