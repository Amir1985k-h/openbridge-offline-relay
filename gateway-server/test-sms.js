// gateway-server/test-sms.js
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// تست پیام تک قسمتی (برای تراکنش‌های خیلی کوچک)
async function testSinglePart() {
    console.log("🧪 Testing Single Part SMS...");
    
    const payload = {
        from: "+989123456789",
        message: "0x1234567890abcdef1234567890abcdef1234567890abcdef" // یک payload آزمایشی
    };

    try {
        const res = await axios.post(`${BASE_URL}/api/sms-relay`, payload);
        console.log("✅ Single Part Response:", res.data);
    } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
    }
}

// تست Multi-part (۳ قسمت)
async function testMultiPart() {
    console.log("\n🧪 Testing Multi-Part SMS...");

    const txId = "test123456";
    const fullHex = "0xabcdef1234567890abcdef1234567890abcdef1234567890"; // payload آزمایشی
    const parts = [];

    // تقسیم به ۳ قسمت
    const partSize = Math.ceil(fullHex.length / 3);
    for (let i = 0; i < 3; i++) {
        const start = i * partSize;
        const partData = fullHex.slice(start, start + partSize);
        
        const message = `OB:${txId}:3:${i+1}:${partData.replace('0x', '')}`;
        
        parts.push({
            from: "+989123456789",
            message: message
        });
    }

    for (let i = 0; i < parts.length; i++) {
        console.log(`Sending part ${i+1}/3 ...`);
        try {
            const res = await axios.post(`${BASE_URL}/api/sms-relay`, parts[i]);
            console.log(`Part ${i+1} Response:`, res.data);
        } catch (error) {
            console.error(`Error in part ${i+1}:`, error.response?.data || error.message);
        }
        
        // کمی delay بین ارسال قسمت‌ها
        await new Promise(r => setTimeout(r, 800));
    }
}

// اجرای تست‌ها
async function runTests() {
    await testSinglePart();
    await testMultiPart();
}

runTests();
