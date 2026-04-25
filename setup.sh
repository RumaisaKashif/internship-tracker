#!/usr/bin/env bash
set -e

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   Internship Tracker — Setup Script    ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js not found. Install from https://nodejs.org/"; exit 1; }
command -v git >/dev/null 2>&1 || { echo "❌ git not found."; exit 1; }

echo "✅ Prerequisites OK"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Collect environment variables
echo "🔑 Let's configure your environment variables."
echo ""

read -p "VITE_SUPABASE_URL (from supabase.com dashboard): " SUPABASE_URL
read -p "VITE_SUPABASE_ANON_KEY: " SUPABASE_KEY
read -p "ANTHROPIC_API_KEY (from console.anthropic.com): " ANTHROPIC_KEY
read -p "VITE_N8N_WEBHOOK_URL (from n8n, or leave empty): " N8N_URL

# Write .env
cat > .env << EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_KEY
ANTHROPIC_API_KEY=$ANTHROPIC_KEY
VITE_N8N_WEBHOOK_URL=$N8N_URL
VITE_API_BASE_URL=
EOF

echo ""
echo "✅ .env file created"
echo ""

# Build
echo "🏗  Building production bundle..."
npm run build
echo ""

echo "════════════════════════════════════════"
echo "✅ Build successful!"
echo ""
echo "🚀 Next steps:"
echo ""
echo "1. Set up Supabase:"
echo "   → Go to https://supabase.com/dashboard"
echo "   → Open SQL Editor"
echo "   → Run: supabase/schema.sql"
echo "   → Run: supabase/rls.sql"
echo "   → Run: supabase/seed.sql"
echo ""
echo "2. Deploy to Vercel:"
echo "   → npm install -g vercel"
echo "   → vercel deploy"
echo "   → Add env vars in Vercel dashboard"
echo ""
echo "3. Deploy n8n to Render:"
echo "   → Create new Web Service on render.com"
echo "   → Use docker image: n8nio/n8n:latest"
echo "   → Add disk: /home/node/.n8n (1GB)"
echo "   → Set env vars from render.yaml"
echo "   → Once deployed, import JSON from n8n/ folder"
echo "   → Activate workflows"
echo ""
echo "4. Configure n8n credentials:"
echo "   → Gmail OAuth2 (for email scanning)"
echo "   → Supabase API (URL + service role key)"
echo "   → Anthropic HTTP header auth"
echo ""
echo "📖 Full setup guide in README.md"
echo "════════════════════════════════════════"
