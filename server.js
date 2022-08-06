const app = require("./app");

const server = app.listen(process.env.PORT_CLIENT || 3000, () => {
  const port = server.address().port;
  console.log(`Client Server started on port ${port}`);
});
module.exports = server;
