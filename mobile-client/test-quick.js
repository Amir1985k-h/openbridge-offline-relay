cat > App.js << 'EOF'
const { ethers } = require("ethers");

console.log("🚀 OpenBridge Offline Signer - تست نهایی\n");

async function runTest() {
    try {
        const privateKey = "0xb1319cbc81f2c10ed272a6cefe5a823a22a7b9d0b24519be4deb60f9844e2daf";
        const to = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

        const wallet = new ethers.Wallet(privateKey);
        console.log(`🔐 Signing for address: ${wallet.address}`);

        const tx = {
            to: to,
            value: ethers.parseEther("0.0001"),
            gasLimit: 21000,
            chainId: 1
        };

        const signedTx = await wallet.signTransaction(tx);
        console.log("✅ Transaction signed successfully (Offline)");

        // تقسیم به پیامک
        const cleanTx = signedTx.startsWith("0x") ? signedTx.slice(2) : signedTx;
        const chunks = [];
        for (let i = 0; i < cleanTx.length; i += 110) {
            chunks.push(cleanTx.slice(i, i + 110));
        }

        const txId = Date.now().toString(36).toUpperCase().slice(-6);
        const messages = chunks.map((chunk, i) => 
            `OB:${txId}:${chunks.length}:${i+1}:${chunk}`
        );

        console.log(`\n✅ موفقیت کامل! تعداد پیامک: ${messages.length}\n`);
        messages.forEach((msg, i) => {
            console.log(`[${i+1}/${messages.length}] ${msg}\n`);
        });

    } catch (error) {
        console.error("❌ خطا:", error.message);
    }
}

runTest();
EOF
