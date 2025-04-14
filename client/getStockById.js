const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { getServiceAddress } = require('./clientDiscovery');

// Load gRPC proto files
const GETSTOCK_PROTO_PATH = path.join(__dirname, '../proto/getstock.proto');
const getStockDefinition = protoLoader.loadSync(GETSTOCK_PROTO_PATH, {});
const getStockProto = grpc.loadPackageDefinition(getStockDefinition).getstock;

// Get stock item byID
function getStockById(stockId, callback) {
    console.log(`Attempting to retrieve stock with ID: ${stockId}`);

    // Look up the service address using discovery
    getServiceAddress("GetStockService", (err, address) => {
        if (err || !address) {
            console.error("Service discovery failed, using default address: 127.0.0.1:50052");
            address = "127.0.0.1:50052"; // Hardcoded fallback
        }
        //log address to console
        console.log(`Discovered GetStockService at address: ${address}`);

        const getStockClient = new getStockProto.GetStockService(address, grpc.credentials.createInsecure());

        //get stock error response
        getStockClient.GetStockById({ id: stockId }, (err, response) => {
            if (err) {
                console.error("gRPC error:", err.code, "-", err.message);
                return callback(err);
            }

            if (!response || !response.item) {
                const error = new Error("Stock item not found");
                console.error(error.message);
                return callback(error);
            }
            //log message to console
            console.log("Stock Retrieved:", response.item);
            callback(null, response.item);
        });
    });
}

// Export function properly
module.exports = getStockById;
