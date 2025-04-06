const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load stock service proto
const STOCK_PROTO_PATH = path.join(__dirname, '../proto/stock.proto');
const stockDefinition = protoLoader.loadSync(STOCK_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const stockProto = grpc.loadPackageDefinition(stockDefinition).stock;

// Load discovery service proto
const DISCOVERY_PROTO_PATH = path.join(__dirname, '../proto/discovery.proto');
const discoveryDefinition = protoLoader.loadSync(DISCOVERY_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const discoveryProto = grpc.loadPackageDefinition(discoveryDefinition).discovery;

const GET_STOCK_PROTO_PATH = path.join(__dirname, '../proto/getstock.proto');
const getStockDefinition = protoLoader.loadSync(GET_STOCK_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const getStockProto = grpc.loadPackageDefinition(getStockDefinition).get_stock;

// Stock list data
const stockItems = [
  { id: "1", name: "Apple", quantity: 100, price: 1.99 },
  { id: "2", name: "Banana", quantity: 150, price: 0.99 },
  { id: "3", name: "Orange", quantity: 75, price: 1.49 },
];

// Implement GetStockById RPC
const getStockById = (call, callback) => {
    if (!call.request.stock_id) {
        return callback({ code: grpc.status.INVALID_ARGUMENT, details: "Stock ID is required" });
    }

    console.log(`Requested stock ID: ${call.request.stock_id}`);
    const stockItem = stockItems.find(item => item.id === call.request.stock_id);

    if (stockItem) {
        console.log(`Found stock: ${JSON.stringify(stockItem)}`);
        callback(null, { item: stockItem });
    } else {
        console.error("Stock item not found");
        callback({ code: grpc.status.NOT_FOUND, details: "Stock item not found" });
    }
};

// Start Stock Service
const stockServer = new grpc.Server();
stockServer.addService(stockProto.StockService.service, { GetStockList: (call, callback) => callback(null, { items: stockItems }) });

const STOCK_SERVICE_ADDRESS = '127.0.0.1:50051';

stockServer.bindAsync(STOCK_SERVICE_ADDRESS, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error("Failed to start Stock Service:", err.message);
        return;
    }
    console.log(`Stock Service running at ${STOCK_SERVICE_ADDRESS}`);

    // Register Stock Service with Discovery Service using the camelCase method name.
  const discoveryClient = new discoveryProto.DiscoveryService('127.0.0.1:50050', grpc.credentials.createInsecure());
  const serviceInfo = { name: "StockService", address: STOCK_SERVICE_ADDRESS };

  discoveryClient.registerService(serviceInfo, (err, response) => {
      if (err) {
          console.error('Failed to register with Discovery Service:', err.message);
      } else {
          console.log('Stock Service registered successfully with Discovery Service');
      }
  });


    //stockServer.start(); // 🔹 **Ensure the server is actually running after registration**
});
