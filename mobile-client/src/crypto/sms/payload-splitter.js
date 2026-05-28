// src/sms/payload-splitter.js

/**
 * تقسیم تراکنش به قطعات SMS
 */
function splitTransactionForSMS(rawTx, maxChunkSize = 110) {
    try {
        const cleanTx = rawTx.startsWith("0x") ? rawTx.slice(2) : rawTx;
        if (!cleanTx) throw new Error("تراکنش خالی است");

        const chunks = [];
        for (let i = 0; i < cleanTx.length; i += maxChunkSize) {
            chunks.push(cleanTx.slice(i, i + maxChunkSize));
        }

        const totalChunks = chunks.length;
        const timestamp = Date.now().toString(36).slice(-4);
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        const uniqueTxId = `${timestamp}${randomPart}`;

        return chunks.map((chunk, index) => {
            const chunkIndex = index + 1;
            return `OB:${uniqueTxId}:${totalChunks}:${chunkIndex}:${chunk}`;
        });

    } catch (error) {
        console.error("❌ Split failed:", error.message);
        throw error;
    }
}

module.exports = { splitTransactionForSMS };
