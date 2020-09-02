"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/user-controller");
const authService = require("../services/auth-service");

// GET

router.get("/:id", controller.getById);

// POST
router.post("/", controller.post);
router.post("/login", controller.authenticate);
router.post(
	"/invitation/status",
	authService.authorize,
	controller.postInvitation
);

// PUT
router.put("/:id", authService.authorize, controller.put);
router.put(
	"/invitation/status",
	authService.authorize,
	controller.setInvitationStatus
);

// DELETE
router.delete("/:id", authService.isAdmin, controller.delete);

module.exports = router;
