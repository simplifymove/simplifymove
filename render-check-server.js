const express = require('express');
const app = express();

app.use(express.json());

let lastRenderStatus = 'not_checked';

app.post('/api/render-check', (req, res) => {
  lastRenderStatus = req.body.status || 'unknown';
  console.log(`[RENDER CHECK] ${new Date().toISOString()}: ${lastRenderStatus}`);
  res.json({ ok: true });
});

app.get('/api/render-status', (req, res) => {
  res.json({ lastRenderStatus, timestamp: new Date().toISOString() });
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Render check server listening on port ${PORT}`);
});
