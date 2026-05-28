// mobile-client/src/test-flow.js
import { startSigningFlow } from './screens/SignTransactionScreen.js';

console.log("🚀 OpenBridge Mobile Signer - تست کامل\n");

async function runTest() {
    await startSigningFlow();
}

runTest().catch(console.error);
