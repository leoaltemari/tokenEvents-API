"use strict";

const Validator = require("./validator");

// Attributes
let validator;

// Constructor
function EventValidation() {
	validator = new Validator();
	validator.clear();
}

// Methods
EventValidation.prototype.postValidation = data => {
	validator.clear();

	// Required validation
	validator.isRequired(data.name, "O campo Nome é obrigatório.");
	validator.isRequired(data.description, "O campo Descrição é obrigatório.");
	validator.isRequired(
		data.startDate,
		"Selecione uma data para o evento começar."
	);
	validator.isRequired(
		data.finishDate,
		"Selecione uma data para o evento terminar."
	);

	// If one of the required fields is not completed
	if (!validator.isValid()) {
		return false;
	}

	// Name validator
	validator.hasMinLen(
		data.name,
		5,
		"O nome do evento deve possuir mínimo de 5 caracteres"
	);

	validator.validDate(
		data.startDate,
		data.startHour,
		"Entre com uma data válida para o evento começar!"
	);

	validator.validDate(
		data.finishDate,
		data.finishHour,
		"Entre com uma data válida para o evento terminar!"
	);

	validator.compareDates(
		data.startDate,
		data.finishDate,
		data.startHour,
		data.finishHour,
		"A data de inicio deve preceder a data de fim."
	);

	const startDate = new Date(data.startDate);
	const finishDate = new Date(data.finishDate);
	if (validator.isValid()) {
		return true;
	}

	return false;
};

EventValidation.prototype.putValidation = data => {
	validator.clear();

	// Name validator
	if (data.name) {
		validator.hasMinLen(
			data.name,
			5,
			"O nome do evento deve possuir mínimo de 5 caracteres"
		);
	}

	if (data.startDate) {
		validator.validDate(
			data.startDate,
			data.startHour,
			"Entre com uma data válida para o evento começar!"
		);
	}

	if (data.finishDate) {
		validator.validDate(
			data.finishDate,
			data.finishHour,
			"Entre com uma data válida para o evento terminar!"
		);
	}

	const ret = validator.isValid() ? true : false;
	return ret;
};

// GetErrors
EventValidation.prototype.getErrors = () => {
	return validator.errors();
};

module.exports = EventValidation;
