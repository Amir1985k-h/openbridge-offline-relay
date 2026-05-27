// mobile-client/src/test-flow.js
const { signTransaction } = require('./screens/SignTransactionScreen');

async function runTest() {
    console.log("\n🚀 تست صفحه امضا\n");

    const privateKey = "0xb1319cbc81f2c10ed272a6cefe5a823a22a7b9d0b24519be4deb60f9844e2daf"; // کلید تست
    const toAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
    const amount = "0.0001";

    const result = await signTransaction(privateKey, toAddress, amount);
    
    if (result.success) {
        console.log("\n✅ تست نهایی با موفقیت تمام شد!");
    }
}

runTest();
