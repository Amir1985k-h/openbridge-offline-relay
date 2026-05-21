// mobile-client/src/crypto/offline-signer.js
const { ethers } = require("ethers");

/**
 * امضای تراکنش اتریوم به صورت کاملاً آفلاین
 * @param {string} privateKey - کلید خصوصی (بدون 0x)
 * @param {Object} txParams - پارامترهای تراکنش
 * @returns {Promise<Object>} - تراکنش امضاشده
 */
async function signTransactionOffline(privateKey, txParams) {
    try {
        // اعتبارسنجی اولیه
        if (!privateKey || !privateKey.startsWith('0x')) {
            throw new Error("کلید خصوصی باید با 0x شروع شود");
        }

        const wallet = new ethers.Wallet(privateKey);

        // آماده‌سازی تراکنش
        const tx = {
            to: txParams.to,
            value: ethers.parseEther(txParams.amountInEther || "0"),
            nonce: txParams.nonce,
            gasLimit: txParams.gasLimit || 21000,
            gasPrice: txParams.gasPriceInGwei 
                ? ethers.parseUnits(txParams.gasPriceInGwei.toString(), "gwei")
                : undefined,
            chainId: txParams.chainId || 1,
            data: txParams.data || undefined
        };

        // امضای تراکنش
        const signedTx = await wallet.signTransaction(tx);

        console.log("✅ Transaction signed successfully (Offline)");
        console.log("🔗 Tx Hash (preview):", ethers.keccak256(signedTx).slice(0, 20) + "...");

        return {
            success: true,
            signedRawTx: signedTx,           // این همون چیزیه که باید با SMS ارسال بشه
            from: wallet.address,
            to: tx.to,
            value: txParams.amountInEther,
            chainId: tx.chainId
        };

    } catch (error) {
        console.error("❌ Signing failed:", error.message);
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
}

module.exports = { signTransactionOffline };
