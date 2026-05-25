// gateway-server/src/app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { broadcastOfflineTransaction } = require('./web3-broadcaster');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory buffer (بعداً Redis می‌شود)
const messageBuffer = new Map(); // txId → { parts: [], timestamp: Date, from: string }

app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['POST', 'GET']
}));
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));

// Stronger Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقیقه
    max: 50,                  // فقط ۵۰ درخواست در ۱۵ دقیقه
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Too many requests. Please slow down." }
});
app.use('/api/', limiter);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ====================== MAIN SMS RELAY ENDPOINT ======================
app.post('/api/sms-relay', async (req, res) => {
    try {
        const { from, message, secret } = req.body;

        // Basic Secret Protection (بعداً قوی‌تر می‌کنیم)
        if (secret !== process.env.SMS_RELAY_SECRET) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        if (!message || typeof message !== 'string' || message.length < 10) {
            return res.status(400).json({ success: false, error: "Invalid message payload" });
        }

        console.log(`📨 SMS received from ${from || 'unknown'} | Length: ${message.length}`);

        // Single part (برای تست)
        if (!message.startsWith('OB:')) {
            const result = await broadcastOfflineTransaction(message.trim());
            return res.json(result);
        }

        // Multi-part processing
        const parts = message.split(':');
        if (parts.length < 5) {
            return res.status(400).json({ success: false, error: "Invalid OB payload format" });
        }

        const [, txId, totalParts, currentIndex, dataHex] = parts;
        const total = parseInt(totalParts);
        const index = parseInt(currentIndex);

        if (!txId || isNaN(total) || isNaN(index) || !dataHex || dataHex.length < 10) {
            return res.status(400).json({ success: false, error: "Invalid payload data" });
        }

        // Store in buffer
        if (!messageBuffer.has(txId)) {
            messageBuffer.set(txId, { 
                parts: new Array(total).fill(null),
                timestamp: Date.now(),
                from: from 
            });
        }

        const buffer = messageBuffer.get(txId);
        buffer.parts[index - 1] = dataHex;

        const completed = buffer.parts.every(part => part !== null);

        if (completed) {
            const fullPayload = buffer.parts.join('');
            console.log(`✅ Complete transaction received! TXID: ${txId}`);

            const result = await broadcastOfflineTransaction('0x' + fullPayload);

            messageBuffer.delete(txId);

            return res.json({
                success: result.success,
                txHash: result.hash || null,
                message: result.success ? "Transaction broadcasted successfully" : result.error,
                txId: txId
            });
        } else {
            const received = buffer.parts.filter(p => p !== null).length;
            return res.json({
                success: true,
                message: `Part ${index}/${total} received (${received}/${total})`,
                txId: txId
            });
        }

    } catch (error) {
        console.error("Critical error in sms-relay:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});

// Auto cleanup old buffers
setInterval(() => {
    const now = Date.now();
    for (const [txId, data] of messageBuffer.entries()) {
        if (now - data.timestamp > 30 * 60 * 1000) { // 30 minutes
            console.log(`🧹 Cleaned up incomplete TX: ${txId}`);
            messageBuffer.delete(txId);
        }
    }
}, 10 * 60 * 1000);

app.listen(PORT, () => {
    console.log(`🚀 OpenBridge Relay Server running on port ${PORT}`);
});
