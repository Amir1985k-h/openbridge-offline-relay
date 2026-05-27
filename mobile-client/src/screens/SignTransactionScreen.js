// mobile-client/src/screens/SignTransactionScreen.js
const { signTransactionOffline } = require('../crypto/offline-signer');
const { encodeTransactionForSMS } = require('../crypto/payload-encoder');

async function signTransaction(privateKey, toAddress, amount) {
    console.log("\n🔐 شروع امضای تراکنش...");

    const result = await signTransactionOffline(privateKey, {
        to: toAddress,
        amountInEther: amount,
        chainId: 1,        // Ethereum
        gasLimit: 21000
    });

    if (!result.success) {
        console.error("❌ خطا در امضا:", result.error);
        return result;
    }

    const payload = encodeTransactionForSMS(result.signedRawTx);

    console.log("\n🎉 تراکنش آماده ارسال via SMS");
    console.log(`TxID: ${payload.txId} | ${payload.totalParts} پیامک`);

    payload.messages.forEach((msg, i) => {
        console.log(`[${i+1}/${payload.totalParts}] ${msg}`);
    });

    return { success: true, result, payload };
}

module.exports = { signTransaction };
