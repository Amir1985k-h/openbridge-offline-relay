// gateway-server/src/web3-broadcaster.js
const { ethers } = require("ethers");

/**
 * پخش تراکنش خام امضاشده آفلاین در شبکه اتریوم
 * @param {string} rawTransactionPayload - تراکنش امضاشده (0x hex)
 * @param {string} rpcUrl - آدرس RPC (اختیاری)
 */
async function broadcastOfflineTransaction(rawTransactionPayload, rpcUrl = "https://eth.llamarpc.com") {
    try {
        // اعتبارسنجی قوی ورودی
        if (typeof rawTransactionPayload !== 'string' || !rawTransactionPayload.startsWith('0x')) {
            throw new Error("Invalid payload: must be a 0x-prefixed hex string");
        }

        if (rawTransactionPayload.length < 10) {
            throw new Error("Payload too short to be a valid transaction");
        }

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        
        console.log(`🌐 Broadcasting to RPC: ${rpcUrl}`);

        const txResponse = await provider.broadcastTransaction(rawTransactionPayload);
        
        console.log(`✅ Transaction broadcasted successfully!`);
        console.log(`🔗 Tx Hash: ${txResponse.hash}`);

        return {
            success: true,
            hash: txResponse.hash,
            provider: rpcUrl
        };

    } catch (error) {
        console.error("❌ Broadcast failed:", error.message);

        let friendlyError = error.message;

        if (error.message.includes("already known") || error.message.includes("already in mempool")) {
            friendlyError = "تراکنش قبلاً در شبکه ارسال شده است";
        } else if (error.message.includes("nonce too low")) {
            friendlyError = "Nonce خیلی پایین است (احتمال replay attack)";
        } else if (error.code === 'SERVER_ERROR' || error.message.includes("network")) {
            friendlyError = "مشکل اتصال به RPC - لطفاً بعداً امتحان کنید";
        } else if (error.message.includes("insufficient funds")) {
            friendlyError = "موجودی حساب کافی نیست";
        }

        return {
            success: false,
            error: friendlyError,
            originalError: error.message,
            code: error.code
        };
    }
}

module.exports = { broadcastOfflineTransaction };
