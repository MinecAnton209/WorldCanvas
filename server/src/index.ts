import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { latLngToGlobalPixel } from './utils/geo';

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

    socket.on("map:click", (data) => {
        console.log(`[Socket.IO] Отримано клік від ${socket.id}:`, data);
    });

    socket.on('disconnect', () => {
        console.log(`[Socket.IO] User disconnected: ${socket.id}`);
    });

    socket.on("map:click", (data: { lat: number; lng: number }) => {
        // Конвертуємо гео-координати в піксельні координати
        const pixelCoords = latLngToGlobalPixel(data.lat, data.lng);

        console.log(
            `[Socket.IO] Клік від ${socket.id}: ` +
            `Гео { lat: ${data.lat.toFixed(4)}, lng: ${data.lng.toFixed(4)} } -> ` +
            `Піксель { x: ${pixelCoords.x}, y: ${pixelCoords.y} }`
        );

    });

});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`> Server is running on http://localhost:${PORT}`);
});