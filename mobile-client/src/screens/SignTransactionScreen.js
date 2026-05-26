// mobile-client/src/screens/SignTransactionScreen.js
const { signTransactionOffline } = require('../crypto/offline-signer');
const { encodeTransactionForSMS } = require('../crypto/payload-encoder');

const SignTransactionScreen = () => {
    // فعلاً به صورت ساده (بعداً با React Native UI کامل می‌کنیم)
    console.log("SignTransactionScreen loaded");

    /**
     * تابع اصلی امضا و آماده‌سازی برای SMS
     */
    async function handleSignAndPrepare(privateKey, toAddress, amount) {
        try {
            const txParams = {
                to: toAddress,
                amountInEther: amount,
                chainId: 1,           // 1 = Ethereum, 137 = Polygon
                gasLimit: 21000,
            };

            // مرحله ۱: امضای آفلاین
            const signedResult = await signTransactionOffline(privateKey, txParams);

            if (!signedResult.success) {
                console.error("Signing failed:", signedResult.error);
                return signedResult;
            }

            // مرحله ۲: آماده‌سازی برای SMS
            const payloadResult = encodeTransactionForSMS(signedResult.signedRawTx);

            console.log("✅ Transaction ready for SMS!");
            console.log(`TxID: ${payloadResult.txId}`);
            console.log(`Number of SMS parts: ${payloadResult.totalParts}`);

            return {
                success: true,
                signedResult,
                payloadResult,
                instruction: "Now copy the payload(s) and send via SMS to the gateway number"
            };

        } catch (error) {
            console.error("Critical error:", error);
            return { success: false, error: error.message };
        }
    }

    // برای تست سریع
    // handleSignAndPrepare("0xYOUR_PRIVATE_KEY_HERE", "0xReceiverAddress...", "0.01");

    return {
        handleSignAndPrepare
    };
};

module.exports = SignTransactionScreen;
