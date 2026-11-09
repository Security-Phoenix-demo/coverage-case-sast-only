// Deliberately vulnerable test app for Phoenix repository coverage tests. Do not deploy.
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();

// Reflected XSS: user input written straight into the HTML response.
app.get('/hello', (req, res) => {
  res.send('<h1>Hello ' + req.query.name + '</h1>');
});

// Command injection: user input passed to a shell.
app.get('/ping', (req, res) => {
  exec('ping -c 1 ' + req.query.host, (err, out) => res.send(out));
});

// Path traversal: user input used as a file path.
app.get('/file', (req, res) => {
  fs.readFile(path.join(__dirname, req.query.name), 'utf8', (err, data) => res.send(data));
});

app.listen(3000);
