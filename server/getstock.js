const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load `get_stock.proto`
const GET_STOCK_PROTO_PATH = path.join(__dirname, '../proto/get_stock.proto');
const getStockDefinition = protoLoader.loadSync(GET_STOCK_PROTO_PATH, {});
const getStockProto = grpc.loadPackageDefinition(getStockDefinition).get_stock;

// Load `discovery.proto`
const DISCOVERY_PROTO_PATH = path.join(__dirname, '../proto/discovery.proto');
const discoveryDefinition = protoLoader.loadSync(DISCOVERY_PROTO_PATH, {});
const discoveryProto = grpc.loadPackageDefinition(discoveryDefinition).discovery;

// Stock list data
const stockItems = [
  { id: "1", name: "Apple", quantity: 100, price: 1.99 },
  { id: "2", name: "Banana", quantity: 150, price: 0.99 },
  { id: "3", name: "Orange", quantity: 75, price: 1.49 },
];

// Implement `GetStockById`
const getStockById = (call, callback) => {
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

// Start `GetStockService`
const getStockServer = new grpc.Server();
getStockServer.addService(getStockProto.GetStockService.service, { GetStockById: getStockById });

const GET_STOCK_SERVICE_ADDRESS = '127.0.0.1:50053';

getStockServer.bindAsync(GET_STOCK_SERVICE_ADDRESS, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`GetStock Service running at ${GET_STOCK_SERVICE_ADDRESS}`);

    // Register `GetStockService` with Discovery Service
    const discoveryClient = new discoveryProto.DiscoveryService('127.0.0.1:50052', grpc.credentials.createInsecure());
    const serviceInfo = { name: "GetStockService", address: GET_STOCK_SERVICE_ADDRESS };

    discoveryClient.RegisterService(serviceInfo, (err, response) => {
        if (err) {
            console.error('Failed to register GetStockService:', err.message);
        } else {
            console.log('GetStock Service registered successfully with Discovery Service');
        }
    });
});
