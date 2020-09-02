"use strict";
const mongoose = require("mongoose");

const schema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	startDate: {
		type: Date,
		required: true,
	},
	finishDate: {
		type: Date,
		required: true,
	},
	startHour: {
		type: Number,
		required: true,
	},
	finishHour: {
		type: Number,
		required: true,
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	active: {
		type: Boolean,
		default: true,
	},
});

module.exports = mongoose.model("Event", schema);
