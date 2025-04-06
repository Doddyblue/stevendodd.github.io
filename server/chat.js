// chat.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load chat service proto with proper options
const CHAT_PROTO_PATH = path.join(__dirname, '../proto/chat.proto');
const packageDefinition = protoLoader.loadSync(CHAT_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const chatProto = grpc.loadPackageDefinition(packageDefinition).chat;

const sendMessage = (call, callback) => {
  console.log(`Received Message from ${call.request.user}: ${call.request.message}`);
  callback(null, { response: `Hello ${call.request.user}, your message was received: "${call.request.message}"` });
};

const server = new grpc.Server();
server.addService(chatProto.ChatService.service, {
  SendMessage: sendMessage
});

// Use a port that is unique. For example, if StockService uses 50051 and Discovery uses 50050,
// let's use 50054 for Chat.
const CHAT_SERVICE_ADDRESS = '127.0.0.1:50054';

server.bindAsync(CHAT_SERVICE_ADDRESS, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error("Failed to start Chat Service:", err.message);
    return;
  }
  console.log(`Chat Service running at ${CHAT_SERVICE_ADDRESS}`);
  // Note: Calling start() here is optional per the deprecation notice.
  server.start();

  // Register the Chat Service with the Discovery Service.
  const DISCOVERY_PROTO_PATH = path.join(__dirname, '../proto/discovery.proto');
  const discoveryDefinition = protoLoader.loadSync(DISCOVERY_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
  const discoveryProto = grpc.loadPackageDefinition(discoveryDefinition).discovery;
  const discoveryClient = new discoveryProto.DiscoveryService('127.0.0.1:50050', grpc.credentials.createInsecure());

  // Use the proper service name expected by the client:
  const serviceInfo = { name: "ChatService", address: CHAT_SERVICE_ADDRESS };

  // Method names are typically converted to lower camelCase.
  discoveryClient.registerService(serviceInfo, (err, response) => {
    if (err) {
      console.error('Failed to register Chat Service:', err.message);
    } else {
      console.log('Chat Service registered successfully with Discovery Service');
    }
  });
});
