// gateway-server/src/app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { broadcastOfflineTransaction } = require('./web3-broadcaster');

// ====================== تنظیمات ======================
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware های امنیتی
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: '10kb' }));        // محدود کردن حجم ورودی
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));

// Rate Limiting (خیلی مهم برای جلوگیری از حمله)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 دقیقه
    max: 100,                   // حداکثر ۱۰۰ درخواست
    message: { success: false, error: "Too many requests, please try again later." }
});
app.use('/api/', limiter);

// ====================== Route های اصلی ======================

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Webhook دریافت SMS
app.post('/api/sms-relay', async (req, res) => {
    try {
        const { from, to, message, messageId, parts, totalParts } = req.body;

        console.log(`📨 New SMS received from: ${from}`);

        // اعتبارسنجی پایه
        if (!message || message.length < 10) {
            return res.status(400).json({
                success: false,
                error: "Payload is too short or empty"
            });
        }

        // اینجا بعداً logic reassemble multi-part SMS اضافه می‌کنیم
        const rawTxPayload = message.trim();

        // پخش تراکنش
        const result = await broadcastOfflineTransaction(rawTxPayload);

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: "Transaction broadcasted successfully",
                txHash: result.hash,
                relayTime: new Date().toISOString()
            });
        } else {
            return res.status(400).json({
                success: false,
                error: result.error
            });
        }

    } catch (error) {
        console.error("❌ Critical error in /api/sms-relay:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
});

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, error: "Route not found" });
});

// ====================== شروع سرور ======================
app.listen(PORT, () => {
    console.log(`🚀 OpenBridge Gateway Server running on port ${PORT}`);
    console.log(`📡 SMS Relay endpoint: http://localhost:${PORT}/api/sms-relay`);
});
