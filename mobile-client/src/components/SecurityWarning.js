// mobile-client/src/components/SecurityWarning.js

function showSecurityWarning() {
    console.log("⚠️⚠️⚠️ SECURITY WARNING ⚠️⚠️⚠️");
    console.log(" ");
    console.log("1. NEVER enter your real private key unless you are 100% offline.");
    console.log("2. This app is for testing purposes only in early stage.");
    console.log("3. Use a test wallet with very small amount of money.");
    console.log("4. Do not take screenshot when entering private key.");
    console.log("5. After signing, clear your clipboard immediately.");
    console.log(" ");
    console.log("🔒 Your private key never leaves this device.");
    console.log(" ");
}

function SecurityWarningScreen() {
    showSecurityWarning();
    return {
        showSecurityWarning
    };
}

module.exports = SecurityWarningScreen;
