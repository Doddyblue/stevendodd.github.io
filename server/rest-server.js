const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');



const GET_STOCK_PROTO_PATH = path.join(__dirname, '../proto/get_stock.proto'); // Define path
const getStockDefinition = protoLoader.loadSync(GET_STOCK_PROTO_PATH, {}); // Load proto
const getStockProto = grpc.loadPackageDefinition(getStockDefinition).get_stock; // Load package

const grpcClient = new getStockProto.GetStockService(stockServiceAddress, grpc.credentials.createInsecure());
const STOCK_PROTO_PATH = path.join(__dirname, '../proto/stock.proto');
const DISCOVERY_PROTO_PATH = path.join(__dirname, '../proto/discovery.proto');

const stockDefinition = protoLoader.loadSync(STOCK_PROTO_PATH, {});
const stockProto = grpc.loadPackageDefinition(stockDefinition).stock;

const discoveryDefinition = protoLoader.loadSync(DISCOVERY_PROTO_PATH, {});
const discoveryProto = grpc.loadPackageDefinition(discoveryDefinition).discovery;

const discoveryClient = new discoveryProto.DiscoveryService('127.0.0.1:50052', grpc.credentials.createInsecure());
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'views')));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/index.html'));
});

// Dynamic StockService Connection
async function getStockServiceAddress() {
    return new Promise((resolve, reject) => {
        discoveryClient.GetServices({}, (err, response) => {
            if (err) {
                console.error('Error contacting Discovery Service:', err.message);
                return reject(err);
            }
            const stockService = response.services.find(s => s.name === "StockService");
            if (stockService) {
                console.log(`Discovered StockService at ${stockService.address}`);
                resolve(stockService.address);
            } else {
                reject(new Error("StockService not found"));
            }
        });
    });
}

// REST API endpoint to get stock list
app.get('/api/stocks/:id', async (req, res) => {
    console.log(`Fetching stock item with ID: ${req.params.id}`);

    try {
        const grpcClient = new getStockProto.GetStockService('127.0.0.1:50053', grpc.credentials.createInsecure());

        grpcClient.GetStockById({ stock_id: req.params.id }, (err, response) => {
            if (err) {
                console.error('Error fetching stock item:', err.message);
                return res.status(404).send('Stock item not found');
            }
            console.log(`Received stock item: ${JSON.stringify(response.item)}`);
            res.json(response.item);
        });
    } catch (error) {
        res.status(500).send('Failed to find GetStockService');
    }
});


// Start the Express server
app.listen(3000, () => {
    console.log('REST server running at http://localhost:3000');
});
