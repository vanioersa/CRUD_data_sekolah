const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Set up CORS
app.use(cors());

// Routes
app.post('/tugas_akhir/api/murid/add', (req, res) => {
  // Implement your route logic here
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
