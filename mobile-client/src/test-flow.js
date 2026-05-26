// mobile-client/src/test-flow.js
const SecurityWarningScreen = require('./components/SecurityWarning');
const HomeScreen = require('./screens/HomeScreen');
const { encodeTransactionForSMS } = require('./crypto/payload-encoder');

/**
 * تست کامل: امضا → Encode → آماده‌سازی SMS
 */
async function runFullTest(privateKey, toAddress, amount) {
    console.log("\n🚀 === OpenBridge Full Flow Test ===\n");

    SecurityWarningScreen().showSecurityWarning();

    console.log("📤 مرحله ۱: امضای تراکنش آفلاین...");
    
    const signResult = await require('./screens/SignTransactionScreen').handleSignAndPrepare(
        privateKey, toAddress, amount
    );

    if (!signResult || !signResult.success) {
        console.error("❌ Signing failed:", signResult?.error);
        return;
    }

    console.log("✅ امضا با موفقیت انجام شد");
    console.log("📨 مرحله ۲: تبدیل به payload SMS...");

    const payloadResult = encodeTransactionForSMS(signResult.signedResult.signedRawTx);

    if (payloadResult.success) {
        console.log("\n🎉 تست کامل با موفقیت انجام شد!");
        console.log(`🔑 TxID: ${payloadResult.txId}`);
        console.log(`📱 تعداد پیامک: ${payloadResult.totalParts}`);
        console.log("\n💡 حالا پیامک‌های زیر را یکی یکی به شماره Gateway ارسال کن:");
        
        payloadResult.messages.forEach((msg, i) => {
            console.log(`[${i+1}/${payloadResult.totalParts}] ${msg}`);
        });
    } else {
        console.error("❌ Payload encoding failed");
    }
}

module.exports = { runFullTest };
