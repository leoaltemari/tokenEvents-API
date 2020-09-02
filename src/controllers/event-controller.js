"use struct";

const repository = require("../repositories/event-repository");
const EventValidator = require("../validators/event-validator");

// Controllers
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

exports.getById = async (req, res, next) => {
	try {
		const data = await repository.getById(req.params.id);
		res.status(200).send(data);
	} catch (err) {
		res.status(500).send({
			message: "Falha ao processar requisição",
			err: err.message,
			code: err.code,
		});
	}
};

exports.getByUserId = async (req, res, next) => {
	try {
		const data = await repository.getByUserId(req.params.id);
		res.status(200).send(data);
	} catch (err) {
		res.status(500).send({
			message: "Falha ao processar requisição",
			err: err.message,
			code: err.code,
		});
	}
};

exports.getByDate = async (req, res, next) => {
	try {
		console.log(req.params.date);
		const data = await repository.getByDate(req.params.date);
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
			const result = await repository.create(req.body);
			if (result === null) {
				res.status(202).send({
					message:
						"Você já possui um evento neste horário, por favor selcione outro horário",
				});
			} else {
				res.status(201).send({ message: "Evento criado com sucesso!" });
			}
		} else {
			res.status(200).send(eventValidator.getErrors());
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
		if (eventValidator.putValidation(req.body)) {
			await repository.update(req.params.id, req.body);
			res.status(200).send({
				message: "Informações atualizadas com sucesso!",
			});
		} else {
			res.status(200).send(eventValidator.getErrors());
		}
	} catch (err) {
		res.status(500).send({
			message: "Falha ao processar requisição",
			err: err.message,
			code: err.code,
		});
	}
};

exports.delete = async (req, res, next) => {
	try {
		const cb = await repository.delete(req.params.id);
		if (cb === null) {
			res.status(200).send({
				message: "Evento não encontrado!",
			});
		} else {
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
