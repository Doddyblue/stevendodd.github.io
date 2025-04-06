const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const DISCOVERY_SERVICE_ADDRESS = "localhost:50050"; // Define service address
const DISCOVERY_PROTO_PATH = path.join(__dirname, '../proto/discovery.proto');
const packageDefinition = protoLoader.loadSync(DISCOVERY_PROTO_PATH, {});
const discoveryProto = grpc.loadPackageDefinition(packageDefinition).discovery;

// In-memory service registry
const services = [];

// Register a service
const registerService = (call, callback) => {
    const exists = services.find(s => s.name === call.request.name);
    if (!exists) {
        services.push(call.request);
        console.log(`Registered service: ${call.request.name} at ${call.request.address}`);
    } else {
        console.warn(`Service ${call.request.name} is already registered.`);
    }
    callback(null, {});
};

// Get all registered services
const getServices = (call, callback) => {
    try {
        callback(null, { services });
    } catch (error) {
        console.error("Error retrieving services:", error.message);
        callback(error, null);
    }
};

// Start Discovery Server
const discoveryServer = new grpc.Server();
discoveryServer.addService(discoveryProto.DiscoveryService.service, {
    RegisterService: registerService,
    GetServices: getServices,
});

discoveryServer.bindAsync(DISCOVERY_SERVICE_ADDRESS, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`Discovery Service running at ${DISCOVERY_SERVICE_ADDRESS}`);
});
