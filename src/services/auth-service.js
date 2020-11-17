"use strict";
const jwt = require("jsonwebtoken");

// Generates a new user token
exports.generateToken = async data => {
	return jwt.sign(data, global.SALT_KEY, { expiresIn: "24h" });
};

// Checks the token information passed
exports.decodeToken = async token => {
	const data = await jwt.verify(token, global.SALT_KEY);
	return data;
};

// Middleware to check if the user that makes a request has
// authorization to access that route
exports.authorize = function (req, res, next) {
	let token =
		req.body.token ||
		req.query.token ||
		req.headers["x-access-token"] ||
		req.params.token;

	if (!token) {
		res.status(401).json({
			message: "Acesso Restrito",
		});
	} else {
		jwt.verify(token, global.SALT_KEY, function (error, decoded) {
			if (error) {
				res.status(401).json({
					message: "Token Inválido",
				});
			} else {
				next();
			}
		});
	}
};

// Middleware to check if the user that makes a request has
// admin authorization to access that route
exports.isAdmin = function (req, res, next) {
	let token =
		req.body.token ||
		req.query.token ||
		req.headers["x-access-token"] ||
		req.params.token;

	if (!token) {
		res.status(401).json({
			message: "Token Inválido",
		});
	} else {
		jwt.verify(token, global.SALT_KEY, function (error, decoded) {
			if (error) {
				res.status(401).json({
					message: "Token Inválido",
				});
			} else {
				if (decoded.roles.includes("admin")) {
					next();
				} else {
					res.status(403).json({
						message:
							"Somente administradores podem utilizar essa funcionalidade!",
					});
				}
			}
		});
	}
};
