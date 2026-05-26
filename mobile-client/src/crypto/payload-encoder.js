// mobile-client/src/crypto/payload-encoder.js
const { splitTransactionForSMS, assembleSMSPayload } = require('./sms/payload-splitter');

/**
 * آماده‌سازی کامل تراکنش برای ارسال از طریق SMS
 */
function encodeTransactionForSMS(signedRawTx) {
    try {
        if (!signedRawTx || !signedRawTx.startsWith('0x')) {
            throw new Error("Invalid signed transaction");
        }

        const smsMessages = splitTransactionForSMS(signedRawTx, 120);

        const txId = smsMessages[0].split(':')[1]; // گرفتن TxID از اولین پیام

        console.log(`✅ Payload encoded successfully!`);
        console.log(`TxID: ${txId}`);
        console.log(`Total SMS parts: ${smsMessages.length}`);

        return {
            success: true,
            txId: txId,
            totalParts: smsMessages.length,
            messages: smsMessages,           // آرایه پیام‌های آماده ارسال
            rawTx: signedRawTx,
            message: `تراکنش به ${smsMessages.length} پیامک تقسیم شد`
        };

    } catch (error) {
        console.error("Encoding failed:", error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * بازسازی تراکنش کامل از پیامک‌های دریافتی (برای تست سرور)
 */
function decodeSMSPayload(receivedSMSList) {
    return assembleSMSPayload(receivedSMSList);
}

module.exports = { 
    encodeTransactionForSMS,
    decodeSMSPayload 
};
