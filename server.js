const net = require('node:net');

const server = net.createServer();

// * To set max connection limit to server
// server.maxConnections = 1;

const clients = [];

server.on('connection', (socket) => {
  // * socekt = net.Socket (Duplex Stream)
  console.log('A new connection to the server');
  clients.push(socket);

  socket.on('data', (chunk) => {
    // console.log(chunk.toString('utf-8'));
    clients.map(s => {
      s.write(chunk);
    })
  })
})

server.listen(3008, "127.0.0.1", () => {
  console.log(`Listening on ${JSON.stringify(server.address())}`);
})