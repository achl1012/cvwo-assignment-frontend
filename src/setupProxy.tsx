import { Application } from "express";

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app: Application) {
	app.use(
		["/users", "/login", "/channels", "/messages"],
		createProxyMiddleware({
			target: "https://forumflow-backend-ryao.onrender.com",
			changeOrigin: true,
		}),
	);
};