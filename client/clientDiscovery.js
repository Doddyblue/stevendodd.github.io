const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const DISCOVERY_PROTO_PATH = path.join(__dirname, '../proto/discovery.proto');
console.log("Resolved discovery proto path:", DISCOVERY_PROTO_PATH);

const discoveryDefinition = protoLoader.loadSync(DISCOVERY_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const discoveryProto = grpc.loadPackageDefinition(discoveryDefinition).discovery;

// Create a Discovery client on the expected port (e.g., 50050)
const discoveryClient = new discoveryProto.DiscoveryService('127.0.0.1:50050', grpc.credentials.createInsecure());

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

module.exports = { getServiceAddress };
