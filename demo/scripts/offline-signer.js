// demo/scripts/offline-signer.js
const { ethers } = require("ethers");

async function main() {
    console.log("🔐 OpenBridge Offline Signer\n");

    // ⚠️ فقط برای تست - هرگز Private Key واقعی را اینجا نگذارید
    const privateKey = "0xYOUR_PRIVATE_KEY_HERE"; 
    
    const wallet = new ethers.Wallet(privateKey);
    console.log("📍 آدرس والت:", wallet.address);

    // مثال تراکنش
    const tx = {
        to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // آدرس تست
        value: ethers.parseEther("0.001"),
        gasLimit: 21000,
        gasPrice: ethers.parseUnits("2", "gwei"),
        nonce: 0,           // بعداً باید از شبکه گرفته شود
        chainId: 11155111   // Sepolia
    };

    console.log("\n🔨 در حال امضای تراکنش آفلاین...");

    const signedTx = await wallet.signTransaction(tx);
    
    console.log("\n✅ تراکنش با موفقیت امضا شد!");
    console.log("\n📄 Raw Signed Transaction (این را از طریق SMS می‌فرستید):");
    console.log(signedTx);
    
    console.log("\n🔑 Transaction Hash:", ethers.keccak256(signedTx));
    
    console.log("\n💬 حالا این Raw TX را به gateway-server از طریق SMS ارسال کنید.");
}

main().catch((error) => {
    console.error("❌ خطا:", error);
});
