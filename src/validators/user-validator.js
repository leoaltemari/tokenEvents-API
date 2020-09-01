"use strict";

const Validator = require("./validator");

// Attributes
let validator;

// Constructor
function UserValidation() {
	validator = new Validator();
	validator.clear();
}

// Methods
UserValidation.prototype.postValidation = data => {
	validator.clear();

	// Required validation
	validator.isRequired(data.name, "O campo Nome é obrigatório");
	validator.isRequired(data.email, "O campo Email é obrigatório");
	validator.isRequired(data.password, "O campo Senha é obrigatório");

	// If one of the required fields is not completed
	if (!validator.isValid()) {
		return false;
	}

	// Name validator
	validator.hasMinLen(
		data.name,
		5,
		"O nome deve possuir mínimo de 5 caracteres"
	);

	// Email validator
	validator.isEmail(data.email, "Email possui formato inválido");

	// Password validator
	validator.validPassword(
		data.password,
		"Senha deve possuir de 8 a 32 caracteres, um número e uma letra e um caracter especiaal(!,@,#,etc.)"
	);

	if (validator.isValid()) {
		return true;
	}

	return false;
};

UserValidation.prototype.putValidation = data => {
	validator.clear();

	// Name validator
	if (data.name) {
		validator.hasMinLen(
			data.name,
			5,
			"O nome deve possuir mínimo de 5 caracteres"
		);
		validator.hasMaxLen(
			data.name,
			50,
			"O nome deve possuir máximo de 50 caracteres"
		);
	}

	// Email validator
	if (data.email) {
		validator.isEmail(data.email, "Email possui formato inválido");
	}

	// Password validator
	if (data.password) {
		validator.validPassword(
			data.password,
			"Senha deve possuir de 8 a 32 caracteres, um número e uma letra e um caracter especiaal(!,@,#,etc.)"
		);
	}

	if (validator.isValid()) {
		return true;
	}

	return false;
};

// GetErrors
UserValidation.prototype.getErrors = () => {
	return validator.errors();
};

module.exports = UserValidation;
