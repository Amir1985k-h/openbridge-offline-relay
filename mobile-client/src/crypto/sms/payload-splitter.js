/**
 * تکه‌تکه کردن یک تراکنش خام طولانی به قطعات کوچک استاندارد جهت ارسال امن با SMS
 * @param {string} rawTx - تراکنش امضا شده هگز (شروع با 0x)
 * @param {number} maxChunkSize - حداکثر تعداد کاراکتر در هر پیامک (پیش‌فرض 120)
 * @returns {Array<string>} - آرایه‌ای از پیامک‌های شماره‌گذاری شده آماده ارسال
 */
function splitTransactionForSMS(rawTx, maxChunkSize = 120) {
    const cleanTx = rawTx.startsWith("0x") ? rawTx.slice(2) : rawTx;
    const chunks = [];
    const totalLength = cleanTx.length;
    
    for (let i = 0; i < totalLength; i += maxChunkSize) {
        chunks.push(cleanTx.slice(i, i + maxChunkSize));
    }
    
    const totalChunks = chunks.length;
    const uniqueTxId = Math.random().toString(36).substring(2, 7).toUpperCase(); 

    // فرمت خروجی پیامک: OB:[شناسه تصادفی]:[تعداد کل قطعات]:[شماره قطعه فعلی]:[داده متنی]
    return chunks.map((chunk, index) => {
        const chunkIndex = index + 1;
        return `OB:${uniqueTxId}:${totalChunks}:${chunkIndex}:${chunk}`;
    });
}

/**
 * بازسازی قطعات دریافتی پیامک در سمت سرور و چسباندن مجدد آن‌ها به هم
 * @param {Array<string>} receivedSMSList - لیست پیامک‌های دریافتی مربوط به یک تراکنش
 * @returns {string} - تراکنش کامل هگز آماده ارسال به شبکه (شروع با 0x)
 */
function assembleSMSPayload(receivedSMSList) {
    const sortedChunks = receivedSMSList.sort((a, b) => {
        const indexA = parseInt(a.split(":")[3]);
        const indexB = parseInt(b.split(":")[3]);
        return indexA - indexB;
    });

    const rawHexPayload = sortedChunks.map(sms => sms.split(":")[4]).join("");
    return `0x${rawHexPayload}`;
}

module.exports = { splitTransactionForSMS, assembleSMSPayload };
