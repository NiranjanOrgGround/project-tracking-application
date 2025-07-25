const express = require('express');
const path = require('path');
const app = require('./backend/server');

const PORT = process.env.PORT || 8080;

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Production server is running on port ${PORT}`);
});