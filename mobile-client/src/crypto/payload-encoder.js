// mobile-client/src/crypto/payload-encoder.js
const { ethers } = require("ethers");
const crypto = require("crypto");

/**
 * تبدیل تراکنش امضا شده به payload مناسب برای SMS
 * @param {string} signedRawTx - تراکنش امضا شده (0x...)
 * @returns {Object} payload آماده برای ارسال
 */
function encodeTransactionForSMS(signedRawTx) {
    try {
        // حذف 0x
        let hexData = signedRawTx.startsWith('0x') ? signedRawTx.slice(2) : signedRawTx;

        // برای SMS، payload رو به قطعات کوچک تقسیم می‌کنیم (حداکثر ۱۴۰-۱۵۰ کاراکتر)
        const chunkSize = 120; // امن برای اکثر SMS
        const chunks = [];

        for (let i = 0; i < hexData.length; i += chunkSize) {
            chunks.push(hexData.slice(i, i + chunkSize));
        }

        const txId = "OB" + Date.now().toString(36).toUpperCase(); // شناسه منحصر به فرد

        return {
            success: true,
            txId: txId,
            totalParts: chunks.length,
            chunks: chunks,
            fullHex: hexData,
            estimatedSMSCount: chunks.length,
            message: `Transaction prepared for SMS (${chunks.length} parts)`
        };

    } catch (error) {
        console.error("Encoding failed:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * ترکیب دوباره قطعات دریافت شده در سرور (برای تست)
 */
function decodeMultiPartPayload(chunks) {
    return chunks.join('');
}

module.exports = { 
    encodeTransactionForSMS,
    decodeMultiPartPayload 
};
