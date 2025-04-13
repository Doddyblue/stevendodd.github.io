// app.js
const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');
//const logger = require('./logger');
const port = 3000; //define port no.
const logger = require('../server/logger'); //Path from server

app.use(express.json());

//Logging HTTP requests using Morgan
app.use(morgan('combined', { stream: require('fs').createWriteStream('./logs/access.log', { flags: 'a' }) }));

//Log API activity
app.use((req, res, next) => {
  logger.info(`Received request: ${req.method} ${req.url}`);
  next();
});

// Logging process with time and date including procesing duration
app.use((req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => { //Log after response is sent
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.url} processed in ${duration}ms`);
  });

  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});


// Required modules
const getStockList = require('./getStockList');
const getStockById = require('./getStockById');
const sendChatMessage = require('./clientChat');

// stock list
app.get('/api/stocks', (req, res) => {
  getStockList((err, data) => {
    if (err) return res.status(500).send(err.message);
    res.json(data);
  });
});

// Stock by ID
app.get('/api/stocks/:id', (req, res) => {
  const stockId = req.params.id.trim();
  console.log(`Received GET request for stock ID: ${stockId}`);
  getStockById(stockId, (err, data) => {
    if (err) return res.status(404).send(err.message);
    res.json(data);
  });
});

// Chat messages
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

app.use(express.static(path.join(__dirname, 'public')));

// Start the server on port 3000
app.listen(port, () => {
  console.log(`REST API server running at http://localhost:${port}`)
  });
