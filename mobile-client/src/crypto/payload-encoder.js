// src/crypto/payload-encoder.js
const { splitTransactionForSMS } = require('../sms/payload-splitter');

function encodeTransactionForSMS(signedRawTx) {
    try {
        if (!signedRawTx || !signedRawTx.startsWith('0x')) {
            throw new Error("تراکنش امضا شده نامعتبر است");
        }

        const smsMessages = splitTransactionForSMS(signedRawTx);

        const firstMessage = smsMessages[0];
        const txId = firstMessage.split(':')[1];

        console.log(`✅ Payload encoded successfully!`);
        console.log(`TxID: ${txId}`);
        console.log(`Total SMS parts: ${smsMessages.length}`);

        return {
            success: true,
            txId: txId,
            totalParts: smsMessages.length,
            messages: smsMessages,
            rawTx: signedRawTx
        };
    } catch (error) {
        console.error("❌ Encoding failed:", error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { encodeTransactionForSMS };
