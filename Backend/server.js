const http = require('http');
const app = require('./app'); // <-- This is your Express app
const {initializeSocket} = require('./socket');
const port = process.env.PORT || 3000;

const server = http.createServer(app); // <-- Node.js HTTP server using Express app
initializeSocket(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});