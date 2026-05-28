// App.js - تست کامل و مستقل
const { ethers } = require("ethers");

console.log("🚀 OpenBridge Offline Signer - تست نهایی\n");

// === تابع امضا ===
async function signTransactionOffline(privateKey, txParams) {
    const wallet = new ethers.Wallet(privateKey);
    console.log(`🔐 Signing for: ${wallet.address}`);

    const tx = {
        to: txParams.to,
        value: ethers.parseEther(txParams.amountInEther.toString()),
        gasLimit: 21000,
        chainId: 1,
        data: "0x"
    };

    const signedTx = await wallet.signTransaction(tx);
    console.log("✅ امضا موفق (Offline)");

    return signedTx;
}

// === تابع تقسیم پیامک ===
function splitTransactionForSMS(rawTx) {
    const cleanTx = rawTx.startsWith("0x") ? rawTx.slice(2) : rawTx;
    const maxChunk = 110;
    const chunks = [];
    
    for (let i = 0; i < cleanTx.length; i += maxChunk) {
        chunks.push(cleanTx.slice(i, i + maxChunk));
    }

    const total = chunks.length;
    const txId = Date.now().toString(36).slice(-6).toUpperCase();

    return chunks.map((chunk, i) => 
        `OB:${txId}:${total}:${i+1}:${chunk}`
    );
}

// === تست اصلی ===
async function runTest() {
    const privateKey = "0xb1319cbc81f2c10ed272a6cefe5a823a22a7b9d0b24519be4deb60f9844e2daf";
    const to = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

    const signedTx = await signTransactionOffline(privateKey, {
        to: to,
        amountInEther: "0.0001"
    });

    const messages = splitTransactionForSMS(signedTx);

    console.log(`\n✅ موفقیت کامل! تعداد پیامک: ${messages.length}\n`);

    messages.forEach((msg, i) => {
        console.log(`[${i+1}/${messages.length}] ${msg}\n`);
    });
}

runTest().catch(e => console.error("خطا:", e.message));
