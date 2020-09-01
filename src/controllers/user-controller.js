"use struct";

const repository = require("../repositories/user-repository");
const UserValidator = require("../validators/user-validator");
const md5 = require("md5");
const authService = require("../services/auth-service");

// Controllers
exports.authenticate = async (req, res, next) => {
	try {
		const customer = await repository.authenticate(req.params);
		if (!customer) {
			res.status(200).send({ message: "Email ou senha inválidos!" });
			return;
		}

		// Generates a token to the user
		const token = await authService.generateToken({
			id: customer._id,
			email: customer.email,
			name: customer.name,
			roles: customer.roles,
		});

		res.status(201).send({
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
			await repository.create({
				name: req.body.name,
				email: req.body.email,
				password: md5(req.body.password + global.SALT_KEY),
				roles: ["user"],
			});
			res.status(201).send({ message: "Cadastro efetuado com sucesso!" });
		} else {
			res.status(200).send(userValidator.getErrors());
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
				res.status(200).send([
					{
						message: "Este email já está em uso!",
					},
				]);
			} else {
				res.status(200).send({
					message: "Informações atualizadas com sucesso!",
				});
			}
		} else {
			res.status(200).send(userValidator.getErrors());
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
