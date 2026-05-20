const express = require('express');
const bodyParser = require('body-parser');
const { broadcastOfflineTransaction } = require('./web3-broadcaster');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// تنظیمات متغیرهای محیطی سرور (آدرس گره اتریوم و پورت سرور)
const RPC_URL = process.env.RPC_URL || "https://cloudflare-eth.com"; 
const PORT = process.env.PORT || 3000;

/**
 * وب‌هوک اصلی برای دریافت پیامک‌های حاوی تراکنش آفلاین
 * این ادرس پس از بالا آمدن سرور، به پنل پیامکی متصل می‌شود
 */
app.post('/api/v1/sms-relay', async (req, res) => {
    // استخراج متن پیامک و شماره فرستنده (سازگار با اکثر وب‌هوک‌های بین‌المللی و محلی)
    const incomingText = req.body.Body || req.body.message || req.body.text;
    const sender = req.body.From || req.body.sender;

    console.log(`📩 New SMS received from ${sender}`);

    // اعتبارسنجی اولیه: آیا متن پیامک شبیه به یک تراکنش خام هگز (Hex) هست یا نه؟
    // تراکنش‌های خام اتریوم معمولاً با 0x شروع می‌شوند و حاوی کاراکترهای هگز هستند
    const hexPattern = /^0x[a-fA-F0-9]+$/;
    const cleanPayload = incomingText ? incomingText.trim() : "";

    if (!hexPattern.test(cleanPayload)) {
        console.error("❌ Invalid transaction format received via SMS.");
        return res.status(400).send("Invalid Hex Payload");
    }

    console.log("🔗 Valid transaction payload detected. Broadcasting to Web3...");

    // ارسال تراکنش به ماژول پخش‌کننده شبکه
    const result = await broadcastOfflineTransaction(cleanPayload, RPC_URL);

    if (result.success) {
        return res.status(200).send(`Success: Tx Broadcasted. Hash: ${result.hash}`);
    } else {
        return res.status(500).send(`Error: ${result.error}`);
    }
});

app.listen(PORT, () => {
    console.log(`📡 OpenBridge Offline Relay Server is running on port ${PORT}`);
});
