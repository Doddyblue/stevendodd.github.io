const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Define paths to the proto files
const DISCOVERY_PROTO_PATH = path.join(__dirname, '../proto/discovery.proto');
console.log("Resolved discovery proto path:", DISCOVERY_PROTO_PATH);

const STOCK_PROTO_PATH = path.join(__dirname, '../proto/stock.proto');
const GETSTOCK_PROTO_PATH = path.join(__dirname, '../proto/getstock.proto');
const CHAT_PROTO_PATH = path.join(__dirname, '../proto/chat.proto');


const discoveryDefinition = protoLoader.loadSync(DISCOVERY_PROTO_PATH, {});

const stockDefinition = protoLoader.loadSync(STOCK_PROTO_PATH);
const getStockDefinition = protoLoader.loadSync(GETSTOCK_PROTO_PATH);
const chatDefinition = protoLoader.loadSync(CHAT_PROTO_PATH);

const discoveryProto = grpc.loadPackageDefinition(discoveryDefinition).discovery;
const stockProto = grpc.loadPackageDefinition(stockDefinition).stock;
const getStockProto = grpc.loadPackageDefinition(getStockDefinition).getstock;
const chatProto = grpc.loadPackageDefinition(chatDefinition).chat;

// Create separate gRPC clients for each service
const discoveryClient = new discoveryProto.DiscoveryService('127.0.0.1:50050', grpc.credentials.createInsecure());
const stockClient = new stockProto.StockService('127.0.0.1:50051', grpc.credentials.createInsecure());
const getStockClient = new getStockProto.GetStockService('127.0.0.1:50052', grpc.credentials.createInsecure());
const chatClient = new chatProto.ChatService('127.0.0.1:50054', grpc.credentials.createInsecure());

// Function to retrieve the service address from discovery
function getServiceAddress(serviceName, callback) {
  discoveryClient.getServices({}, (err, response) => {
    if (err) {
      return callback(err, null);
    }
    const service = response.services.find(s => s.name === serviceName);
    if (!service) {
      return callback(new Error(`Service ${serviceName} not found`), null);
    }
    callback(null, service.address);
  });
}

module.exports = {
  getServiceAddress,
  stockClient,
  getStockClient,
  chatClient
};
