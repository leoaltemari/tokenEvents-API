"use strict";
const mongoose = require("mongoose");
const User = require("../models/User");
const md5 = require("md5");

exports.create = async data => {
	var user = new User(data);
	await user.save();
};

exports.authenticate = async data => {
	const query = {
		email: data.email,
		password: md5(data.password + global.SALT_KEY),
	};
	const res = await User.findOne(query);
	return res;
};

exports.get = async () => {
	const res = await User.find();
	return res;
};

exports.getById = async id => {
	const res = await User.findById(id);
	return res;
};

exports.update = async (id, body, file) => {
	const query = {};

	if (body.name) {
		query.name = body.name;
	}

	if (body.email) {
		query.email = body.email;
		const findEmail = await User.findOne({ email: body.email });
		if (findEmail != null) {
			return null;
		}
	}

	if (body.password) {
		query.password = md5(body.password + global.SALT_KEY);
	}

	const res = await User.findByIdAndUpdate(id, query);
	return res;
};

exports.delete = async id => {
	const res = await User.findOneAndRemove(id);
	return res;
};
