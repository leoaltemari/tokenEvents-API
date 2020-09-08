"use strict";

const repository = require("../repositories/event-repository");
const EventValidator = require("../validators/event-validator");


/* 	OBS: If there is any problem in the route or in the request all the controllers will
	return an object with the error that ocours, containing a message, the error and the
	error code :
		res.status(500).send({
			message: "Falha ao processar requisição",
			err: err.message,
			code: err.code,
		});
*/

// Controllers

// Return All the events in the Collection
exports.get = async (req, res, next) => {
	try {
		const data = await repository.get();
		res.status(200).send(data);
	} catch (err) {
		res.status(500).send({
			message: "Falha ao processar requisição",
			err: err.message,
			code: err.code,
		});
	}
};

// Return ONE events in the Collection selectec by id
exports.getById = async (req, res, next) => {
	try {
		const data = await repository.getById(req.params.id);

		// If there arent no event with this id it reuturns an enpty object {}
		res.status(200).send(data);
	} catch (err) {
		res.status(500).send({
			message: "Falha ao processar requisição",
			err: err.message,
			code: err.code,
		});
	}
};

// Return ONE events in the Collection selectec by the USER id
exports.getByUserId = async (req, res, next) => {
	try {
		const data = await repository.getByUserId(req.params.id);

		// If there arent no event with this user id it reuturns an enpty object {}
		res.status(200).send(data);
	} catch (err) {
		res.status(500).send({
			message: "Falha ao processar requisição",
			err: err.message,
			code: err.code,
		});
	}
};

// Return All events in the Collection with that date
exports.getByDate = async (req, res, next) => {
	try {
		const data = await repository.getByDate(req.params.date);

		// If there arent no event with this date it reuturns an enpty array []
		res.status(200).send(data);
	} catch (err) {
		res.status(500).send({
			message: "Falha ao processar requisição",
			err: err.message,
			code: err.code,
		});
	}
};

exports.post = async (req, res, next) => {
	try {
		const eventValidator = new EventValidator();

		if (eventValidator.postValidation(req.body)) {
			// Input Validation
			const result = await repository.create(req.body);

			// Date conflict
			if (result === null) {
				res.status(202).send({
					message:
						"Você já possui um evento neste horário, por favor selcione outro horário",
				});
			} else {
				// Success
				res.status(201).send({ message: "Evento criado com sucesso!" });
			}
		} else {
			res.status(202).send(eventValidator.getErrors());
		}
	} catch (err) {
		res.status(500).send({
			message: "Falha ao processar requisição",
			err: err.message,
			code: err.code,
		});
	}
};

exports.put = async (req, res, next) => {
	try {
		const eventValidator = new EventValidator();

		// Input Validation
		if (eventValidator.putValidation(req.body)) {
			await repository.update(req.params.id, req.body);

			// Success
			res.status(201).send({
				message: "Informações atualizadas com sucesso!",
			});
		} else {
			// Errors at the input validadtion
			res.status(202).send(eventValidator.getErrors());
		}
	} catch (err) {
		res.status(500).send({
			message: "Falha ao processar requisição",
			err: err.message,
			code: err.code,
		});
	}
};

// Removes an event from the collection by its ID
exports.delete = async (req, res, next) => {
	try {
		const cb = await repository.delete(req.params.id);

		// Not found
		if (cb === null) {
			res.status(202).send({
				message: "Evento não encontrado!",
			});
		} else {
			// Success
			res.status(200).send({
				message: "Evento removido com sucesso!",
			});
		}
	} catch (err) {
		res.status(500).send({
			message: "Falha ao processar requisição",
			err: err.message,
			code: err.code,
		});
	}
};
