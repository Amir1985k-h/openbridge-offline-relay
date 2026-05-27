// App.js - نسخه خیلی ساده
const { signTransactionOffline } = require('./src/crypto/offline-signer');
const { encodeTransactionForSMS } = require('./src/crypto/payload-encoder');

async function test() {
    console.log("🚀 تست ساده شروع شد...\n");

    const testData = {
        privateKey: "0xb1319cbc81f2c10ed272a6cefe5a823a22a7b9d0b24519be4deb60f9844e2daf",
        to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        amountInEther: "0.0001"
    };

    const signResult = await signTransactionOffline(testData.privateKey, {
        to: testData.to,
        amountInEther: testData.amountInEther,
        chainId: 1,
        gasLimit: 21000
    });

    if (signResult.success) {
        const payload = encodeTransactionForSMS(signResult.signedRawTx);
        console.log("✅ تست موفق بود!");
        console.log("تعداد پیامک:", payload.totalParts);
    } else {
        console.log("❌ خطا:", signResult.error);
    }
}

test().catch(e => console.error("خطای کلی:", e.message));
