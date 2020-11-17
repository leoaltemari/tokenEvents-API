"use strict";
const mongoose = require("mongoose");
const User = require("../models/User");
const md5 = require("md5");

// Create a new User in the collection
exports.create = async data => {
	// Checks if there are any user with the same email
	const alreadyExist = await User.findOne({ email: data.email });

	// Returns null if there are another user with this email
	if (alreadyExist) {
		return null;
	}

	// Creates a new user if the data is valid
	var user = new User(data);
	await user.save();
};

// Makes the Login of the user in the application
exports.authenticate = async data => {
	// Qury to check the user data(email and password)
	const query = {
		email: data.email,
		password: md5(data.password + global.SALT_KEY),
	};

	// Returns ALL the user data(but the password)
	const res = await User.findOne(query, "-password")
		.populate("invitations", "event, whoInvited, accepted")
		.populate("invitations.whoInvited", "name")
		.populate(
			"invitations.event",
			"name description startDate startHour finishDate finishHour"
		);

	return res;
};

// Invites a friend to an event
exports.invite = async data => {
	if (!data.email || !data.whoInvited || !data.event) {
		return null;
	}

	// Invitation data
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

// Returns ALL the users saved at the Collection
exports.get = async () => {
	const res = await User.find();
	return res;
};

// Returns ONE user by its ID
exports.getById = async id => {
	const res = await User.findById(id);
	return res;
};

// Updates user data passed in the body of the request
exports.update = async (id, body, file) => {
	const query = {};

	// Checks the data
	if (body.name) {
		query.name = body.name;
	}

	if (body.email) {
		query.email = body.email;
		const findUser = await User.findOne({ email: body.email });

		if (findUser && findUser.email === body.email && findUser._id != id) {
			return null;
		}
	}

	if (body.password) {
		query.password = md5(body.password + global.SALT_KEY);
	}

	// Update and returns the user data before updates
	const res = await User.findByIdAndUpdate(id, query);

	return res;
};

// Accept or Refure an invite(it depends on the "status" passed in the body)
exports.setInvitationStatus = async data => {
	if (!data.status || !data.event) {
		return null;
	}

	const status = data.status;
	const eventId = data.event;
	const userId = data.user;

	// Get the current user invitations
	const user = await User.findById(userId);
	let _invitations = user.invitations;
	_invitations.forEach(item => {
		// Set the status in the new invitations
		if (item.event.toString() == eventId) {
			item.accepted = status;
		}
	});

	// Updates the suer invitations
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

// Removes an user by its ID
exports.delete = async id => {
	const res = await User.findOneAndRemove(id);
	return res;
};
