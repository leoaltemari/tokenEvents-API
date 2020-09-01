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

ValidationContract.prototype.errors = () => {
	return errors;
};

ValidationContract.prototype.clear = () => {
	errors = [];
};

ValidationContract.prototype.isValid = () => {
	return errors.length == 0;
};

module.exports = ValidationContract;
