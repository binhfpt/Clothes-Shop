// server.mjs
import { createSecureServer } from 'node:http2';
import { request as httpRequest } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const key = fs.readFileSync(path.join(__dirname, 'localhost-privkey.pem'));
const cert = fs.readFileSync(path.join(__dirname, 'localhost-cert.pem'));

// HTTP/2 forbidden headers (connection-specific)
const HTTP2_FORBIDDEN_HEADERS = new Set([
    'connection',
    'keep-alive',
    'transfer-encoding',
    'upgrade',
    'proxy-connection',
    'host', // sẽ được thay bằng :authority
]);

function filterHeaders(headers, forHttp2 = false) {
    const filtered = {};

    for (const [key, value] of Object.entries(headers)) {
        const lowerKey = key.toLowerCase();

        // Bỏ qua pseudo-headers
        if (lowerKey.startsWith(':')) continue;

        // Bỏ qua forbidden headers nếu đang gửi cho HTTP/2
        if (forHttp2 && HTTP2_FORBIDDEN_HEADERS.has(lowerKey)) continue;

        filtered[key] = value;
    }

    return filtered;
}

const server = createSecureServer({
    key,
    cert,
    allowHTTP1: true
}, (req, res) => {
    // Extract từ HTTP/2 pseudo-headers hoặc HTTP/1.1
    const method = req.headers[':method'] || req.method;
    const path = req.headers[':path'] || req.url;

    // Lọc headers cho backend (HTTP/1.1 - giữ tất cả headers hợp lệ)
    const backendHeaders = filterHeaders(req.headers, false);

    // Proxy request tới backend
    const proxyReq = httpRequest({
        hostname: '127.0.0.1',
        port: 3000,
        method: method,
        path: path,
        headers: backendHeaders,
    }, (proxyRes) => {
        // Lọc response headers trước khi gửi lại client
        const isHttp2 = req.httpVersion === '2.0';
        const responseHeaders = filterHeaders(proxyRes.headers, isHttp2);

        // Gửi response
        try {
            res.writeHead(proxyRes.statusCode, responseHeaders);
            proxyRes.pipe(res);
        } catch (err) {
            console.error('Response error:', err.message);
            res.writeHead(502);
            res.end('Bad Gateway');
        }
    });

    proxyReq.on('error', (err) => {
        console.error('Proxy error:', err.message);
        if (!res.headersSent) {
            res.writeHead(502);
        }
        res.end('Bad Gateway');
    });

    // Forward request body
    req.pipe(proxyReq);
});

// WebSocket upgrade cho HMR (chỉ HTTP/1.1)
server.on('upgrade', (req, socket, head) => {
    console.log('WebSocket upgrade:', req.url);

    const headers = filterHeaders(req.headers, false);

    const proxyReq = httpRequest({
        hostname: '127.0.0.1',
        port: 3000,
        method: req.method,
        path: req.url,
        headers: headers,
    });

    proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
        socket.write('HTTP/1.1 101 Switching Protocols\r\n');

        const responseHeaders = filterHeaders(proxyRes.headers, false);
        for (const [key, value] of Object.entries(responseHeaders)) {
            socket.write(`${key}: ${value}\r\n`);
        }
        socket.write('\r\n');
        socket.write(proxyHead);

        proxySocket.pipe(socket);
        socket.pipe(proxySocket);
    });

    proxyReq.on('error', (err) => {
        console.error('WS error:', err.message);
        socket.end();
    });

    proxyReq.end();
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

server.listen(8443, 'localhost', () => {
    console.log('🔒 HTTPS/HTTP2 proxy at https://localhost:8443');
    console.log('   → Proxying to http://127.0.0.1:3000');
    console.log('   → HTTP/2 and HTTP/1.1 supported');
});