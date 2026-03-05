#!/usr/bin/env bash
set -e

echo "Bootstrapping Project Ancient..."

# ── Root workspace ──────────────────────────────────────────
cat > package.json << 'EOF'
{
  "name": "project-ancient",
  "private": true,
  "workspaces": ["shared", "client", "server"],
  "scripts": {
    "dev": "concurrently -n SERVER,CLIENT -c magenta,cyan \"npm run dev -w server\" \"npm run dev -w client\""
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

# ── Shared (empty placeholder) ───────────────────────────────
mkdir -p shared/src
cat > shared/package.json << 'EOF'
{
  "name": "@ancient/shared",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts"
}
EOF
touch shared/src/index.ts

# ── Client (Svelte 5 + Vite) ─────────────────────────────────
npm create vite@latest client -- --template svelte-ts
cd client
npm install
npm install phaser colyseus.js
npm install -D tailwindcss @tailwindcss/vite
cd ..

# ── Server (Colyseus + Express) ──────────────────────────────
mkdir -p server/src
cat > server/package.json << 'EOF'
{
  "name": "@ancient/server",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc"
  },
  "dependencies": {
    "colyseus": "^0.15.28",
    "express": "^4.19.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "tsx": "^4.15.5",
    "typescript": "^5.4.5",
    "@types/node": "^20.14.0",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17"
  }
}
EOF
cd server && npm install && cd ..

# ── Root install ─────────────────────────────────────────────
npm install

echo ""
echo "Done!"
echo "  Client → http://localhost:5173  (npm run dev -w client)"
echo "  Server → http://localhost:2567  (npm run dev -w server)"