"uses strict";
const app = require("../src/app");
const debug = require("debug");
const http = require("http");

const port = normalizePort(process.env.PORT || "8081");
app.set("port", port);

const server = http.createServer(app);

server.listen(port, () => {
	console.log("Server runing into port: ", port);
	console.log("Access: http://localhost:" + port);
});
server.on("error", onError);
server.on("listening", onListening);

// Normalize port from express generetor, it gets a valid port or return
// false to get the default port "8081"
function normalizePort(val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}

	if (port >= 0) {
		return port;
	}

	return false;
}

// Server error handling function
function onError(error) {
	if (error.syscall !== "listen") {
		throw error;
	}

	const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use");
			process.exit(1);
			break;
		default:
			throw error;
	}
}

// Start the server
function onListening() {
	const addr = server.address();
	const bind =
		typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
	debug("Listening on " + bind);
}
