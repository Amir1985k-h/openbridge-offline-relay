// mobile-client/src/test-flow.js
const SecurityWarningScreen = require('./components/SecurityWarning');
const { signTransactionOffline } = require('./crypto/offline-signer');
const { encodeTransactionForSMS } = require('./crypto/payload-encoder');

async function runOfflineTest() {
    console.log("\n🚀 === OpenBridge Offline Full Test ===\n");

    SecurityWarningScreen().showSecurityWarning();

    // ================== والت تست (تغییر بده) ==================
    const privateKey = "0x" + "b1319cbc81f2c10ed272a6cefe5a823a22a7b9d0b24519be4deb60f9844e2daf"; 
    const toAddress   = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; 
    const amount      = "0.0001";     // مقدار خیلی کم برای تست

    console.log("📍 تست ارسال به آدرس:", toAddress);
    console.log("💰 مقدار:", amount, "ETH\n");

    try {
        const signResult = await signTransactionOffline(privateKey, {
            to: toAddress,
            amountInEther: amount,
            chainId: 1,
            gasLimit: 21000
        });

        if (!signResult.success) throw new Error(signResult.error);

        console.log("✅ امضا موفق — From:", signResult.from);

        const payloadResult = encodeTransactionForSMS(signResult.signedRawTx);

        if (payloadResult.success) {
            console.log("\n🎉 تست کامل با موفقیت انجام شد!\n");
            console.log(`🆔 TxID: ${payloadResult.txId}`);
            console.log(`📱 تعداد پیامک: ${payloadResult.totalParts}\n`);

            payloadResult.messages.forEach((msg, i) => {
                console.log(`[${i+1}/${payloadResult.totalParts}] ${msg}`);
            });
        }

    } catch (error) {
        console.error("❌ خطا:", error.message);
    }
}

// اجرای تست
runOfflineTest();
