// src/screens/SignTransactionScreen.js
import { signTransactionOffline } from '../crypto/offline-signer.js';
import { encodeTransactionForSMS } from '../crypto/payload-encoder.js';
// import readline from 'readline';   // فعلاً کامنت شده چون بعداً برای تست استفاده می‌کنیم

async function startSigningFlow() {
    console.log("\n══════════════════════════════════════════════");
    console.log("   🚀 OpenBridge Offline Relay - امضای آفلاین");
    console.log("══════════════════════════════════════════════\n");

    try {
        // اینجا بعداً ورودی از UI موبایل میاد
        const privateKey = "0x...";     // ← بعداً از کاربر می‌گیریم
        const toAddress = "0x...";
        const amount = "0.001";

        console.log("⏳ در حال امضا و آماده‌سازی...");

        const signResult = await signTransactionOffline(privateKey, {
            to: toAddress,
            amountInEther: amount,
            chainId: 1,
            gasLimit: 21000,
            // maxFeePerGas: 25,
            // maxPriorityFeePerGas: 2,
        });

        if (!signResult.success) {
            console.error("❌ Signing failed:", signResult.error);
            return;
        }

        const payload = encodeTransactionForSMS(signResult.signedRawTx);

        if (!payload.success) {
            console.error("❌ Encoding failed:", payload.error);
            return;
        }

        console.log("\n✅ امضا و آماده‌سازی با موفقیت انجام شد!\n");
        console.log(`از: ${signResult.from}`);
        console.log(`به: ${signResult.to}`);
        console.log(`مقدار: ${signResult.value} ETH`);
        console.log(`تعداد پیامک: ${payload.totalParts}\n`);

        console.log("📋 پیامک‌های آماده ارسال:\n");
        
        payload.messages.forEach((msg, i) => {
            console.log(`[${i+1}/${payload.totalParts}] ${msg}`);
            console.log("   ↑↑↑ کپی کن و از طریق SMS بفرست ↑↑↑\n");
        });

        console.log("💡 نکته: هر پیامک را جداگانه به شماره Gateway ارسال کنید.");

    } catch (error) {
        console.error("❌ خطای غیرمنتظره:", error.message);
    }
}

// برای تست مستقیم
// startSigningFlow();

export { startSigningFlow };
