import 'dotenv/config.js'; // #Mikael: loads .env into process.env
import http from 'http';
import si from 'search-insights';
import fs from 'fs';
import path from 'path';

// Dev only - const PORT = 3001; // #Mikael: 3000 already taken by Parcel.
const PORT = process.env.PORT || 3000;
const distPath = path.resolve('./dist');

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_SEARCH_KEY = process.env.ALGOLIA_API_KEY;
const ALGOLIA_INDEX = process.env.ALGOLIA_INDEX;

// #Mikael: initialisation du client Insights
si('init', {
  appId: ALGOLIA_APP_ID,
  apiKey: ALGOLIA_SEARCH_KEY,
});

const server = http.createServer((req, res) => {
  // #Mikael: Parcel having its own origin (e.g. localhost:3000), it is required to allow cross origin so that Parcel origin (e.g. localhost:3000) can send requests to this server (e.g. localhost:3001).
//  no longer required.
//  res.setHeader('Access-Control-Allow-Origin', '*'); // #Mikael: restrict to exact front URL in production code.
//  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
//  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//
//  if (req.method === 'OPTIONS') { // #Mikael: preflight CORS.
//    res.writeHead(204);
//    res.end();
//    return;
//  }

  function getContentType(filePath) {
    if (filePath.endsWith('.html')) return 'text/html';
    if (filePath.endsWith('.js')) return 'application/javascript';
    if (filePath.endsWith('.css')) return 'text/css';
    if (filePath.endsWith('.json')) return 'application/json';
    if (filePath.endsWith('.png')) return 'image/png';
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg';
    if (filePath.endsWith('.svg')) return 'image/svg+xml';
    return 'text/plain';
  }

  if (req.method === 'GET') {
    let filePath = path.join(
      distPath,
      req.url === '/' ? 'index.html' : req.url
    );

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      const contentType = getContentType(filePath);

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
      return;
    }

    // fallback SPA
    const indexPath = path.join(distPath, 'index.html');
    const indexContent = fs.readFileSync(indexPath);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(indexContent);
    return;
  }

  // #Mikael: clicks.
  if (req.method === 'POST' && req.url === '/click') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        console.log('Click received on Objet ID:', data.objectId, ' at position ', data.position);

        // #Mikael: send click event to Algolia.
        si('clickedObjectIDsAfterSearch', {
          eventType: 'click',
          eventName: 'Product Clicked',
          index: ALGOLIA_INDEX,
          userToken: 'user-123456',
          authenticatedUserToken: 'user-123456',
          timestamp: Date.now(),
          objectIDs: [data.objectId],
          queryID: data.queryId,
          positions: [data.position],
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));

      } catch (err) {
        console.error('Erreur JSON:', err);
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });

    return;
  }
  
  // #Mikael: conversions.
  if (req.method === 'POST' && req.url === '/conversion') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        console.log('Conversion received on Objet ID:', data.objectId);

        // #Mikael: send conversion event to Algolia.
        si('addedToCartObjectIDsAfterSearch', {
          eventType: 'conversion',
          eventName: 'Product added to cart',
          index: ALGOLIA_INDEX,
          userToken: 'user-123456',
          authenticatedUserToken: 'user-123456',
          timestamp: Date.now(),
          objectIDs: [data.objectId],
          queryID: data.queryId,
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));

      } catch (err) {
        console.error('Erreur JSON:', err);
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });

    return;
  }

  // #Mikael: unexisting route.
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});