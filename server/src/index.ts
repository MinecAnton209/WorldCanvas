import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const serverStartTime = new Date();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/api/health', (_req, res) => {
    res.send({ status: 'ok' });
});

app.get('/api/status', (_req, res) => {
    res.json({
        startTime: serverStartTime.toISOString(),
    });
});

io.on('connection', (socket) => {
    console.log(`[Socket.IO] User connected: ${socket.id}`);
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`> Server is running on http://localhost:${PORT}`);
});