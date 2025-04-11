const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { getServiceAddress } = require('./clientDiscovery');

// Define the path to the correct proto file
const GETSTOCK_PROTO_PATH = path.join(__dirname, '../proto/getstock.proto');

// Load the proto definition with options
const getStockDefinition = protoLoader.loadSync(GETSTOCK_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const getStockProto = grpc.loadPackageDefinition(getStockDefinition).getstock; // Ensure correct package name

// Sample stock data (if not using database)
const stockItems = [
  { id: "1", name: "Apple Inc.", quantity: 100, price: 150.5 },
  { id: "2", name: "Microsoft Corp.", quantity: 50, price: 299.99 }
];

/**
 * Retrieves a stock item by ID via gRPC.
 * @param {string} stockId - The ID of the stock item to retrieve.
 * @param {function(Error, Object)} callback - Callback with either an error or the stock item.
 */
function getStockById(stockId, callback) {
    console.log(`Attempting to retrieve stock with ID: ${stockId}`);

    // Look up the service address using discovery
    getServiceAddress("GetStockService", (err, address) => {
        if (err) {
            console.error("Error retrieving GetStockService address:", err.message);
            return callback(err);
        }
        console.log(`Discovered GetStockService at address: ${address}`);

        const getStockClient = new getStockProto.GetStockService(address, grpc.credentials.createInsecure());

        getStockClient.GetStockById({ id: stockId }, (err, response) => {
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

// Export function properly
module.exports = getStockById;

// Standalone testing
if (require.main === module) {
    getStockById("1", (err, item) => {
        if (err) {
            console.error("Test call failed:", err);
        } else {
            console.log("Retrieved stock item:", item);
        }
    });
}
