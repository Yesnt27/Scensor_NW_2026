const WebSocket = require('ws');
const { database } = require('./config/firebase');

// WebSocket Server Configuration
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server started on port ${PORT}`);
console.log(`ESP32 should connect to: ws://YOUR_SERVER_IP:${PORT}`);

wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`New connection from: ${clientIp}`);

    let deviceId = null;

    ws.on('message', async (message) => {
        try {
            // Parse one-line JSON from ESP32
            const data = JSON.parse(message.toString());
            console.log('Received:', data);

            // Get or set deviceId (expect it in the JSON or use IP)
            deviceId = data.deviceId || clientIp;

            // Add timestamp to the data
            const dataWithTimestamp = {
                ...data,
                timestamp: Date.now(),
                receivedAt: new Date().toISOString()
            };

            // Save to Firebase
            await database.ref(`devices/${deviceId}/data`).set(dataWithTimestamp);
            await database.ref(`devices/${deviceId}/info`).update({
                lastUpdate: new Date().toISOString(),
                status: 'online'
            });

            // Send acknowledgment
            ws.send(JSON.stringify({ status: 'ok' }));

        } catch (error) {
            console.error('Error:', error);
            ws.send(JSON.stringify({ status: 'error', message: error.message }));
        }
    });

    ws.on('close', () => {
        console.log(`Connection closed: ${deviceId || clientIp}`);
        if (deviceId) {
            database.ref(`devices/${deviceId}/info`).update({
                status: 'offline'
            }).catch(err => console.error('Error:', err));
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

process.on('SIGINT', () => {
    console.log('\nShutting down...');
    wss.close(() => process.exit(0));
});

