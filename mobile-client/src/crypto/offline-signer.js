// src/crypto/offline-signer.js
import { ethers } from "ethers";

/**
 * امضای امن تراکنش به صورت کاملاً آفلاین
 * @param {string} privateKey - کلید خصوصی (با 0x)
 * @param {Object} txParams - پارامترهای تراکنش
 */
async function signTransactionOffline(privateKey, txParams) {
    try {
        // اعتبارسنجی ورودی
        if (!privateKey?.startsWith('0x') || privateKey.length !== 66) {
            throw new Error("کلید خصوصی نامعتبر است");
        }

        if (!ethers.isAddress(txParams.to)) {
            throw new Error("آدرس مقصد نامعتبر است");
        }

        const amount = parseFloat(txParams.amountInEther);
        if (!amount || amount <= 0) {
            throw new Error("مقدار ارسالی باید بیشتر از صفر باشد");
        }

        const wallet = new ethers.Wallet(privateKey);
        console.log(`🔐 Signing transaction for address: ${wallet.address}`);

        // ساخت تراکنش با پشتیبانی EIP-1559
        const tx = {
            to: txParams.to,
            value: ethers.parseEther(amount.toString()),
            gasLimit: txParams.gasLimit || 21000,
            chainId: txParams.chainId || 1,
            nonce: txParams.nonce,
            data: txParams.data || "0x",
            // EIP-1559
            maxFeePerGas: txParams.maxFeePerGas 
                ? ethers.parseUnits(txParams.maxFeePerGas.toString(), "gwei")
                : undefined,
            maxPriorityFeePerGas: txParams.maxPriorityFeePerGas 
                ? ethers.parseUnits(txParams.maxPriorityFeePerGas.toString(), "gwei")
                : undefined,
        };

        const signedTx = await wallet.signTransaction(tx);

        // محاسبه صحیح Tx Hash برای preview
        const txHash = ethers.keccak256(ethers.getBytes(signedTx));

        console.log("✅ Transaction signed successfully (Offline)");
        console.log(`🔗 Preview Tx Hash: ${txHash.slice(0, 20)}...`);

        return {
            success: true,
            signedRawTx: signedTx,
            from: wallet.address,
            to: tx.to,
            value: amount,
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

export { signTransactionOffline };
