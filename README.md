# 🥌 AI Curling Championship

Interactive marketing game for [BrandedAI](https://www.brandedai.net) — slide AI automation solutions onto the ROI target!

## Quick Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "AI Curling Championship v1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-curling.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New → Project"**
3. Import your `ai-curling` GitHub repo
4. Framework preset will auto-detect as **Vite**
5. Click **Deploy** — done!

### 3. Add Custom Domain (optional)
1. In Vercel dashboard → your project → **Settings → Domains**
2. Add `curling.brandedai.net` (or `play.brandedai.net`)
3. Add the DNS record Vercel gives you to your domain provider

## Local Development
```bash
npm install
npm run dev
```

## Game Features
- 5 branded automation stones (Invoice, CRM, Knowledge Base, Workflow, Sales Dashboard)
- Realistic curling physics with stone-to-stone collisions
- Tap-to-sweep mechanic with visible ice marks
- Scoring zones: 100/75/50/25 points
- Results screen with LinkedIn share CTA and discovery call link
- Mobile-friendly touch controls

## Built With
- React 18 + Vite
- Canvas-free pure DOM rendering
- requestAnimationFrame physics engine
