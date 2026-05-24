
# OpenBridge: Offline Web3 Survival Infrastructure 🌐⛓️

**OpenBridge** یک زیرساخت غیرمتمرکز و مقاوم در برابر سانسور است که برای بقا دیجیتال و مالی در شرایط قطعی کامل اینترنت و محدودیت‌های شدید شبکه طراحی شده. 

By bypassing traditional internet requirements at the physical layer, OpenBridge allows users to securely sign and broadcast Web3 transactions using alternative routing methods (SMS + Mesh Networks).

---

## 🚀 Key Features

* **Offline EVM Signing:** Securely sign transactions on mobile clients (Android/iOS) completely offline with zero data leaks.
* **SMS-to-Web3 Gateway:** Compresses signed raw transactions into light, hex-encoded payloads and relays them via cellular network text messages to open-net node gateways.
* **P2P Mesh Routing:** Uses local WiFi and Bluetooth mesh networks to dynamically route data until it reaches an active edge node.
* **Censorship Resistant:** Built specifically for users in heavily restricted jurisdictions to safeguard financial freedom and digital sovereignty.
* **📦 SMS Payload Optimization:** Due to the 160-character limitation of standard SMS protocols, the mobile client includes a proprietary multi-part payload splitter (`payload-splitter.js`). It compresses, identifies, and tags sequential raw hexadecimal strings using the optimized standard format: `OB:[TxID]:[Total]:[Index]:[DataHex]`, ensuring ordered assembly and 100% data integrity at the gateway server.

---

## 📁 Repository Architecture

```text
openbridge-offline-relay/
├── gateway-server/         # Node.js backend to parse SMS & broadcast to Ethereum
│   ├── src/                # Core logic (app.js & web3-broadcaster.js)
│   ├── Dockerfile          # Containerized deployment settings
│   ├── package.json
│   ├── .env
│   └── .env.example
├── mobile-client/          # Offline wallet signer & Mesh networking client (Coming Soon)
├── docs/                   # System architecture and specifications
└── README.md
   ```
---

## 🛠️ Gateway Server Quick Start

The gateway server is fully containerized and can be deployed instantly using Docker.

### Prerequisites
- Docker installed on your host machine.
- An Ethereum RPC node URL (e.g., Infura, Alchemy, or Cloudflare).

### Deployment

1. Build the Docker image:
```bash  
   cd gateway-server
docker build -t openbridge/relay:latest .
   ```   
2. Run the container (replace with your RPC provider):
```bash  
   docker run -d \
  --name openbridge-relay \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  openbridge/relay:latest
   ```   
---

## 🗺️ Strategic Roadmap (2026 - 2027)

We are actively building based on our Strategic Roadmap for Offline Digital Survival, proudly verified and supported by the global community on Giveth 💎.

* Phase 1 (Q3 2026): Research and Infrastructure setup for secure SMS-to-Web3 endpoints.
* Phase 2 (Q4 2026): MVP launch of the mobile offline transaction signer and compressed payload generator.
* Phase 3 (Q1 2027): Integration of open-source local P2P Mesh networking protocols (LoRa/WiFi).
* Phase 4 (Q2 2027): Public global release and API/SDK deployment for third-party Web3 non-custodial wallets.

---

👥️ How to Contribute & Give Feedback

We are in early stage and actively looking for:

* Brutal technical feedback
* Security review & audit suggestions
* Contributors (Node.js, React Native, Mesh Networking, Cryptography)
* Testers from regions with internet restrictions

Ways to help:

1.Open an Issue with your feedback
2.Start a discussion in GitHub Discussions (./discussions)
3.Submit Pull Requests
4.Star the repo if you find it valuable ⭐️

---

## ⚖️ License
This project is open-source and licensed under the [MIT License](LICENSE). Built for public good.
