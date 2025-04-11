// getStockList.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { getServiceAddress } = require('./clientDiscovery');

// Define the path for the stock.proto file (one level up from the client folder)
const STOCK_PROTO_PATH = path.join(__dirname, '../proto/stock.proto');

// Load the stock proto definition
const stockDefinition = protoLoader.loadSync(STOCK_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const stockProto = grpc.loadPackageDefinition(stockDefinition).stock;


const GETSTOCKLIST_SERVICE_ADDRESS = '127.0.0.1:50051';
const stockClient = new stockProto.StockService(GETSTOCKLIST_SERVICE_ADDRESS, grpc.credentials.createInsecure());


/**
 * Retrieves the stock list via gRPC.
 *
 * @param {function(Error, Object[])} callback - Callback function to handle the response
 */
function getStockList(callback) {
  // Look up the StockService address using discovery
  getServiceAddress("StockService", (err, address) => {
    if (err) {
      return callback(err);
    }
    // Create the StockService client with the discovered address
    const stockClient = new stockProto.StockService(address, grpc.credentials.createInsecure());

    // Call the GetStockList RPC
    stockClient.GetStockList({}, (err, response) => {
      if (err) {
        return callback(err);
      }
      // Return the stocks array on success
      callback(null, response.items);
    });
  });
}

// Export the function for use in your REST API endpoints or elsewhere
module.exports = getStockList;

// For standalone testing, run this module directly
if (require.main === module) {
  getStockList((err, items) => {
    if (err) {
      console.error("Error retrieving stock list:", err);
    } else {
  //    console.log("Stock list:", itemsitems.forEach(item => {
  //console.log("Stock list:", items);
  //items.forEach(item => {
  //  console.log(`Stock Name: ${item.name}, Price: €${item.price.toFixed(2)}`);
  //});
  console.log("Stock list:", items.map(item => ({ ...item, price: item.price.toFixed(2) })));

    }
  });
}
