// app.js
const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse JSON bodies (must come before the routes)
app.use(express.json());

// Require your modules
const getStockList = require('./getStockList');
const getStockById = require('./getStockById');
const sendChatMessage = require('./clientChat');  // Your chat module

// REST endpoint to get the full stock list
app.get('/api/stocks', (req, res) => {
  getStockList((err, data) => {
    if (err) return res.status(500).send(err.message);
    res.json(data);
  });
});

// REST endpoint to get a single stock by ID
app.get('/api/stocks/:id', (req, res) => {
  const stockId = req.params.id.trim();
  console.log(`Received GET request for stock ID: ${stockId}`);
  getStockById(stockId, (err, data) => {
    if (err) return res.status(404).send(err.message);
    res.json(data);
  });
});

// REST endpoint for chat messages
app.post('/api/chat', (req, res) => {
  const chatData = req.body;
  if (!chatData || !chatData.user || !chatData.message) {
    return res.status(400).send("Missing 'user' or 'message' fields.");
  }
  console.log(`Received chat message from ${chatData.user}: ${chatData.message}`);
  sendChatMessage(chatData, (err, response) => {
    if (err) return res.status(500).send(err.message);
    res.json({ response });
  });
});

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Start the server on port 3000
const port = 3000;
app.listen(port, () => console.log(`REST API server running at http://localhost:${port}`));
