// getStockById.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { getServiceAddress } = require('./clientDiscovery');

// Use the new proto filename "getstock.proto"
const GET_STOCK_PROTO_PATH = path.join(__dirname, '../proto/getstock.proto');

// Load the proto definition with the desired options.
const getStockDefinition = protoLoader.loadSync(GET_STOCK_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const getStockProto = grpc.loadPackageDefinition(getStockDefinition).get_stock;

/**
 * Retrieves a stock item by ID via gRPC.
 *
 * @param {string} stockId - The ID of the stock item to retrieve.
 * @param {function(Error, Object)} callback - Callback with either an error or the stock item.
 */
function getStockById(stockId, callback) {
  console.log(`Attempting to retrieve stock with ID: ${stockId}`);

  // Look up the GetStockService address using your discovery service
  getServiceAddress("GetStockService", (err, address) => {
    if (err) {
      console.error("Error retrieving GetStockService address:", err.message);
      return callback(err);
    }
    console.log(`Discovered GetStockService at address: ${address}`);

    // Create the gRPC client for the GetStockService
    const getStockClient = new getStockProto.GetStockService(address, grpc.credentials.createInsecure());

    // Make sure the request field (here, 'stock_id') matches what is defined in your proto file.
    getStockClient.GetStockById({ stock_id: stockId }, (err, response) => {
      if (err) {
        console.error("Error calling GetStockById RPC:", err.message);
        return callback(err);
      }

      if (!response || !response.item) {
        const error = new Error("Stock item not found");
        console.error(error.message);
        return callback(error);
      }

      callback(null, response.item);
    });
  });
}

module.exports = getStockById;

// For standalone testing:
if (require.main === module) {
  // Change "1" to an existing stock id for testing.
  getStockById("1", (err, item) => {
    if (err) {
      console.error("Test call failed:", err);
    } else {
      console.log("Retrieved stock item:", item);
    }
  });
}
