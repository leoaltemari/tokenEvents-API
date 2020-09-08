"use strict";
const mongoose = require("mongoose");
const User = require("../models/User");
const md5 = require("md5");

exports.create = async data => {
	const alreadyExist = await User.findOne({ email: data.email });
	if (alreadyExist) {
		return null;
	}
	var user = new User(data);
	await user.save();
};

exports.authenticate = async data => {
	const query = {
		email: data.email,
		password: md5(data.password + global.SALT_KEY),
	};
	const res = await User.findOne(query)
		.populate("invitations", "event, whoInvited, accepted")
		.populate("invitations.whoInvited", "name")
		.populate(
			"invitations.event",
			"name description startDate startHour finishDate finishHour"
		);

	return res;
};

exports.invite = async data => {
	if (!data.email || !data.whoInvited || !data.event) {
		return null;
	}

	const userInvitedEmail = data.email;
	const newInvitation = {
		whoInvited: data.whoInvited,
		event: data.event,
		accepted: "unset",
	};

	let userInvitation = await User.findOne(
		{ email: userInvitedEmail },
		"invitations"
	);

	if (userInvitation === null) {
		return null;
	}

	userInvitation.invitations.push(newInvitation);
	const res = await User.findOneAndUpdate(
		{ email: userInvitedEmail },
		{ invitations: userInvitation.invitations }
	);
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

exports.setInvitationStatus = async data => {
	if (!data.status || !data.event) {
		return null;
	}

	const status = data.status;
	const eventId = data.event;
	const userId = data.user;

	const user = await User.findById(userId);
	let _invitations = user.invitations;
	_invitations.forEach(item => {
		if (item.event.toString() == eventId) {
			item.accepted = status;
		}
	});

	const res = await User.findByIdAndUpdate(userId, {
		invitations: _invitations,
	})
		.populate("invitations", "event, whoInvited, accepted")
		.populate("invitations.whoInvited", "name")
		.populate(
			"invitations.event",
			"name description startDate startHour finishDate finishHour"
		);
	res.invitations.forEach(item => {
		if (item.event._id == data.event) {
			item.accepted = status;
		}
	});

	return res;
};

exports.delete = async id => {
	const res = await User.findOneAndRemove(id);
	return res;
};
