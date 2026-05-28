// mobile-client/App.js
const HomeScreen = require('./src/screens/HomeScreen');

console.log("🚀 OpenBridge Mobile Client Started");
console.log("====================================");

// اجرای تست اولیه (بعداً UI گرافیکی اضافه می‌کنیم)
async function startApp() {
    console.log("📱 OpenBridge Offline Signer is ready!");
    
    const home = HomeScreen();
    console.log(home.message);
    
    // برای تست فعلاً کامنتش کن تا بعداً دستی فراخوانی کنی
    // await home.runTestExample();
}

startApp();

module.exports = { startApp };
