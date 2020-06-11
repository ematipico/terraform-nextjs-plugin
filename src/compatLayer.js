// @ts-nocheck
/**
 * Credits to https://github.com/danielcondemarin
 * https://github.com/danielcondemarin/serverless-nextjs-plugin/blob/master/packages/next-aws-lambda/lib/compatLayer.js
 */
const Stream = require("stream");
const queryString = require("querystring");

const requestResponseMapper = (event, callback) => {
	const base64Support = process.env.BINARY_SUPPORT === "yes";
	const response = {
		body: Buffer.from(""),
		isBase64Encoded: base64Support,
		statusCode: 200,
		multiValueHeaders: {},
	};

	const request = new Stream.Readable();
	request.url = (event.requestContext.path || event.path || "").replace(new RegExp("^/" + event.requestContext.stage), "");

	let qs = "";

	if (event.multiValueQueryStringParameters) {
		qs += queryString.stringify(event.multiValueQueryStringParameters);
	}

	if (event.pathParameters) {
		const pathParametersQs = queryString.stringify(event.pathParameters);

		if (qs.length > 0) {
			qs += `&${pathParametersQs}`;
		} else {
			qs += pathParametersQs;
		}
	}

	const hasQueryString = qs.length > 0;

	if (hasQueryString) {
		request.url += `?${qs}`;
	}

	request.method = event.httpMethod;
	request.rawHeaders = [];
	request.headers = {};

	const headers = event.multiValueHeaders || {};

	for (const key of Object.keys(headers)) {
		for (const value of headers[key]) {
			request.rawHeaders.push(key);
			request.rawHeaders.push(value);
		}
		request.headers[key.toLowerCase()] = headers[key].toString();
	}

	request.getHeader = (name) => {
		return request.headers[name.toLowerCase()];
	};
	request.getHeaders = () => {
		return request.headers;
	};

	request.connection = {};

	// eslint-disable-next-line unicorn/prevent-abbreviations
	const res = new Stream();
	Object.defineProperty(res, "statusCode", {
		get() {
			return response.statusCode;
		},
		set(statusCode) {
			response.statusCode = statusCode;
		},
	});
	res.headers = {};
	res.writeHead = (status, headers) => {
		response.statusCode = status;
		if (headers) res.headers = Object.assign(res.headers, headers);
	};
	res.write = (chunk) => {
		response.body = Buffer.concat([response.body, Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)]);
	};
	res.setHeader = (name, value) => {
		res.headers[name] = value;
	};
	res.removeHeader = (name) => {
		delete res.headers[name];
	};
	res.getHeader = (name) => {
		return res.headers[name.toLowerCase()];
	};
	res.getHeaders = () => {
		return res.headers;
	};
	res.end = (text) => {
		if (text) res.write(text);
		response.body = Buffer.from(response.body).toString(base64Support ? "base64" : undefined);
		response.multiValueHeaders = res.headers;
		res.writeHead(response.statusCode);
		fixApiGatewayMultipleHeaders();
		callback(null, response);
	};
	if (event.body) {
		request.push(event.body, event.isBase64Encoded ? "base64" : undefined);
		request.push(null);
	}

	// eslint-disable-next-line unicorn/consistent-function-scoping
	function fixApiGatewayMultipleHeaders() {
		for (const key of Object.keys(response.multiValueHeaders)) {
			if (!Array.isArray(response.multiValueHeaders[key])) {
				response.multiValueHeaders[key] = [response.multiValueHeaders[key]];
			}
		}
	}

	// eslint-disable-next-line unicorn/prevent-abbreviations
	return { req: request, res };
};

module.exports = requestResponseMapper;
