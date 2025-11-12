const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer
const upload = multer({ storage: multer.memoryStorage() });

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>File Metadata Microservice</title>
        <style>
            body { font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px; }
            .form { background: #f9f9f9; padding: 20px; border-radius: 8px; }
            input, button { margin: 10px 0; padding: 10px; width: 100%; }
            .result { margin-top: 20px; padding: 15px; background: #e9f7ef; display: none; }
        </style>
    </head>
    <body>
        <h1>File Metadata Microservice</h1>
        <form class="form" id="uploadForm" enctype="multipart/form-data">
            <input type="file" name="upfile" id="upfile" required>
            <button type="submit">Upload File</button>
        </form>
        <div class="result" id="result"></div>
        
        <script>
            document.getElementById('uploadForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                const formData = new FormData();
                formData.append('upfile', document.getElementById('upfile').files[0]);
                
                try {
                    const response = await fetch('/api/fileanalyse', { method: 'POST', body: formData });
                    const data = await response.json();
                    document.getElementById('result').innerHTML = '<strong>File Metadata:</strong><br>' +
                        'Name: ' + data.name + '<br>' +
                        'Type: ' + data.type + '<br>' +
                        'Size: ' + data.size + ' bytes';
                    document.getElementById('result').style.display = 'block';
                } catch (error) {
                    alert('Error: ' + error.message);
                }
            });
        </script>
    </body>
    </html>
  `);
});

// API endpoint
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.json({ error: 'No file uploaded' });
  }
  
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

// Export for Vercel
module.exports = app;