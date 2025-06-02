const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { name, email } = req.body || {};

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name is required' });
  }

  const entry = {
    name: name.trim(),
    email: (email || '').trim(),
    timestamp: new Date().toISOString(),
  };

  const filePath = path.join(process.cwd(), 'entries.json');

  let entries = [];
  if (fs.existsSync(filePath)) {
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      if (fileData) {
        entries = JSON.parse(fileData);
      }
    } catch (err) {
      console.error('Error reading entries.json', err);
    }
  }

  entries.push(entry);

  try {
    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2));
  } catch (err) {
    console.error('Error writing entries.json', err);
    return res.status(500).json({ error: 'Failed to save entry' });
  }

  return res.status(204).end();
};
