const express = require("express");
const { rethrow } = require("jade/lib/runtime");
const Promotion = require("../models/promotion");
const promotionRouter = express.Router();
const authenticate = require("../authenticate");
const cors = require("./cors");

promotionRouter
	.route("/:promotionId")
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		next();
	})
	.get(cors.cors, (req, res, next) => {
		Promotion.findById(req.params.promotionId)
			.then(promotion => {
				res.json(promotion);
			})
			.catch(err => next(err));
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end(
			`POST operation not supported on /promotions/${req.params.promotionId}`
		);
	})
	.put(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Promotion.findByIdAndUpdate(
				req.params.promotionId,
				{
					$set: req.body,
				},
				{ new: true }
			)
				.then(promotion => {
					res.json(promotion);
				})
				.catch(err => next(err));
		}
	)
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Promotion.findByIdAndDelete(req.params.promotionId)
				.then(response => {
					res.json(response);
				})
				.catch(err => next(err));
		}
	);

//---------------------------------------------------------------------------
promotionRouter
	.route("/")
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		next();
	})
	.get(cors.cors, (req, res, next) => {
		Promotion.find()
			.then(promotions => {
				res.json(promotions);
			})
			.catch(err => next(err));
	})
	.post(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Promotion.create(req.body)
				.then(promotion => {
					res.json(promotion);
				})
				.catch(err => next(err));
		}
	)
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end("PUT operation not supported on /promotions");
	})
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Promotion.deleteMany()
				.then(response => {
					res.json(response);
				})
				.catch(err => next(err));
		}
	);

module.exports = promotionRouter;
