// mobile-client/src/test-flow.js
console.log("\n🚀 === OpenBridge Offline Test ===\n");

// مستقیم require کنیم
const { signTransactionOffline } = require('./crypto/offline-signer');
const { encodeTransactionForSMS } = require('./crypto/payload-encoder');

async function runOfflineTest() {
    console.log("⚠️ هشدار امنیتی نمایش داده شد\n");

    // کلید تست (اینجا عوض کن)
    const privateKey = "0xb1319cbc81f2c10ed272a6cefe5a823a22a7b9d0b24519be4deb60f9844e2daf";
    const toAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
    const amount = "0.0001";

    try {
        console.log("🔐 در حال امضای تراکنش...");
        
        const signResult = await signTransactionOffline(privateKey, {
            to: toAddress,
            amountInEther: amount,
            chainId: 1,
            gasLimit: 21000
        });

        if (!signResult.success) {
            throw new Error(signResult.error);
        }

        console.log("✅ امضا موفق شد!");

        console.log("📨 در حال آماده‌سازی پیامک...");
        const payloadResult = encodeTransactionForSMS(signResult.signedRawTx);

        if (payloadResult.success) {
            console.log("\n🎉 موفقیت کامل!");
            console.log(`TxID: ${payloadResult.txId}`);
            console.log(`تعداد پیامک: ${payloadResult.totalParts}`);

            payloadResult.messages.forEach((msg, i) => {
                console.log(`[${i+1}] ${msg}`);
            });
        }

    } catch (error) {
        console.error("❌ خطا:", error.message);
    }
}

// اجرا
runOfflineTest();
