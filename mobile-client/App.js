// App.js
import { startSigningFlow } from './src/screens/SignTransactionScreen.js';

console.log("🚀 OpenBridge Mobile Client Started");
console.log("====================================\n");

async function main() {
    try {
        await startSigningFlow();
    } catch (error) {
        console.error("❌ خطا:", error.message);
    }
}

main();
