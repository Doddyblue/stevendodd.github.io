const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load stock service proto
const STOCK_PROTO_PATH = path.join(__dirname, '../proto/stock.proto');
const stockDefinition = protoLoader.loadSync(STOCK_PROTO_PATH, {});
const stockProto = grpc.loadPackageDefinition(stockDefinition).stock;

// Load discovery service proto
const DISCOVERY_PROTO_PATH = path.join(__dirname, '../proto/discovery.proto');
const discoveryDefinition = protoLoader.loadSync(DISCOVERY_PROTO_PATH, {});
const discoveryProto = grpc.loadPackageDefinition(discoveryDefinition).discovery;

const GET_STOCK_PROTO_PATH = path.join(__dirname, '../proto/get_stock.proto');
const getStockDefinition = protoLoader.loadSync(GET_STOCK_PROTO_PATH, {});
const getStockProto = grpc.loadPackageDefinition(getStockDefinition).get_stock;

const getStockById = (call, callback) => {
    const stockItem = stockItems.find(item => item.id === call.request.stock_id);
    if (stockItem) {
        callback(null, { item: stockItem });
    } else {
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Stock item not found"
        });
    }
};

// Create a new gRPC server instance for GetStockService
const getStockServer = new grpc.Server();
getStockServer.addService(getStockProto.GetStockService.service, { GetStockById: getStockById });

getStockServer.bindAsync('127.0.0.1:50053', grpc.ServerCredentials.createInsecure(), () => {
    console.log('GetStock Service running at http://127.0.0.1:50053');
});

// Stock list data
const stockItems = [
  { id: "1", name: "Apple", quantity: 100, price: 1.99 },
  { id: "2", name: "Banana", quantity: 150, price: 0.99 },
  { id: "3", name: "Orange", quantity: 75, price: 1.49 },
];

// Implement GetStockList RPC
const getStockList = (call, callback) => {
  callback(null, { items: stockItems });
};

// Start Stock Service
const stockServer = new grpc.Server();
stockServer.addService(stockProto.StockService.service, { GetStockList: getStockList });

const STOCK_SERVICE_ADDRESS = '127.0.0.1:50051';

stockServer.bindAsync(STOCK_SERVICE_ADDRESS, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Stock Service running at ${STOCK_SERVICE_ADDRESS}`);

  // Register Stock Service with Discovery Server
  const discoveryClient = new discoveryProto.DiscoveryService('127.0.0.1:50052', grpc.credentials.createInsecure());
  const serviceInfo = { name: "StockService", address: STOCK_SERVICE_ADDRESS };

  discoveryClient.RegisterService(serviceInfo, (err, response) => {
    if (err) {
      console.error('Failed to register with Discovery Service:', err.message);
    } else {
      console.log('Stock Service registered successfully with Discovery Service');
    }
  });
});
