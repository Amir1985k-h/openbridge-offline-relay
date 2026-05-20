const { ethers } = require("ethers");

/**
 * امضای یک تراکنش اتریوم به صورت ۱۰۰٪ آفلاین
 * @param {string} privateKey - کلید خصوصی کاربر
 * @param {string} toAddress - آدرس ولت مقصد
 * @param {string} amountInEther - مقدار ارز به اتریوم (مثلا 0.1)
 * @param {number} nonce - شماره تراکنش ولت فرستنده
 * @param {string} gasPriceInGwei - قیمت گاز شبکه (مثلا 20)
 * @param {number} gasLimit - سقف گاز تراکنش (معمولا 21000)
 * @param {number} chainId - شناسه شبکه (مثلا 1 برای اتریوم)
 * @returns {string} - تراکنش امضاشده جهت ارسال با SMS
 */
function signTransactionOffline(privateKey, toAddress, amountInEther, nonce, gasPriceInGwei, gasLimit = 21000, chainId = 1) {
    try {
        const wallet = new ethers.Wallet(privateKey);
        const tx = {
            to: toAddress,
            value: ethers.parseEther(amountInEther),
            nonce: nonce,
            gasLimit: gasLimit,
            gasPrice: ethers.parseUnits(gasPriceInGwei, "gwei"),
            chainId: chainId
        };
        const signedRawTx = wallet.signTransaction(tx);
        return { success: true, payload: signedRawTx };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = { signTransactionOffline };
