// App.js
const { startSigningFlow } = require('./src/screens/SignTransactionScreen');

console.log("🚀 OpenBridge Mobile Client Started");
console.log("====================================\n");

startSigningFlow().catch(console.error);
