const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxosRnrDKFaFGjUejc5EEur6DhWpjb6tHrH-GTwKZ-TN-_gKticZCULv3tXrMShCSsM/exec';

app.get('/log', async (req, res) => {
  try {
    // Forward all query params from the modem to Google
    const params = new URLSearchParams(req.query).toString();
    const targetURL = `${GOOGLE_SCRIPT_URL}?${params}`;

    console.log(`Forwarding to: ${targetURL}`);

    const response = await fetch(targetURL, {
      method: 'GET',
      redirect: 'follow',   // Node follows the redirect chain natively
    });

    const text = await response.text();
    console.log(`Google response: ${response.status} — ${text}`);

    res.status(200).send('OK');
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(500).send('ERROR');
  }
});

app.get('/ping', (req, res) => res.send('proxy alive'));

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));