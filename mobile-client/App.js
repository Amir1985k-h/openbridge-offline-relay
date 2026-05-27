// App.js
import { startSigningFlow } from './src/screens/SignTransactionScreen.js';

export default function App() {
    console.log("🚀 OpenBridge Mobile Client Started");
    console.log("====================================\n");

    // اجرای تست اولیه (بعداً UI گرافیکی واقعی اضافه می‌کنیم)
    startSigningFlow().catch(console.error);

    return {
        message: "✅ OpenBridge Offline Signer is ready for React Native UI!"
    };
}

// برای تست مستقیم در Node.js
if (require.main === module) {
    App();
}
