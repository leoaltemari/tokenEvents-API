"use strict";
const mongoose = require("mongoose");
const Event = require("../models/Event");
const md5 = require("md5");

exports.create = async data => {
	const userId = data.creator;
	const eventsById = await Event.find({ creator: userId });

	const startDate = new Date(data.startDate);
	startDate.setHours(data.startHour - 3);
	data.startDate = startDate;

	const finishDate = new Date(data.finishDate);
	finishDate.setHours(data.finishHour - 3);
	data.finishDate = finishDate;

	const eventsTime1 = eventsById.filter(events => {
		return (
			(events.startDate.getTime() > startDate.getTime() &&
				events.startDate.getTime() < finishDate.getTime()) ||
			(events.finishDate.getTime() > startDate.getTime() &&
				events.finishDate.getTime() < finishDate.getTime()) ||
			(events.startDate.getTime() <= startDate.getTime() &&
				events.finishDate.getTime() >= finishDate.getTime())
		);
	});

	if (eventsTime1.length !== 0) {
		return null;
	}

	var event = new Event(data);
	await event.save();
	return event;
};

exports.get = async () => {
	const res = await Event.find({ active: true }).populate(
		"creator",
		"name email"
	);
	return res;
};

exports.getById = async id => {
	const res = await Event.findById(id);
	return res;
};

exports.getByUserId = async userId => {
	const query = {
		creator: userId,
	};
	const res = await Event.find(query)
		.populate("creator", "name email")
		.sort({ startDate: 1 });
	return res;
};

exports.getByDate = async date => {
	const startDateArgument = new Date(date);
	startDateArgument.setHours(startDateArgument.getHours() - 3);
	startDateArgument.setMonth(startDateArgument.getMonth() + 1);

	const finishDateArgument = new Date(date);
	finishDateArgument.setHours(finishDateArgument.getHours() - 3);
	finishDateArgument.setUTCDate(finishDateArgument.getUTCDate() + 1);
	finishDateArgument.setMonth(finishDateArgument.getMonth() + 1);

	const query = {
		$or: [
			{
				$and: [
					{ startDate: { $gt: startDateArgument } },
					{ startDate: { $lt: finishDateArgument } },
				],
			},
			{
				$and: [
					{ finishDate: { $gt: startDateArgument } },
					{ finishDate: { $lt: finishDateArgument } },
				],
			},
			{
				$and: [
					{ startDate: { $lte: startDateArgument } },
					{ finishDate: { $gte: finishDateArgument } },
				],
			},
		],
	};

	const res = await Event.find(query).sort({ startDate: 1 });
	return res;
};

exports.update = async (eventId, data) => {
	const query = {};

	if (data.name) {
		query.name = data.name;
	}

	if (data.description) {
		query.description = data.description;
	}

	if (data.startDate) {
		const startDateArgument = new Date(data.startDate);

		if (data.startHour >= 3) startDateArgument.setHours(data.startHour - 3);

		query.startDate = startDateArgument;
		query.startHour = data.startHour > 0 ? data.startHour : 0;
	}

	if (data.finishDate) {
		const finishDateArgument = new Date(data.finishDate);

		if (data.finishHour >= 3)
			finishDateArgument.setHours(data.finishHour - 3);

		query.finishDate = finishDateArgument;
		query.finishHour = data.finishHour > 0 ? data.finishHour : 0;
	}

	const res = await Event.findByIdAndUpdate(eventId, query);
	return res;
};

exports.delete = async id => {
	const res = await Event.findByIdAndRemove(id);
	return res;
};
