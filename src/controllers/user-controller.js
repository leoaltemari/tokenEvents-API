"use strict";

const repository = require("../repositories/user-repository");
const UserValidator = require("../validators/user-validator");
const md5 = require("md5");
const authService = require("../services/auth-service");

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

// Check the user input(email and password) and returna token and the user data if
// is a valid input
exports.authenticate = async (req, res, next) => {
	try {
		// Check input validation
		const customer = await repository.authenticate(req.body);

		// User not found
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

		// Returns the token and user data
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

// Get an user data by its ID
exports.getById = async (req, res, next) => {
	try {
		const data = await repository.getById(req.params.id);

		// If no user was found it returns an empty object []
		res.status(200).send(data);
	} catch (err) {
		res.status(500).send({
			message: "Falha ao processar requisição",
			err: err.message,
			code: err.code,
		});
	}
};

// Creates a new user in the user Collection
exports.post = async (req, res, next) => {
	try {
		const userValidator = new UserValidator();

		// Input Validation
		if (userValidator.postValidation(req.body)) {
			const data = await repository.create({
				name: req.body.name,
				email: req.body.email,
				password: md5(req.body.password + global.SALT_KEY),
				roles: ["user"],
			});

			// Error
			if (data === null) {
				res.status(202).send({ message: "Este Email já está em uso!" });
			} else {
				res.status(201).send({
					// Success
					message: "Cadastro efetuado com sucesso!",
				});
			}
		} else {
			// Error in the input data
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

// Send an Invitation to another user
exports.postInvitation = async (req, res, next) => {
	try {
		const result = await repository.invite(req.body);

		// Email not found
		if (!result) {
			res.status(202).send({
				message: "O email digitado não existe!",
			});
		} else {
			// Success
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

// Updates user data
exports.put = async (req, res, next) => {
	try {
		const userValidator = new UserValidator();

		// Input Validation
		if (userValidator.putValidation(req.body)) {
			const resUpdate = await repository.update(req.params.id, req.body);

			// Email already exists
			if (resUpdate === null) {
				res.status(202).send([
					{
						message: "Este email já está em uso!",
					},
				]);
			} else {
				res.status(201).send({
					// Success
					message: "Informações atualizadas com sucesso!",
				});
			}
		} else {
			// Error in the input data
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

// Acpt an invitation or refuse it
exports.setInvitationStatus = async (req, res, next) => {
	try {
		// Set the invitaion accordin to the status passed in the body(true or false)
		const result = await repository.setInvitationStatus(req.body);

		// Success
		if (result) {
			res.status(202).send({
				message: "Status alterado com sucesso!",
				user: result,
			});
		} else {
			// Request error(not made by the frontend)
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

// Removes and user from the Collection
exports.delete = async (req, res, next) => {
	try {
		const cb = await repository.delete(req.params.id);

		// Checks if the user exists
		if (cb === null) {
			res.status(202).send({
				message: "Usuário não encontrado!",
			});
		} else {
			// Success = user removed
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
