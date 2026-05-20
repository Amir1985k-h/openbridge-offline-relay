const { ethers } = require("ethers");

/**
 * دریافت رشته هگزادسیمال تراکنش امضاشده آفلاین و پخش آن در شبکه اتریوم
 * @param {string} rawTransactionPayload - تراکنش امضاشده به صورت هگز از طریق SMS
 * @param {string} rpcUrl - آدرس گره شبکه اتریوم (RPC)
 */
async function broadcastOfflineTransaction(rawTransactionPayload, rpcUrl) {
    try {
        // ۱. اتصال به گره شبکه (Provider)
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        
        console.log("Connecting to the Ethereum network...");
        
        // ۲. ارسال تراکنش خام امضاشده به شبکه
        const txResponse = await provider.broadcastTransaction(rawTransactionPayload);
        
        console.log(`🚀 Transaction successfully broadcasted!`);
        console.log(`Transaction Hash: ${txResponse.hash}`);
        
        return {
            success: true,
            hash: txResponse.hash
        };
    } catch (error) {
        console.error("❌ Failed to broadcast transaction:", error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = { broadcastOfflineTransaction };
