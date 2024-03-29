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


let id;

const ask = async () => {
  const message = await rl.question('Enter a message > ');
  // * move cursor one line up
  await moveCursor(0, -1);
  // * Clear the current line that the cursor is in
  await clearLine(0);
  socket.write(`${id}-message-${message}`);
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
   await clearLine(0);

   const dataStr = data.toString('utf-8');

  if(dataStr.startsWith('id-')) {
    // * New client connected
    id = dataStr.substring(3);
    console.log(`Your id is ${id}!\n`);
  }
  else {
    // * New message received
    console.log(dataStr);
  }

  ask();
})

socket.on('close', () => {
  console.log('Connection Closed');
}); 

socket.on('end', () => {
  console.log('disconnected from server');
}); 