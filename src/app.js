"uses strict";

const express = require("express");
const bodyParser = require("body-parser");

// Config
const app = express();
const router = express.Router();

// MiddleWares
app.use(express.json());
app.use(express.static("public"));

// Body-Parser
app.use(
	bodyParser.json({
		limit: "1mb",
	})
);
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = app;
