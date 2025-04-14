const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Load gRPC proto files
const GETSTOCK_PROTO_PATH = path.join(__dirname, '../proto/getstock.proto');
const getStockProto = grpc.loadPackageDefinition(protoLoader.loadSync(GETSTOCK_PROTO_PATH)).getstock;

const GET_STOCK_SERVICE_ADDRESS = '127.0.0.1:50052';

let stockItems = [];

// Load Stock Data from CSV
function loadStockData(callback) {
  stockItems = [];

  fs.createReadStream('StockItems.csv')
    .pipe(csv())
    .on('data', (row) => {
      stockItems.push({
        id: row.id.trim(),
        name: row.name.trim(),
        quantity: parseInt(row.quantity) || 0,
        price: parseFloat(row.price) || 0.0,
      });
    })
    .on('end', () => {
      console.log("Stock Data Loaded into Memory");
      callback();
    })
    .on('error', (error) => {
      console.error("CSV Parsing Error:", error);
    });
}

// Get Stock by ID error response
function getStockById(call, callback) {
  const stockId = call.request.id.trim();
  console.log(`Requested stock ID: ${stockId}`);

  const stock = stockItems.find(s => s.id === stockId);
  if (!stock) {
    console.error(` Stock not found for ID: ${stockId}`);
    return callback({
      code: grpc.status.NOT_FOUND,
      message: `Stock with ID ${stockId} not found`,
    });
  }
  //log message to console
  console.log("Stock Retrieved:", stock);
  callback(null, { item: stock });
}

// Start gRPC Server
const getStockServer = new grpc.Server();
getStockServer.addService(getStockProto.GetStockService.service, { GetStockById: getStockById });

loadStockData(() => {
  getStockServer.bindAsync(GET_STOCK_SERVICE_ADDRESS, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error("Failed to start GetStock Service:", err.message);
      return;
    }
    console.log(`GetStock Service running at ${GET_STOCK_SERVICE_ADDRESS}`);

  });
});
