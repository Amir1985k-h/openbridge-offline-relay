// mobile-client/src/screens/SignTransactionScreen.js
const { signTransactionOffline } = require('../crypto/offline-signer');
const { encodeTransactionForSMS } = require('../crypto/payload-encoder');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function startSigningUI() {
    console.log("\n🔐 OpenBridge - صفحه امضای تراکنش\n");

    rl.question('کلید خصوصی (0x...): ', async (privateKey) => {
        rl.question('آدرس مقصد (0x...): ', async (toAddress) => {
            rl.question('مقدار (مثلاً 0.001): ', async (amount) => {

                console.log("\n⏳ در حال امضا...");

                const result = await signTransactionOffline(privateKey.trim(), {
                    to: toAddress.trim(),
                    amountInEther: amount.trim(),
                    chainId: 1,
                    gasLimit: 21000
                });

                if (result.success) {
                    const payload = encodeTransactionForSMS(result.signedRawTx);
                    
                    console.log("\n✅ امضا موفق بود!");
                    console.log(`📍 از آدرس: ${result.from}`);
                    console.log(`📱 تعداد پیامک: ${payload.totalParts}\n`);

                    payload.messages.forEach((msg, i) => {
                        console.log(`[${i+1}/${payload.totalParts}] ${msg}`);
                    });
                } else {
                    console.log("❌ خطا:", result.error);
                }

                rl.close();
            });
        });
    });
}

module.exports = { startSigningUI };
