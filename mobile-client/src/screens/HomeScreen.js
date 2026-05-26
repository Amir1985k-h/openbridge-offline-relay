// mobile-client/src/screens/HomeScreen.js
const SignTransactionScreen = require('./SignTransactionScreen');

/**
 * صفحه اصلی اپلیکیشن OpenBridge
 */
const HomeScreen = () => {
    console.log("🏠 OpenBridge Home Screen Loaded");

    // مثال تست سریع (بعداً با UI واقعی جایگزین می‌کنیم)
    async function runTestExample() {
        console.log("🔬 Running test transaction...");

        // ⚠️ هرگز کلید واقعی رو اینجا هاردکد نکن! فقط برای تست
        const testPrivateKey = "0xYOUR_TEST_PRIVATE_KEY_HERE"; // بعداً از کاربر می‌گیریم
        const testToAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
        const testAmount = "0.001";

        const result = await SignTransactionScreen.handleSignAndPrepare(
            testPrivateKey, 
            testToAddress, 
            testAmount
        );

        if (result.success) {
            console.log("🎉 Success! Payload ready for SMS:");
            console.log("TxID:", result.payloadResult.txId);
            console.log("SMS Parts:", result.payloadResult.totalParts);
            console.log("Copy the chunks and send via SMS to gateway");
        } else {
            console.error("❌ Failed:", result.error);
        }
    }

    // برای تست: runTestExample();

    return {
        runTestExample,
        message: "Welcome to OpenBridge - Offline Web3 Survival"
    };
};

module.exports = HomeScreen;
