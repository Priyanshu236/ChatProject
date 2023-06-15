const ws = require('ws');
const { verifyTokenAndGetUser } = require("./utils");
const Message = require('./models/message');
function initWebSocketServer(server) {
  const wss = new ws.WebSocketServer({ server });

  const connectedClients = new Set(); // Store connected clients here

  wss.on('connection', (connection, req) => {
    console.log("connected");

    const { userId, username } = verifyTokenAndGetUser(req);
    if (userId && username) {
      connection.userId = userId;
      connection.username = username;
      connectedClients.add(connection); // Add connected client to set
    }

    [...wss.clients].forEach(client => {
      client.send(JSON.stringify({
        online: [...connectedClients].map(c => ({ userId: c.userId, username: c.username })) // Use the set of connected clients instead of wss.clients
      }));
    });

    connection.on('message', async (data) => {
      data = JSON.parse(data.toString());
      const { userId: receiver, message,filePath } = data;

      
      const messageDoc = await Message.create({
        sender: connection.userId,
        receiver: data.userId,
        msg: data.message,
        filePath: filePath
      });

      [...connectedClients].forEach(client => {
        if (client.userId === receiver) {
          client.send(JSON.stringify({
            id: messageDoc._id,
            message: message,
            sender: connection.userId,
            filePath: filePath
          }));
        }
      });
    });

    connection.on('close', () => {
      console.log('disconnected');
      connectedClients.delete(connection); // Remove disconnected client from set
      [...wss.clients].forEach(client => {
        client.send(JSON.stringify({
          online: [...connectedClients].map(c => ({ userId: c.userId, username: c.username })) // Use the set of connected clients instead of wss.clients
        }));
      });
    });
  });
}

module.exports = { initWebSocketServer };
