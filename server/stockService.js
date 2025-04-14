const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Load stock service proto
const STOCK_PROTO_PATH = path.join(__dirname, '../proto/stock.proto');
const stockProto = grpc.loadPackageDefinition(protoLoader.loadSync(STOCK_PROTO_PATH)).stock;

// Load discovery service proto
const DISCOVERY_PROTO_PATH = path.join(__dirname, '../proto/discovery.proto');
const discoveryProto = grpc.loadPackageDefinition(protoLoader.loadSync(DISCOVERY_PROTO_PATH)).discovery;

const STOCK_SERVICE_ADDRESS = '127.0.0.1:50051';

// Read Stock List from CSV
function readStockItems(callback) {
  const stockItems = [];

  fs.createReadStream('StockItems.csv')
    .pipe(csv())
    .on('data', (row) => {
      stockItems.push({
        id: row.id,
        name: row.name,
        quantity: parseInt(row.quantity),
        price: parseFloat(row.price),
      });
    })
    .on('end', () => {
      console.log("Stock Data Loaded:", stockItems);
      callback(null, stockItems);
    })
    .on('error', (error) => {
      console.error("Error reading CSV file:", error);
      callback(error);
    });
}
//logger
const logger = require('./logger');

function getStockById(call, callback) {
  const stockId = call.request.id.trim();
  logger.info(`Stock lookup request for ID: ${stockId}`);

  const stock = stockItems.find(s => s.id === stockId);
  if (!stock) {
    logger.error(`Stock not found for ID: ${stockId}`);
    return callback(new Error("Stock not found"));
  }

  logger.info(`Stock Retrieved: ${JSON.stringify(stock)}`);
  callback(null, { item: stock });
}

// gRPC GetStockList - Reads Stock List from CSV
function getStockList(call, callback) {
  readStockItems((error, stockItems) => {
    if (error) {
      return callback(error);
    }
    callback(null, { items: stockItems });
  });
}

// gRPC GetStockById - Searches for Stock in CSV
function getStockById(call, callback) {
  const stockId = call.request.id.trim();

  readStockItems((error, stockItems) => {
    if (error) {
      return callback(error);
    }

    const stock = stockItems.find(s => s.id === stockId);
    if (!stock) {
      console.error(`Stock not found for ID: ${stockId}`);
      return callback(new Error("Stock not found"));
    }

    console.log("Stock Retrieved:", stock);
    callback(null, stock);
  });
}

// Start Stock Service
const stockServer = new grpc.Server();
stockServer.addService(stockProto.StockService.service, { GetStockList: getStockList, GetStockById: getStockById });

stockServer.bindAsync(STOCK_SERVICE_ADDRESS, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error("Failed to start Stock Service:", err.message);
    return;
  }
  console.log(`Stock Service running at ${STOCK_SERVICE_ADDRESS}`);

  //Register Stock Service with Discovery Service
  const discoveryClient = new discoveryProto.DiscoveryService('127.0.0.1:50050', grpc.credentials.createInsecure());
  const serviceInfo = { name: "StockService", address: STOCK_SERVICE_ADDRESS };

  discoveryClient.registerService(serviceInfo, (err, response) => {
    if (err) {
      console.error('Failed to register with Discovery Service:', err.message);
    } else {
      console.log('Stock Service registered successfully with Discovery Service');
    }
  });
});
