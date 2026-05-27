// src/sms/payload-splitter.js

/**
 * تقسیم تراکنش خام به قطعات مناسب برای SMS
 * @param {string} rawTx - تراکنش امضا شده (با 0x)
 * @param {number} maxChunkSize - حداکثر کاراکتر در هر پیام (پیش‌فرض 110 برای حاشیه امن)
 */
function splitTransactionForSMS(rawTx, maxChunkSize = 110) {
    try {
        const cleanTx = rawTx.startsWith("0x") ? rawTx.slice(2) : rawTx;
        if (!cleanTx || cleanTx.length === 0) {
            throw new Error("تراکنش خالی است");
        }

        const chunks = [];
        const totalLength = cleanTx.length;

        for (let i = 0; i < totalLength; i += maxChunkSize) {
            chunks.push(cleanTx.slice(i, i + maxChunkSize));
        }

        const totalChunks = chunks.length;
        
        // تولید TxID امن‌تر (ترکیب timestamp + random)
        const timestamp = Date.now().toString(36).slice(-4);
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        const uniqueTxId = `${timestamp}${randomPart}`;

        // فرمت: OB:TxID:TotalParts:CurrentPart:Data
        return chunks.map((chunk, index) => {
            const chunkIndex = index + 1;
            return `OB:${uniqueTxId}:${totalChunks}:${chunkIndex}:${chunk}`;
        });

    } catch (error) {
        console.error("❌ Split failed:", error.message);
        throw error;
    }
}

/**
 * بازسازی تراکنش از پیامک‌های دریافتی
 */
function assembleSMSPayload(receivedSMSList) {
    if (!Array.isArray(receivedSMSList) || receivedSMSList.length === 0) {
        throw new Error("لیست پیامک خالی است");
    }

    // مرتب‌سازی بر اساس شماره قطعه + چک کردن TxID یکسان
    const firstMsg = receivedSMSList[0].split(':');
    const expectedTxId = firstMsg[1];
    const expectedTotal = parseInt(firstMsg[2]);

    const sortedChunks = receivedSMSList.sort((a, b) => {
        const idxA = parseInt(a.split(":")[3]);
        const idxB = parseInt(b.split(":")[3]);
        return idxA - idxB;
    });

    // اعتبارسنجی
    if (sortedChunks.length !== expectedTotal) {
        throw new Error(`تعداد قطعات ناقص است. انتظار ${expectedTotal} قطعه، دریافت ${sortedChunks.length} قطعه`);
    }

    const rawHexPayload = sortedChunks.map(sms => {
        const parts = sms.split(":");
        if (parts[1] !== expectedTxId) {
            throw new Error("تراکنش‌های مختلف با هم قاطی شده‌اند");
        }
        return parts[4];
    }).join("");

    return `0x${rawHexPayload}`;
}

module.exports = { 
    splitTransactionForSMS, 
    assembleSMSPayload 
};
