// src/screens/SignTransactionScreen.js
const { signTransactionOffline } = require('../crypto/offline-signer');
const { encodeTransactionForSMS } = require('../crypto/payload-encoder');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function startSigningUI() {
    console.log("\n════════════════════════════════════");
    console.log("   OpenBridge - امضای آفلاین تراکنش");
    console.log("════════════════════════════════════\n");

    rl.question('🔑 کلید خصوصی (0x...): ', async (privateKey) => {
        rl.question('📍 آدرس مقصد (0x...): ', async (toAddress) => {
            rl.question('💰 مقدار (ETH): ', async (amount) => {

                console.log("\n⏳ در حال امضا و آماده‌سازی...");

                const signResult = await signTransactionOffline(privateKey.trim(), {
                    to: toAddress.trim(),
                    amountInEther: amount.trim(),
                    chainId: 1,
                    gasLimit: 21000
                });

                if (signResult.success) {
                    const payload = encodeTransactionForSMS(signResult.signedRawTx);
                    
                    console.log("\n✅ امضا با موفقیت انجام شد!");
                    console.log(`از: ${signResult.from}`);
                    console.log(`تعداد پیامک: ${payload.totalParts}\n`);

                    console.log("📋 پیامک‌های آماده ارسال:\n");
                    
                    payload.messages.forEach((msg, i) => {
                        console.log(`[${i+1}/${payload.totalParts}] ${msg}`);
                        console.log("   ↑ کپی کن ↑\n");
                    });

                    console.log("💡 هر پیامک را جداگانه از طریق SMS به شماره Gateway بفرست.");
                } else {
                    console.log("❌ خطا:", signResult.error);
                }

                rl.close();
            });
        });
    });
}

module.exports = { startSigningUI };
