// mobile-client/src/crypto/offline-signer.js
const { ethers } = require("ethers");

/**
 * امضای امن تراکنش به صورت کاملاً آفلاین
 * @param {string} privateKey - کلید خصوصی (با 0x)
 * @param {Object} txParams - پارامترهای تراکنش
 */
async function signTransactionOffline(privateKey, txParams) {
    try {
        // ====================== اعتبارسنجی امنیتی ======================
        if (!privateKey || typeof privateKey !== 'string') {
            throw new Error("کلید خصوصی الزامی است");
        }

        if (!privateKey.startsWith('0x')) {
            throw new Error("کلید خصوصی باید با 0x شروع شود");
        }

        if (privateKey.length !== 66) {
            throw new Error("طول کلید خصوصی نامعتبر است (66 کاراکتر)");
        }

        // اعتبارسنجی آدرس مقصد
        if (!ethers.isAddress(txParams.to)) {
            throw new Error("آدرس مقصد نامعتبر است");
        }

        if (!txParams.amountInEther || parseFloat(txParams.amountInEther) <= 0) {
            throw new Error("مقدار ارسالی باید بیشتر از صفر باشد");
        }

        // ====================== امضای تراکنش ======================
        const wallet = new ethers.Wallet(privateKey);

        const tx = {
            to: txParams.to,
            value: ethers.parseEther(txParams.amountInEther.toString()),
            gasLimit: txParams.gasLimit || 21000,
            gasPrice: txParams.gasPriceInGwei 
                ? ethers.parseUnits(txParams.gasPriceInGwei.toString(), "gwei")
                : undefined,
            chainId: txParams.chainId || 1,
            nonce: txParams.nonce,
            data: txParams.data || "0x"
        };

        console.log(`🔐 Signing transaction for address: ${wallet.address}`);

        const signedTx = await wallet.signTransaction(tx);

        // هش تراکنش برای نمایش
        const txHash = ethers.keccak256(signedTx);

        console.log("✅ Transaction signed successfully (Offline)");
        console.log(`🔗 Preview Tx Hash: ${txHash.slice(0, 20)}...`);

        return {
            success: true,
            signedRawTx: signedTx,           // مهم‌ترین فیلد برای ارسال به SMS
            from: wallet.address,
            to: tx.to,
            value: txParams.amountInEther,
            chainId: tx.chainId,
            txHashPreview: txHash,
            timestamp: Date.now()
        };

    } catch (error) {
        console.error("❌ Signing failed:", error.message);
        return {
            success: false,
            error: error.message,
            code: error.code || "SIGNING_ERROR"
        };
    }
}

module.exports = { signTransactionOffline };
