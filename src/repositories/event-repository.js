"use strict";
const mongoose = require("mongoose");
const Event = require("../models/Event");

// Creates a new Event
exports.create = async data => {
	// Access the current user events
	const userId = data.creator;
	const eventsById = await Event.find({ creator: userId });

	// Updates the Date and hours to the BRT time pattern
	// Start Date
	const startDate = new Date(data.startDate);
	startDate.setHours(data.startHour - 3);
	data.startDate = startDate;

	// Finish Date
	const finishDate = new Date(data.finishDate);
	finishDate.setHours(data.finishHour - 3);
	data.finishDate = finishDate;

	// Filter the events with this query, to check if the user that is
	// creating a new event already has an event that conflicts the date
	// with the new event that is been created
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

	// If there is an event that conflict date with the event that is beeing created
	if (eventsTime1.length !== 0) {
		return null;
	}

	// If there is not event conflict the new event is created
	var event = new Event(data);
	await event.save();
	return event;
};

// Return all events in the collection
exports.get = async () => {
	const res = await Event.find({ active: true }).populate(
		"creator",
		"name email"
	);
	return res;
};

// Return ONE events by its ID
exports.getById = async id => {
	const res = await Event.findById(id);
	return res;
};

// Return ONE events by the USER ID
exports.getByUserId = async userId => {
	const query = {
		creator: userId,
	};
	const res = await Event.find(query)
		.populate("creator", "name email")
		.sort({ startDate: 1 });
	return res;
};

// Return ALL the events that contains the date passed in the body of the request
exports.getByDate = async date => {
	// Updates the date comming by the request to the BRT time pattern
	const startDateArgument = new Date(date);
	startDateArgument.setHours(startDateArgument.getHours() - 3);
	startDateArgument.setMonth(startDateArgument.getMonth() + 1);

	const finishDateArgument = new Date(date);
	finishDateArgument.setHours(finishDateArgument.getHours() - 3);
	finishDateArgument.setUTCDate(finishDateArgument.getUTCDate() + 1);
	finishDateArgument.setMonth(finishDateArgument.getMonth() + 1);

	// Query to select that events that starts in the date passed, finish in this date,
	// or, if there are events that has more than one day of duration, it query checks
	// if there are any events that pass into the day selected.
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

	// Returns the events fouded and sort it by the start date.
	const res = await Event.find(query).sort({ startDate: 1 });
	return res;
};

// Update an event data
exports.update = async (eventId, data) => {
	const query = {};

	// Check data information
	if (data.name) {
		query.name = data.name;
	}

	if (data.description) {
		query.description = data.description;
	}

	// If there is any date to change it turns it to the BRT time pattern
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


	// Returns the updated event
	const res = await Event.findByIdAndUpdate(eventId, query);
	return res;
};

// Removes an event by its ID
exports.delete = async id => {
	const res = await Event.findByIdAndRemove(id);
	return res;
};
