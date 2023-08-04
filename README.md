About
=========

The web3 project version the app https://www.kickstarter.com/.

Technologies:
==============

- Backend
  - Node.js
  - Javascript
  - Solidity(Smart contract)
  - Jest(unit tests)
- Frontend
  - Next.js
  - Typescript
  - Semantic ui react


Instructions to run backend:
=============================

- Clone
- Access **backend**
- Execute command: **npm i**
- Create **.env** file based **.env.example**
- Execute command: **node ./ethereum/compile.js && node ./ethereum/deploy.js** to deploy smart contracts in ethereum network.

Instructions to run frontend:
================================

- Clone
- Access **frontend**
- Execute command: **npm i**
- Create **.env.local** file based **.env.local.example**
- Execute command: **cd backend && node ./ethereum/compile.js && node ./ethereum/deploy.js** to get smart contract address deployed.
- Execute command **cd frontend && npm run dev** to run next.js application at http://localhost:3000.