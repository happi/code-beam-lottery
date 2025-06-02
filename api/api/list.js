const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

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
      return res.status(500).json({ error: 'Failed to read entries' });
    }
  }

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).end(JSON.stringify(entries));
};
