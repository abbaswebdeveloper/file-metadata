const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for HTML form)
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Root endpoint - Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for file upload
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.json({ error: 'No file uploaded' });
    }

    // Get file details
    const file = req.file;

    // Return file metadata
    res.json({
      name: file.originalname,
      type: file.mimetype,
      size: file.size
    });

  } catch (error) {
    res.json({ error: 'File processing error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Server configuration
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`File Metadata Microservice running on port ${PORT}`);
});

module.exports = app;