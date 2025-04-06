// clientChat.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const CHAT_PROTO_PATH = path.join(__dirname, '../proto/chat.proto');
const chatDefinition = protoLoader.loadSync(CHAT_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const chatProto = grpc.loadPackageDefinition(chatDefinition).chat;

const CHAT_SERVICE_ADDRESS = '127.0.0.1:50054';
const chatClient = new chatProto.ChatService(CHAT_SERVICE_ADDRESS, grpc.credentials.createInsecure());

/**
 * Sends a chat message via gRPC.
 * @param {Object} chatData - An object containing properties "user" and "message".
 * @param {function(Error, Object)} callback - Callback function to handle the response.
 */
function sendChatMessage(chatData, callback) {
  console.log('Sending chat message:', chatData);
  chatClient.SendMessage(chatData, (err, response) => {
    if (err) {
      console.error("Error sending chat message:", err);
      return callback(err);
    }
    console.log("Received chat response:", response);
    callback(null, response);
  });
}

// Export the sendChatMessage function for use in other modules.
module.exports = sendChatMessage;

// When this file is run directly, use a test message.
if (require.main === module) {
  const testData = { user: "Steven", message: "Hello from the client!" };
  sendChatMessage(testData, (err, resp) => {
    if (err) {
      console.error('Test error:', err);
    } else {
      // Log the inner property, e.g., "response", which contains the message.
      console.log('Test response:', resp.response);
    }
  });
}
