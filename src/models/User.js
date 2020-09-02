"use strict";
const mongoose = require("mongoose");

const schema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "O nome de usuário é obrigatório"],
	},
	email: {
		type: String,
		pattern:
			"/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi",
		required: [true, "O email é obrigatório"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "A senha de usuário é obrigatória"],
	},
	invitations: [
		{
			whoInvited: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			event: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Event",
			},
			accepted: {
				type: Boolean,
				deafult: false,
			},
		},
	],
	roles: [
		{
			type: String,
			required: true,
			enum: ["user", "admin"],
			default: "user",
		},
	],
});

module.exports = mongoose.model("User", schema);
