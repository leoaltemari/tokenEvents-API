"uses strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const config = require("./config");

// Config
const app = express();
const router = express.Router();

// Load Routes
const indexRoute = require("./routes/index-route");

// Load Models

// MiddleWares
app.use(express.json());
app.use(express.static("public"));

// Cors
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, x-access-token"
	);
	res.header(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS"
	);
	next();
});

// Body-Parser
app.use(
	bodyParser.json({
		limit: "1mb",
	})
);
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/", indexRoute);

// Connect to the DB
const uri = config.connectionString;
mongoose
	.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log("MongoDB Connected…");
	})
	.catch(err => console.log(err));

module.exports = app;
