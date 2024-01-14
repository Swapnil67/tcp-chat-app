const net = require('node:net');
const readline = require('node:readline/promises');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    })
  })
}

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    })
  })
}




// * socekt = net.Socket (Duplex Stream)
const socket = net.createConnection({ host: '127.0.0.1', port: 3008 }, async () => {
  console.log("Connected to the server\n");
})


const ask = async () => {
  const message = await rl.question('Enter a message > ');
  // * move cursor one line up
  await moveCursor(0, -1);
  // * Clear the current line that the cursor is in
  await clearLine(0);
  socket.write(message);
}

socket.on('connect', () => {
  ask();
})


socket.on('data', async (data) => {
  // * Log an empty line
  console.log();
  // * Move the cursor one line up
  await moveCursor(0, -1);
  // * Clear that line that cursor just moved into
  await clearLine(0)
  console.log(data.toString('utf-8'));
  ask();
})

socket.on('close', () => {
  console.log('Connection Closed');
}); 

socket.on('end', () => {
  console.log('disconnected from server');
}); 