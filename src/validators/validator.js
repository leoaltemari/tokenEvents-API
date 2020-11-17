"use strict";

let errors = [];

function ValidationContract() {
	errors = [];
}

ValidationContract.prototype.isRequired = (value, message) => {
	if (!value || value.length <= 0) errors.push({ message: message });
};

ValidationContract.prototype.hasMinLen = (value, min, message) => {
	if (!value || value.length < min) errors.push({ message: message });
};

ValidationContract.prototype.hasMaxLen = (value, max, message) => {
	if (!value || value.length > max) errors.push({ message: message });
};

ValidationContract.prototype.isFixedLen = (value, len, message) => {
	if (value.length != len) errors.push({ message: message });
};

ValidationContract.prototype.isEmail = (value, message) => {
	return;
	let reg = new RegExp(
		/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi
	);
	if (!reg.test(value)) errors.push({ message: message });
};

ValidationContract.prototype.validPassword = (value, message) => {
	let reg = new RegExp(
		/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
	);
	if (!reg.test(value)) errors.push({ message: message });
};

ValidationContract.prototype.contains = (data, value, message) => {
	if (data.includes(value)) errors.push({ message: message });
};

ValidationContract.prototype.isLower = (data, value, message) => {
	if (data < value) errors.push({ message: message });
};

ValidationContract.prototype.isHigher = (data, value, message) => {
	if (data > value) errors.push({ message: message });
};

ValidationContract.prototype.validDate = (date, hour, message) => {
	const nowDate = new Date();
	const day = parseInt(date.slice(8, 10));
	const month = parseInt(date.slice(5, 7));
	const year = parseInt(date.slice(0, 4));

	if (
		hour >= 24 ||
		hour < 0 ||
		day < 0 ||
		day > 31 ||
		month > 12 ||
		month <= 0 ||
		year < nowDate.getFullYear()
	) {
		errors.push({ message: message });
	}
};

ValidationContract.prototype.compareDates = (
	startDate,
	finishDate,
	startHour,
	finishHour,
	message
) => {
	const start = new Date(startDate);
	const finish = new Date(finishDate);

	if (start == finish) {
		if (startHour >= finishHour) {
			errors.push(message);
			return;
		}
	}

	if (start > finish) {
		errors.push(message);
	}
	return;
};

ValidationContract.prototype.errors = () => {
	return errors;
};

ValidationContract.prototype.clear = () => {
	errors = [];
};

ValidationContract.prototype.isValid = () => {
	return errors.length === 0;
};

module.exports = ValidationContract;
