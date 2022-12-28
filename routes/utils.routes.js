// Dependencies
const { Router } = require("express");
const express = require("express");
const path = require("path");

// controller
const utils = require("../controllers/utils.controller");

// Middlewares
const { multerUploads } = require("../middlewares/multer");

// Stuff
const router = express.Router();

// Routes
router.get("/", utils.getPingController);
router.get("/ping", utils.getPingController);
router.post(
    "/convert",
    multerUploads.single("file"),
    utils.postConvertFileController
);

module.exports = router;