const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const CHAT_PROTO_PATH = path.join(__dirname, '../proto/chat.proto');

const chatDefinition = protoLoader.loadSync(CHAT_PROTO_PATH, {});
const chatProto = grpc.loadPackageDefinition(chatDefinition).chat;

const CHAT_SERVICE_ADDRESS = '127.0.0.1:50054';
const chatClient = new chatProto.ChatService(
  CHAT_SERVICE_ADDRESS,
  grpc.credentials.createInsecure()
);

//chat message 
function sendChatMessage(chatData, callback) {
  console.log('Sending chat message:', JSON.stringify(chatData, null, 2));
  //log error message to console
  chatClient.SendMessage(chatData, (err, response) => {
    if (err) {
      console.error("Error sending chat message:", err);
      return callback(err);
    }

    console.log("Received raw response:", response);

    // check response format
    if (typeof response === 'object') {
      response = JSON.stringify(response, null, 2);
    }
    //log to console
    console.log("Formatted response:", response);
    callback(null, response);
  });
}

module.exports = sendChatMessage;
