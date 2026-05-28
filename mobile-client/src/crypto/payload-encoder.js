// src/crypto/payload-encoder.js
import { splitTransactionForSMS, assembleSMSPayload } from '../sms/payload-splitter.js';

/**
 * آماده‌سازی کامل تراکنش امضا شده برای ارسال از طریق SMS
 * @param {string} signedRawTx - تراکنش امضا شده (با 0x)
 */
function encodeTransactionForSMS(signedRawTx) {
    try {
        if (!signedRawTx || typeof signedRawTx !== 'string' || !signedRawTx.startsWith('0x')) {
            throw new Error("تراکنش امضا شده نامعتبر است");
        }

        // تقسیم تراکنش به پیامک‌ها
        const smsMessages = splitTransactionForSMS(signedRawTx, 120);

        if (smsMessages.length === 0) {
            throw new Error("شکست در تقسیم تراکنش به پیامک");
        }

        // استخراج TxID به صورت امن‌تر
        const firstMessage = smsMessages[0];
        const txIdMatch = firstMessage.match(/OB:(\d+)/);
        const txId = txIdMatch ? txIdMatch[1] : 'UNKNOWN';

        console.log(`✅ Payload encoded successfully!`);
        console.log(`TxID: ${txId}`);
        console.log(`Total SMS parts: ${smsMessages.length}`);

        return {
            success: true,
            txId: txId,
            totalParts: smsMessages.length,
            messages: smsMessages,           // آرایه پیام‌های آماده برای ارسال
            rawTx: signedRawTx,
            message: `تراکنش به ${smsMessages.length} پیامک تقسیم شد`
        };

    } catch (error) {
        console.error("❌ Payload encoding failed:", error.message);
        return {
            success: false,
            error: error.message,
            code: "ENCODING_ERROR"
        };
    }
}

/**
 * بازسازی تراکنش از پیامک‌های دریافتی (برای Gateway Server)
 */
function decodeSMSPayload(receivedSMSList) {
    try {
        return assembleSMSPayload(receivedSMSList);
    } catch (error) {
        console.error("❌ Payload assembly failed:", error.message);
        throw error;
    }
}

export { 
    encodeTransactionForSMS,
    decodeSMSPayload 
};
