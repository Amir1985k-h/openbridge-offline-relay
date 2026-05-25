// gateway-server/src/web3-broadcaster.js
const { ethers } = require("ethers");

/**
 * پخش تراکنش خام امضاشده آفلاین
 * @param {string} rawTransactionPayload - تراکنش امضا شده (با 0x)
 */
async function broadcastOfflineTransaction(rawTransactionPayload) {
    // اعتبارسنجی قوی ورودی
    if (typeof rawTransactionPayload !== 'string') {
        throw new Error("Invalid payload: must be a string");
    }

    if (!rawTransactionPayload.startsWith('0x')) {
        throw new Error("Invalid payload: must start with 0x");
    }

    if (rawTransactionPayload.length < 50) {   // حداقل طول منطقی برای تراکنش
        throw new Error("Payload too short to be a valid signed transaction");
    }

    const rpcUrls = {
        ethereum: process.env.ETH_RPC_URL || "https://eth.llamarpc.com",
        polygon: process.env.POLYGON_RPC_URL || "https://polygon.llamarpc.com"
    };

    // تشخیص شبکه از روی تراکنش (خیلی ساده - بعداً دقیق‌تر می‌کنیم)
    const isPolygon = rawTransactionPayload.includes("89"); // روش موقتی - بعداً بهبود می‌دهیم

    const rpcUrl = isPolygon ? rpcUrls.polygon : rpcUrls.ethereum;

    let lastError = null;

    // Retry logic (تا ۳ بار)
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            console.log(`🌐 Attempt ${attempt}/3 - Broadcasting to: ${rpcUrl}`);

            const provider = new ethers.JsonRpcProvider(rpcUrl);
            
            const txResponse = await provider.broadcastTransaction(rawTransactionPayload);
            
            console.log(`✅ Transaction successfully broadcasted!`);
            console.log(`🔗 Network: ${isPolygon ? 'Polygon' : 'Ethereum'}`);
            console.log(`🔗 Tx Hash: ${txResponse.hash}`);

            return {
                success: true,
                hash: txResponse.hash,
                network: isPolygon ? 'polygon' : 'ethereum',
                rpc: rpcUrl
            };

        } catch (error) {
            lastError = error;
            console.error(`❌ Attempt ${attempt} failed:`, error.message);

            if (error.message.includes("already known") || 
                error.message.includes("already in mempool")) {
                return {
                    success: true,
                    hash: "already_known",
                    message: "Transaction was already broadcasted by someone else"
                };
            }

            // اگر خطای غیرقابل برگشت بود، زودتر خارج شو
            if (error.message.includes("insufficient funds") || 
                error.message.includes("nonce too low")) {
                break;
            }

            // قبل از تلاش بعدی کمی صبر کن
            if (attempt < 3) await new Promise(r => setTimeout(r, 1500));
        }
    }

    // خطای نهایی
    let friendlyError = lastError.message;

    if (lastError.message.includes("nonce too low")) {
        friendlyError = "Nonce too low (possible replay attack or duplicate transaction)";
    } else if (lastError.message.includes("insufficient funds")) {
        friendlyError = "Insufficient funds for gas";
    } else if (lastError.code === 'SERVER_ERROR' || lastError.message.includes("network")) {
        friendlyError = "RPC connection failed. Please try again later.";
    }

    return {
        success: false,
        error: friendlyError,
        originalError: lastError.message,
        code: lastError.code
    };
}

module.exports = { broadcastOfflineTransaction };
