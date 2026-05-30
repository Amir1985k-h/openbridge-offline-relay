# 🚀 OpenBridge - Offline Transaction Demo (Sepolia Testnet)

این دمو نشان می‌دهد چگونه می‌توانید یک تراکنش اتریوم را **کاملاً آفلاین** امضا کنید و از طریق SMS به gateway ارسال کنید.

**تست موفق انجام شده** - تاریخ: ۱۴۰۵/۰۳/۰۹

---

## 🎯 هدف دمو

نشان دادن کامل flow آفلاین:
1. امضای تراکنش بدون اینترنت
2. آماده‌سازی payload برای ارسال از طریق SMS
3. فرمت پیامک (Multi-part SMS)

---

## 📋 پیش‌نیازها

- Node.js v18+
- ۰٫۰۵ SepoliaETH (تستی)
- والت با Private Key (برای تست)

---

## مرحله ۱: نصب وابستگی‌ها

```bash
cd demo
npm init -y
npm install ethers@6
