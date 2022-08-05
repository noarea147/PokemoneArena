const app = require("./app");

const port = process.env.PORT_CLIENT || 3000;
const server = require("http").createServer(app);

server.listen(port || 3000);

module.exports = server;
