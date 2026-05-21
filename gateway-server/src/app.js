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

// در حال حافظه (برای محیط production بعداً Redis استفاده کن)
const messageBuffer = new Map(); // key: TXID → array of parts

app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, error: "Too many requests" }
});
app.use('/api/', limiter);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ====================== MAIN SMS RELAY ENDPOINT ======================
app.post('/api/sms-relay', async (req, res) => {
    try {
        const { from, message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ success: false, error: "Invalid message payload" });
        }

        console.log(`📨 SMS received from ${from} | Length: ${message.length}`);

        // تشخیص پیام تک‌قسمتی یا چندقسمتی
        if (!message.startsWith('OB:')) {
            // پیام تک‌قسمتی (برای تست)
            const result = await broadcastOfflineTransaction(message.trim());
            return res.json(result.success ? 
                { success: true, txHash: result.hash, message: "Single part transaction broadcasted" } :
                { success: false, error: result.error }
            );
        }

        // پردازش Multi-part
        const parts = message.split(':');
        if (parts.length < 5) {
            return res.status(400).json({ success: false, error: "Invalid OB payload format" });
        }

        const [, txId, totalParts, currentIndex, dataHex] = parts;
        const total = parseInt(totalParts);
        const index = parseInt(currentIndex);

        if (!txId || isNaN(total) || isNaN(index) || !dataHex) {
            return res.status(400).json({ success: false, error: "Invalid payload data" });
        }

        // ذخیره در بافر
        if (!messageBuffer.has(txId)) {
            messageBuffer.set(txId, new Array(total).fill(null));
        }

        const buffer = messageBuffer.get(txId);
        buffer[index - 1] = dataHex;   // index از 1 شروع میشه

        // چک کنیم همه قسمت‌ها اومده؟
        const completed = buffer.every(part => part !== null);

        if (completed) {
            const fullPayload = buffer.join('');
            console.log(`✅ Complete transaction received! TXID: ${txId} | Total parts: ${total}`);

            const result = await broadcastOfflineTransaction('0x' + fullPayload);

            // پاک کردن از حافظه
            messageBuffer.delete(txId);

            return res.json({
                success: result.success,
                txHash: result.hash || null,
                message: result.success ? "Transaction successfully broadcasted" : result.error,
                txId: txId
            });
        } else {
            const received = buffer.filter(p => p !== null).length;
            return res.json({
                success: true,
                message: `Part ${index}/${total} received. Waiting for remaining parts...`,
                received: received,
                total: total,
                txId: txId
            });
        }

    } catch (error) {
        console.error("Critical error:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});

// Cleanup old incomplete messages (هر ۳۰ دقیقه)
setInterval(() => {
    const now = Date.now();
    for (const [txId, buffer] of messageBuffer.entries()) {
        // اگر بیشتر از ۳۰ دقیقه گذشته باشه پاک کن
        if (now - (buffer.timestamp || 0) > 30 * 60 * 1000) {
            messageBuffer.delete(txId);
        }
    }
}, 30 * 60 * 1000);

app.listen(PORT, () => {
    console.log(`🚀 OpenBridge Relay Server running on port ${PORT}`);
    console.log(`📡 SMS Relay: http://localhost:${PORT}/api/sms-relay`);
});
