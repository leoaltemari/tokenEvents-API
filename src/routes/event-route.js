"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/event-controller");
const authService = require("../services/auth-service");

// GET
router.get("/", controller.get);
// router.get("/:id", controller.getById);
router.get("/:date", controller.getByDate);
router.get("/user/:id", authService.authorize, controller.getByUserId);

// POST
router.post("/", authService.authorize, controller.post);

// PUT
router.put("/:id", authService.authorize, controller.put);

// DELETE
router.delete("/:id", controller.delete);

module.exports = router;
