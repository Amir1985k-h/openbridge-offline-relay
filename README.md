
# OpenBridge: Offline Web3 Survival Infrastructure 🌐⛓️

OpenBridge is a decentralized, censorship-resistant infrastructure designed to ensure digital and financial survival during total internet blackouts and severe network restrictions. 

By bypassing traditional internet requirements at the physical layer, OpenBridge allows users to securely sign and broadcast Web3 transactions using alternative routing methods.

---

## 🚀 Key Features

* Offline EVM Signing: Securely sign transactions on mobile clients (Android/iOS) completely offline with zero data leaks.
* SMS-to-Web3 Gateway: Compresses signed raw transactions into light, hex-encoded payloads and relays them via cellular network text messages to open-net node gateways.
* P2P Mesh Routing: Uses local WiFi and Bluetooth mesh networks to dynamically route data until it reaches an active edge node.
* Censorship Resistant: Built specifically for users in heavily restricted jurisdictions to safeguard financial freedom and digital sovereignty.
* 📦 SMS Payload Optimization: Due to the 160-character limitation of standard SMS protocols, the mobile client includes a proprietary multi-part payload splitter (payload-splitter.js). It compresses, identifies, and tags sequential raw hexadecimal strings using the optimized standard format: OB:[TxID]:[Total]:[Index]:[DataHex], ensuring ordered assembly and 100% data integrity at the gateway server.

  

---

## 📁 Repository Architecture

openbridge-offline-relay/
├── gateway-server/         # Node.js backend to parse SMS & broadcast to Ethereum
│   ├── src/                # Core logic (app.js & web3-broadcaster.js)
│   ├── Dockerfile          # Containerized deployment settings
│   └── package.json        # Dependencies (Ethers.js, Express)
├── mobile-client/          # Offline wallet signer & Mesh networking client (Coming Soon)
└── docs/                   # System architecture and specifications
---

## 🛠️ Gateway Server Quick Start & Deployment

### Prerequisites
- Docker و Docker Compose نصب باشد.
- یک RPC اتریوم معتبر (Cloudflare, LlamaRpc, Ankr و غیره).

### ۱. Build Docker Image

bash
cd gateway-server
docker build -t openbridge/gateway:latest .

bash
docker run -d \
  --name openbridge-gateway \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  openbridge/gateway:latest
---

## 🗺️ Strategic Roadmap (2026 - 2027)

We are actively building based on our Strategic Roadmap for Offline Digital Survival, proudly verified and supported by the global community on Giveth 💎.

* Phase 1 (Q3 2026): Research and Infrastructure setup for secure SMS-to-Web3 endpoints.
* Phase 2 (Q4 2026): MVP launch of the mobile offline transaction signer and compressed payload generator.
* Phase 3 (Q1 2027): Integration of open-source local P2P Mesh networking protocols (LoRa/WiFi).
* Phase 4 (Q2 2027): Public global release and API/SDK deployment for third-party Web3 non-custodial wallets.

---

## ⚖️ License
This project is open-source and licensed under the [MIT License](LICENSE). Built for public good.
