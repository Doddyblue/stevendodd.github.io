const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const DISCOVERY_PROTO_PATH = path.join(__dirname, '../proto/discovery.proto');
const packageDefinition = protoLoader.loadSync(DISCOVERY_PROTO_PATH, {});
const discoveryProto = grpc.loadPackageDefinition(packageDefinition).discovery;

// In-memory service registry
const services = [];

const registerService = (call, callback) => {
    services.push(call.request);
    console.log(`Registered service: ${call.request.name} at ${call.request.address}`);
    callback(null, {}); // Return an empty response
};

const getServices = (call, callback) => {
    callback(null, { services });
};

// Start Discovery Server
const discoveryServer = new grpc.Server();
discoveryServer.addService(discoveryProto.DiscoveryService.service, {
    RegisterService: registerService,
    GetServices: getServices,
});

const DISCOVERY_SERVICE_ADDRESS = '127.0.0.1:50052';

discoveryServer.bindAsync(DISCOVERY_SERVICE_ADDRESS, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`Discovery Service running at ${DISCOVERY_SERVICE_ADDRESS}`);
});
