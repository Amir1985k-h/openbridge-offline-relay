# ====================== Builder Stage ======================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# کپی فقط فایل‌های وابستگی برای caching بهتر
COPY package*.json ./

# نصب همه dependencies (شامل dev برای build اگر لازم باشه)
RUN npm ci --frozen-lockfile

# کپی کد منبع
COPY . .

# ====================== Production Stage ======================
FROM node:20-alpine AS production

# ایجاد کاربر غیر root برای امنیت
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs

WORKDIR /usr/src/app

# کپی فقط production dependencies از مرحله قبل
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/src ./src

# مجوزهای امن
USER nodejs

EXPOSE 3000

# Healthcheck (اختیاری ولی توصیه می‌شه)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["npm", "start"]
