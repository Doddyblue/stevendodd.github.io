const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const CHAT_PROTO_PATH = path.join(__dirname, '../proto/chat.proto');
const chatProto = grpc.loadPackageDefinition(protoLoader.loadSync(CHAT_PROTO_PATH)).chat;
const CHAT_SERVICE_ADDRESS = '127.0.0.1:50054';

//Chat return message format
const sendMessage = (call, callback) => {
  console.log(`Received chat request from ${call.request.user}: ${call.request.message}`);
  const responseText = `Hello ${call.request.user}, I received your message: "${call.request.message}"`;
  console.log("Sending response:", responseText); // output to command prompt
  callback(null, { response: responseText });
};

// Start gRPC Server
const server = new grpc.Server();
server.addService(chatProto.ChatService.service, { sendMessage });
server.bindAsync(CHAT_SERVICE_ADDRESS, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error("Failed to start Chat Service:", err.message);
    return;
  }

  console.log(`Chat Service running at ${CHAT_SERVICE_ADDRESS} on port ${port}`);


  registerWithDiscovery();
});

// Register Chat Service with Discovery Service
function registerWithDiscovery() {
  const DISCOVERY_PROTO_PATH = path.join(__dirname, '../proto/discovery.proto');
  const discoveryProto = grpc.loadPackageDefinition(protoLoader.loadSync(DISCOVERY_PROTO_PATH)).discovery;

  const discoveryClient = new discoveryProto.DiscoveryService('127.0.0.1:50050', grpc.credentials.createInsecure());
  const serviceInfo = { name: "ChatService", address: CHAT_SERVICE_ADDRESS };

  discoveryClient.registerService(serviceInfo, (err, response) => {
    if (err) {
      console.error('Failed to register Chat Service:', err.message);
    } else {
      console.log('Chat Service registered successfully with Discovery Service');
    }
  });
}
