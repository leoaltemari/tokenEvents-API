"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/user-controller");
const authService = require("../services/auth-service");

// GET
router.get("/authenticate/:email/:password", controller.authenticate);
router.get("/:id", controller.getById);

// POST
router.post("/", controller.post);

// PUT
router.put("/:id", authService.authorize, controller.put);

// DELETE
router.delete("/:id", authService.isAdmin, controller.delete);

module.exports = router;
