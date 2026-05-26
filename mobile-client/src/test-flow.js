// mobile-client/src/test-flow.js
const SecurityWarningScreen = require('./components/SecurityWarning');
const { signTransactionOffline } = require('./crypto/offline-signer');
const { encodeTransactionForSMS } = require('./crypto/payload-encoder');

/**
 * تست کامل بدون نیاز به سرور (همه چیز محلی)
 */
async function runOfflineTest() {
    console.log("\n🚀 === OpenBridge Offline Full Test (بدون سرور) ===\n");

    SecurityWarningScreen().showSecurityWarning();

    // ================== اطلاعات تست ==================
    const privateKey = "0xYOUR_TEST_PRIVATE_KEY_HERE";   // ←←← اینجا عوض کن (کلید تست)
    const toAddress   = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; 
    const amount      = "0.001";

    console.log("📍 آدرس مقصد:", toAddress);
    console.log("💰 مقدار:", amount, "ETH\n");

    try {
        // مرحله ۱: امضا
        console.log("🔐 در حال امضای تراکنش...");
        const signResult = await signTransactionOffline(privateKey, {
            to: toAddress,
            amountInEther: amount,
            chainId: 1,
            gasLimit: 21000
        });

        if (!signResult.success) throw new Error(signResult.error);

        console.log("✅ امضا موفق — From:", signResult.from);

        // مرحله ۲: آماده‌سازی برای SMS
        console.log("📨 در حال تبدیل به پیامک...");
        const payloadResult = encodeTransactionForSMS(signResult.signedRawTx);

        if (!payloadResult.success) throw new Error(payloadResult.error);

        // نمایش نتیجه نهایی
        console.log("\n🎉 === تست با موفقیت تمام شد! ===\n");
        console.log(`🆔 TxID: ${payloadResult.txId}`);
        console.log(`📱 تعداد پیامک: ${payloadResult.totalParts}`);
        console.log("\n📋 پیامک‌های آماده ارسال:\n");

        payloadResult.messages.forEach((msg, index) => {
            console.log(`[${index + 1}/${payloadResult.totalParts}] ${msg}`);
        });

        console.log("\n💡 این پیامک‌ها را می‌توانی بعداً به سرور gateway ارسال کنی.");

    } catch (error) {
        console.error("❌ خطا در تست:", error.message);
    }
}

module.exports = { runOfflineTest };
// در پایین فایل اضافه کن
runOfflineTest();
