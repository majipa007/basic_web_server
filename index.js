// Import necessary modules
const express = require('express');
const fs = require('fs');
const path = require('path');


const app = express();
const PORT = 3000;
app.use(express.json());
const filePath = path.join(__dirname, 'data.json');

// Route to save data (overwrites existing file)
app.post('/save', (req, res) => {
  const data = req.body; // Extract data from the POST request

  // Write the data to a file as JSON, overwriting if it exists
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
      res.status(500).send('Error saving data to file.');
    } else {
      console.log('Data saved successfully!');
      res.status(200).send('Data saved successfully!');
    }
  });
});

// Route to append data to the existing file
app.post('/append', (req, res) => {
  const data = req.body; // Extract data from the POST request
  fs.readFile(filePath, 'utf8', (err, fileData) => {
    let jsonData = [];
    if (!err && fileData) {
      try {
        const parsedData = JSON.parse(fileData);
        // Ensure parsedData is an array; if not, start with an empty array
        jsonData = Array.isArray(parsedData) ? parsedData : [];
      } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
      }
    }

    // Append new data to the array
    jsonData.push(data);
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        res.status(500).send('Error appending data to file.');
      } else {
        console.log('Data appended successfully!');
        res.status(200).send('Data appended successfully!');
      }
    });
  });
});

// Route to clear the file contents
app.post('/clear', (req, res) => {
  fs.writeFile(filePath, '[]', (err) => {
    if (err) {
      console.error('Error clearing file:', err);
      res.status(500).send('Error clearing file.');
    } else {
      console.log('Data cleared successfully!');
      res.status(200).send('Data cleared successfully!');
    }
  });
});

// Default route to display a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to the Express server! Use POST /save to save data, /append to append data, and /clear to clear data.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
