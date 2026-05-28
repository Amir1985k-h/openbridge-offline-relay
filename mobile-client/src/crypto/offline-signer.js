// src/crypto/offline-signer.js
const { ethers } = require("ethers");

async function signTransactionOffline(privateKey, txParams) {
    try {
        if (!privateKey || !privateKey.startsWith('0x')) {
            throw new Error("کلید خصوصی نامعتبر است");
        }

        const wallet = new ethers.Wallet(privateKey);
        console.log(`🔐 Signing transaction for address: ${wallet.address}`);

        const tx = {
            to: txParams.to,
            value: ethers.parseEther(txParams.amountInEther.toString()),
            gasLimit: txParams.gasLimit || 21000,
            chainId: txParams.chainId || 1,
            data: txParams.data || "0x"
        };

        const signedTx = await wallet.signTransaction(tx);
        const txHash = ethers.keccak256(ethers.getBytes(signedTx));

        console.log("✅ Transaction signed successfully (Offline)");

        return {
            success: true,
            signedRawTx: signedTx,
            from: wallet.address,
            to: tx.to,
            value: txParams.amountInEther,
            txHashPreview: txHash
        };

    } catch (error) {
        console.error("❌ Signing failed:", error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { signTransactionOffline };
