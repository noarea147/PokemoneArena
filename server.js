const app = require("./app");

const port = process.env.PORT_CLIENT || 3000;
const server = require("http").createServer(app);

server.listen(port || 3000, () => {
  console.log(`Client Server started on port ${port}`);
});

module.exports = server;
