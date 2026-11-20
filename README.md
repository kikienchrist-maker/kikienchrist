# Kiki en Christ — Vercel Sync (lafoidieu Design Port)

> **Exact port** of the production-ready "Papier & Or" design from `C:\Users\Admin\lafoidieu` to an Astro project for Vercel deployment.

## 🎯 What This Is

A complete, drop-in Astro project that replicates **pixel-perfect** the design from your `lafoidieu` Python static site generator. Every CSS rule, component, and interaction is extracted directly from `C:\Users\Admin\lafoidieu\out\site\index.html`.

## 📁 Project Structure

```
kikienchrist-vercel-sync/
├── package.json
├── astro.config.mjs
├── README.md
├── public/
│   ├── favicon.svg
│   └── site.webmanifest
└── src/
    ├── layouts/
    │   └── Layout.astro           # Main layout with lafoidieu CSS
    ├── components/
    │   ├── BookCard.astro         # Exact book grid card (alternating layout)
    │   ├── Hero.astro             # Hero with "fan" cover spread
    │   ├── BandeauFormats.astro   # Format band (Papier/Ebook/Audio)
    │   ├── Newsletter.astro       # Leadbox (guide offert)
    │   ├── FAQ.astro              # FAQ panel (v2 design)
    │   ├── CTAStrip.astro         # Final CTA strip
    │   └── Footer.astro           # Footer with language switcher
    ├── styles/
    │   └── lafoidieu-design.css   # Complete CSS (850+ lines, exact port)
    └── pages/
        └── index.astro            # Homepage with all components + JSON-LD
```

## 🚀 Quick Start

```bash
# 1. Navigate to project
cd C:\Users\Admin\Desktop\kikienchrist-vercel-sync

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# → Opens http://localhost:4321

# 4. Build for production
npm run build
# → Output in ./dist/

# 5. Preview production build
npm run preview
```

## 📦 Deploy to Vercel

### Option A: Git Push (Recommended)
```bash
# 1. Initialize git (if not already)
git init
git add .
git commit -m "feat: lafoidieu design port for Vercel"

# 2. Create GitHub repo and push
gh repo create kikienchrist --public --source=. --push

# 3. Import in Vercel Dashboard
#    - New Project → Import Git Repository
#    - Framework: Astro (auto-detected)
#    - Build Command: npm run build
#    - Output Directory: dist
```

### Option B: Vercel CLI
```bash
npm i -g vercel
cd C:\Users\Admin\Desktop\kikienchrist-vercel-sync
vercel --prod
```

## 🎨 Design Features (Exact from lafoidieu)

| Feature | Implementation |
|---------|----------------|
| **Color Palette** | `--ink`, `--cream`, `--paper`, `--gold`, `--gold-soft`, `--gold-ink`, `--line`, `--muted` |
| **Typography** | Georgia/Times New Roman for display, system-ui for UI |
| **Hero** | Radial gradient background, paper texture, "fan" cover spread (4 covers with 3D hover) |
| **Books Grid** | Alternating layout (even cards: image right), 3D cover hover, price badges, language dropdowns |
| **Format Band** | Horizontal band with 3 formats, divider lines, mobile stack |
| **Newsletter** | Centered leadbox with gradient top bar, capture form |
| **FAQ** | Panel with shadow, +/− toggles, Georgia summaries |
| **CTA Strip** | Dark background with gold radial glow, gold button |
| **Responsive** | Breakpoints at 980px, 760px, 720px, 640px, 560px |
| **Reduced Motion** | All transitions disabled, fan static |
| **Print Styles** | Buttons/bands hidden, books unshadowed |

## 📋 Book Data (from lafoidieu JSON-LD)

The 4 books are hardcoded in `src/pages/index.astro` with exact data:

1. **Le visage de Dieu** (331 pages, ISBN 9791035977887)
2. **Les secrets de la Trinité** (146 pages, ISBN 9781447566359)
3. **Le dernier Combat** (85 pages, ISBN 9781445771212)
4. **Le mystère du Salut** (214 pages, ISBN 9781326838447)

Each has 3 offers: **Lulu (Paper)**, **Payhip (Ebook)**, **Google Play (Audio)**.

## 🔧 Customization

### Update Book Data
Edit `src/pages/index.astro` → `books` array.

### Update FAQ
Edit `src/pages/index.astro` → `faqItems` array.

### Change Colors
Edit `src/styles/lafoidieu-design.css` → `.bq` custom properties.

### Add Pages
Create new `.astro` files in `src/pages/` using the same Layout.

## ✅ Verification Checklist

Before deploying, verify locally:

- [ ] `npm run dev` → http://localhost:4321 looks identical to lafoidieu
- [ ] Hero fan animation works (hover 4 covers)
- [ ] Book cards alternate layout (even = image right)
- [ ] Book hover: cover rotates -4deg, shadow deepens
- [ ] Language dropdowns open/close with +/− toggle
- [ ] Price badges show correct currencies
- [ ] Newsletter form submits (configure action URL)
- [ ] FAQ accordion works
- [ ] Mobile: <760px stacks books, fan shrinks
- [ ] Reduced motion: no animations
- [ ] `npm run build` succeeds
- [ ] `npm run preview` production build works

## 🔗 Key Differences from Current Vercel Site

| Current Vercel | This Port (lafoidieu) |
|----------------|----------------------|
| Astro with custom CSS | **Exact lafoidieu CSS port** |
| Flat book cards | **3D covers + alternating layout** |
| Simple dropdown formats | **Horizontal format band** |
| Newsletter section | **Leadbox with gradient bar** |
| Basic FAQ | **Panel FAQ with +/− toggles** |
| No fan animation | **4-cover fan spread in hero** |
| Fraunces font | **Georgia/Times New Roman** |
| Geist font | **system-ui** |

## 📝 Notes

- **No external font dependencies** — uses Georgia (system) + system-ui
- **No JS framework** — pure CSS interactions (details/summary, :hover)
- **Vercel-ready** — static output, edge-friendly
- **SEO-optimized** — JSON-LD ItemList with Book + Offer schemas
- **Performance** — Inline critical CSS, preconnect hints, optimized images

---

**This is the exact design running at `https://foiendieu.netlify.app/` — now ready for your Vercel deployment at `https://kikienchrist.vercel.app/`.**