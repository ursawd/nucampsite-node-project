const express = require("express");
const cors = require("./cors");
const authenticate = require("../authenticate");
const Favorite = require("../models/favorite");

const favoriteRouter = express.Router();
//-----------------------------------
favoriteRouter
	.route("/")
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
		Favorite.find({ user: req.user._id })
			.populate("user")
			.populate("campsites")
			.then(favorite => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(favorite);
			})
			.catch(err => next(err));
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		console.log(req.body);
		Favorite.findOne({ user: req.user._id }).then(response => {
			if (response) {
				// favorite document found
				console.log("response", response);
				// check each id in req.body to see if in
				// response.campsites.
				req.body.forEach(item => {
					console.log("foreach id", item._id);
					console.log(response.campsites);
					if (!response.campsites.includes(item._id)) {
						console.log("Match found");
					}
				});
			} else {
				//create new favorite document
				const newFavorite = {
					campsites: req.body,
					user: req.user._id,
				};
				Favorite.create(newFavorite)
					.then(favorite => {
						res.statusCode = 200;
						res.setHeader("Content-Type", "application/json");
						res.json(favorite);
					})
					.catch(err => next(err));
			}
		});
	})
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end("PUT operation not supported.");
	})
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		(req, res, next) => {}
	);

//------------------------------------
favoriteRouter
	.route("/:campsiteId")
	.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) =>
		res.sendStatus(200)
	)
	.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end("PUT operation not supported");
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {})
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end("PUT operation not supported.");
	})
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		(req, res, next) => {}
	);

// -----------------------------------
module.exports = favoriteRouter;
