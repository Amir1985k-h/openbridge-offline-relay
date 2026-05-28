// src/sms/payload-splitter.js

function splitTransactionForSMS(rawTx, maxChunkSize = 120) {
    const cleanTx = rawTx.startsWith("0x") ? rawTx.slice(2) : rawTx;
    const chunks = [];
    const totalLength = cleanTx.length;
    
    for (let i = 0; i < totalLength; i += maxChunkSize) {
        chunks.push(cleanTx.slice(i, i + maxChunkSize));
    }
    
    const totalChunks = chunks.length;
    const uniqueTxId = Math.random().toString(36).substring(2, 7).toUpperCase(); 

    return chunks.map((chunk, index) => {
        const chunkIndex = index + 1;
        return `OB:${uniqueTxId}:${totalChunks}:${chunkIndex}:${chunk}`;
    });
}

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
