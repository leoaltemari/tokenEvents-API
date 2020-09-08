"use struct";

const repository = require("../repositories/user-repository");
const UserValidator = require("../validators/user-validator");
const md5 = require("md5");
const authService = require("../services/auth-service");

// Controllers
exports.authenticate = async (req, res, next) => {
	try {
		const customer = await repository.authenticate(req.body);
		if (!customer) {
			res.status(202).send({ message: "Email ou senha inválidos!" });
			return;
		}

		// Generates a token to the user
		const token = await authService.generateToken({
			id: customer._id,
			email: customer.email,
			name: customer.name,
			roles: customer.roles,
		});

		res.status(200).send({
			token: token,
			data: customer,
		});
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

exports.post = async (req, res, next) => {
	try {
		const userValidator = new UserValidator();
		if (userValidator.postValidation(req.body)) {
			const data = await repository.create({
				name: req.body.name,
				email: req.body.email,
				password: md5(req.body.password + global.SALT_KEY),
				roles: ["user"],
			});
			if (data === null) {
				res.status(202).send({ message: "Este Email já está em uso!" });
			} else {
				res.status(201).send({
					message: "Cadastro efetuado com sucesso!",
				});
			}
		} else {
			res.status(202).send(userValidator.getErrors());
		}
	} catch (err) {
		console.log(err);
		res.status(500).send({
			message: "Falha ao processar requisição",
			err: err.message,
			code: err.code,
		});
	}
};

exports.postInvitation = async (req, res, next) => {
	try {
		const result = await repository.invite(req.body);
		if (!result) {
			res.status(202).send({
				message: "O email digitado não existe!",
			});
		} else {
			res.status(201).send({
				message: "Convite enviado com sucesso!",
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

exports.put = async (req, res, next) => {
	try {
		const userValidator = new UserValidator();
		if (userValidator.putValidation(req.body)) {
			const resUpdate = await repository.update(req.params.id, req.body);
			if (resUpdate === null) {
				res.status(202).send([
					{
						message: "Este email já está em uso!",
					},
				]);
			} else {
				res.status(201).send({
					message: "Informações atualizadas com sucesso!",
				});
			}
		} else {
			res.status(202).send(userValidator.getErrors());
		}
	} catch (err) {
		res.status(500).send({
			message: "Falha ao processar requisição",
			err: err.message,
			code: err.code,
		});
	}
};

exports.setInvitationStatus = async (req, res, next) => {
	try {
		const result = await repository.setInvitationStatus(req.body);
		if (result) {
			res.status(202).send({
				message: "Status alterado com sucesso!",
				user: result,
			});
		} else {
			res.status(201).send({
				message: "Informações comprometidas",
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

exports.delete = async (req, res, next) => {
	try {
		const cb = await repository.delete(req.params.id);
		if (cb === null) {
			res.status(202).send({
				message: "Usuário não encontrado!",
			});
		} else {
			res.status(200).send({
				message: "Usuário removido com sucesso!",
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
