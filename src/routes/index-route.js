"use strict";

const express = require("express");
const router = express.Router();

// Main route from the API
router.get("/", (req, res, next) => {
	res.status(200).send({
		title: "TokenEvents API - Administrator",
		version: "0.0.1",
	});
});

module.exports = router;
