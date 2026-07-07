const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const path = require('path');
const fs = require('fs');

// Serve static assets from 'dist' if it exists, otherwise serve from root
const staticDir = fs.existsSync(path.join(__dirname, 'dist')) ? path.join(__dirname, 'dist') : __dirname;
const middlewares = jsonServer.defaults({ static: staticDir });
const port = process.env.PORT || 8080;

server.use(middlewares);
server.use(router);

server.listen(port, () => {
    console.log(`MAPALAD Server running on http://localhost:${port}`);
});
