const express = require("express");
const { Router } = express;
var argv = require("minimist")(process.argv.slice(2));

const envRouter = new Router();
const numCPUs = require("os").cpus().length;

getEnvInfo = () => {
	return {
		argv: JSON.stringify(argv),
		cwd: process.cwd(),
		pid: process.pid,
		version: process.version,
		platform: process.platform,
		memoryUsage: JSON.stringify(process.memoryUsage()),
		numCPUs,
	};
};

envRouter.get("/", async (req, res) => {
	const info = getEnvInfo();
	res.render("info", {
		layout: "index",
		info,
	});
});

module.exports = { envRouter };
