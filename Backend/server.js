const http = require('http');
const app = require('./app');
const {initializeSocket} = require('./socket');
const port = process.env.PORT || 3000;
 
const server = http.createServer(app);
initializeSocket(server);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});