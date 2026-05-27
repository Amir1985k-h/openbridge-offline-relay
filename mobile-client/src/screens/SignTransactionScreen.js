// src/screens/SignTransactionScreen.js
import { signTransactionOffline } from '../crypto/offline-signer.js';
import { encodeTransactionForSMS } from '../crypto/payload-encoder.js';

async function startSigningFlow() {
    console.log("\n══════════════════════════════════════════════");
    console.log("   🚀 OpenBridge Offline Relay - امضای آفلاین");
    console.log("══════════════════════════════════════════════\n");

    // === داده‌های تست ===
    const testData = {
        privateKey: "0xb1319cbc81f2c10ed272a6cefe5a823a22a7b9d0b24519be4deb60f9844e2daf",
        to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", 
        amountInEther: "0.0001"
    };

    console.log("⏳ در حال امضا و آماده‌سازی تراکنش...");

    const signResult = await signTransactionOffline(testData.privateKey, {
        to: testData.to,
        amountInEther: testData.amountInEther,
        chainId: 1,           // Mainnet - برای تست بهتر Sepolia (11155111) استفاده کن
        gasLimit: 21000
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

    console.log("\n✅ ✅ موفقیت کامل! ✅ ✅\n");
    console.log(`از: ${signResult.from}`);
    console.log(`به: ${signResult.to}`);
    console.log(`مقدار: ${signResult.value} ETH`);
    console.log(`TxID: ${payload.txId}`);
    console.log(`تعداد پیامک: ${payload.totalParts}\n`);

    console.log("📱 پیامک‌های آماده ارسال:\n");
    
    payload.messages.forEach((msg, i) => {
        console.log(`[${i+1}/${payload.totalParts}] ${msg}`);
        console.log("   ↑↑↑ کپی کن و از طریق SMS بفرست ↑↑↑\n");
    });

    console.log("💡 هر پیامک را جداگانه به شماره Gateway ارسال کنید.");
}

export { startSigningFlow };
