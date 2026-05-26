// mobile-client/src/test-flow.js
const SecurityWarningScreen = require('./components/SecurityWarning');
const HomeScreen = require('./screens/HomeScreen');

/**
 * تست کامل جریان: امضا → Encode → آماده برای SMS
 */
async function runFullTest() {
    console.log("🧪 شروع تست کامل OpenBridge Mobile...\n");

    // نمایش هشدار امنیتی
    SecurityWarningScreen().showSecurityWarning();

    console.log("🔑 لطفاً برای تست از یک والت تست (Testnet یا مقدار خیلی کم) استفاده کنید!\n");

    // === اطلاعات تست (بعداً از کاربر می‌گیریم) ===
    const privateKey = "0xYOUR_TEST_PRIVATE_KEY_HERE"; // ⚠️ عوض کن
    const toAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; // آدرس تست
    const amount = "0.001";

    console.log("📤 در حال امضای تراکنش...");

    const result = await HomeScreen().runTestExample 
        ? await HomeScreen().runTestExample() 
        : "runTestExample not connected yet";

    if (result && result.success) {
        console.log("\n🎉 تست با موفقیت انجام شد!");
        console.log("TxID:", result.payloadResult.txId);
        console.log("تعداد پیام‌های SMS:", result.payloadResult.totalParts);
        console.log("\nحالا می‌تونی payloadها رو کپی کنی و از طریق SMS به سرور gateway بفرستی.");
    } else {
        console.log("❌ تست ناموفق:", result ? result.error : "Unknown error");
    }
}

// برای اجرای تست:
// runFullTest();

module.exports = { runFullTest };
