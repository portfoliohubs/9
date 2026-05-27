# PortfolioHubs — Complete Developer & Editor Guide

---

## 1. Project Structure

```
project/
├── src/
│   ├── config.ts              ← ★ THE ONLY FILE YOU NEED TO EDIT for content changes
│   ├── App.tsx                ← Route management (home / portfolio / cv)
│   ├── main.tsx               ← React entry point
│   ├── index.css              ← Design system (Tailwind + custom classes)
│   ├── imageProcessor.ts      ← Image validation & WebP conversion
│   ├── tomlGenerator.ts       ← TOML file generation (portfolio pathway)
│   ├── pdfGenerator.ts        ← PDF CV generation (CV pathway)
│   └── components/
│       ├── Header.tsx         ← Brand header shown on every page
│       ├── HomePage.tsx       ← Landing page with two main buttons
│       ├── PortfolioForm.tsx  ← Multi-step form → TOML + WhatsApp
│       ├── CVForm.tsx         ← Multi-step form → PDF download
│       ├── StepProgress.tsx   ← Progress bar used by both forms
│       └── SkillTagInput.tsx  ← Tag-style skill input (Add button)
├── public/
│   ├── manifest.json          ← PWA manifest (name, icons, theme)
│   └── sw.js                  ← Service worker (offline support)
├── index.html                 ← SEO meta, structured data, PWA tags
└── vite.config.ts             ← Build config (base path, chunking)
```

---

## 2. How to Edit Any Content — Only Edit `src/config.ts`

### Change Brand Name
```ts
brand: {
  name: "PortfolioHubs",        // ← change here
  slogan: "الاسنانجى لازم يتدلع", // ← change slogan here
  logoUrl: "https://...",        // ← change logo URL here
  tagline: "Professional Dental Portfolio & CV Builder",
}
```

### Change WhatsApp Number
```ts
whatsapp: {
  destinationNumber: "201271476215",  // ← without +
  message: "Here is my portfolio configuration file from PortfolioHubs",
}
```

### Change Any Placeholder / Example in Form Fields
```ts
examples: {
  fullName: "Dr. John Doe",      // ← change the example shown in the field
  titleEn: "Internship Dentist", // ← change the example for title
  // ... all other fields
}
```

### Change All UI Text (English)
Edit `ui.en.home`, `ui.en.form`, `ui.en.buttons`, etc.

### Change All UI Text (Arabic)
Edit `ui.ar.home`, `ui.ar.form`, `ui.ar.buttons`, etc.

### Add or Remove Case Categories
```ts
caseCategories: [
  { id: "operative", en: "Operative & Esthetics", ar: "الحشو العادي والتجميلي" },
  // add new entries here
]
```

### Change Google Search Console Verification Code
```ts
seo: {
  googleSearchConsoleVerification: "your-new-code-here",
}
```

### Change SEO Keywords
```ts
seo: {
  keywords: ["portfoliohubs", "dental cv", "cv maker", ...],
}
```

---

## 3. The Two Pathways Explained

### Pathway A: "Portfolio on Google Search"
1. User clicks the blue button on home
2. Multi-step form: Personal → Contact → Photo → Skills → Timeline → Cases → Preview
3. Final step: Preview TOML config, Download .toml file, Send via WhatsApp
4. The TOML file is sent to the developer (via WhatsApp) to deploy the portfolio website

### Pathway B: "CV PDF Maker (Free)"
1. User clicks the white button on home
2. Multi-step form: Personal → Contact → Photo → Skills → Timeline → Cases → Download PDF
3. Final step: Generates a professional PDF CV matching the Dr. Michael Nabil style
4. The PDF includes a clickable WhatsApp link
5. No Arabic fields — English only

---

## 4. Skills Input — How It Works
For Clinical Skills, Digital Skills, and Soft Skills:
- User types one skill in the input
- Clicks "Add" (or presses Enter) to add it as a tag
- Each tag has an X button to remove it
- No comma-separated text — each skill is added individually

---

## 5. Photos — No Cropping, Full Display
- All uploaded photos are displayed with `object-contain` (not `object-cover`)
- This means photos appear 100% without cropping or zoom
- No file size limit — all sizes are accepted
- Multiple photos per case are supported (gallery picker)

---

## 6. Dark Mode
- Toggle button in the header (sun/moon icon)
- Preference is saved to localStorage
- Respects OS dark mode on first visit

---

## 7. Deployment to GitHub Pages

### Setup (once)
1. Push this project to your GitHub repo
2. In `vite.config.ts`, ensure `base: '/portfolio-data-collector/'`
3. In GitHub repo Settings → Pages → Source: GitHub Actions

### The .github/workflows/deploy.yml file handles automatic deployment on push to main.

### After deployment, the app is live at:
`https://portfoliohubs.github.io/portfolio-data-collector/`

---

## 8. Changing the TOML Output Base URL
In `src/config.ts`:
```ts
tomlTemplate: {
  baseUrl: "https://portfoliohubs.github.io/MICKY/",
  // Change to match the user's portfolio website URL
}
```

---

## 9. PDF CV Style
The PDF is generated with the dark navy style (matching Dr. Michael Nabil's PDF):
- Dark background (#0f172a)
- White name, blue accent
- Profile photo, contact info, skills, timeline, clinical cases
- WhatsApp number is clickable (opens wa.me)
- Saved as `FullName_CV.pdf`

---

## 10. Quick Reference: What Controls What

| What you want to change | Where to change it |
|------------------------|-------------------|
| Brand name | `config.ts` → `brand.name` |
| Logo image | `config.ts` → `brand.logoUrl` |
| Slogan (Arabic) | `config.ts` → `brand.slogan` |
| WhatsApp destination | `config.ts` → `whatsapp.destinationNumber` |
| Form examples/placeholders | `config.ts` → `examples.*` |
| All English UI text | `config.ts` → `ui.en.*` |
| All Arabic UI text | `config.ts` → `ui.ar.*` |
| Case categories | `config.ts` → `caseCategories` |
| SEO keywords | `config.ts` → `seo.keywords` |
| Google verification | `config.ts` → `seo.googleSearchConsoleVerification` |
| App title in browser tab | `index.html` → `<title>` |
| PWA app name | `public/manifest.json` → `name` |
| Build base path | `vite.config.ts` → `base` |
| Design colors/styles | `src/index.css` |
| PDF appearance | `src/pdfGenerator.ts` |
| TOML structure | `src/tomlGenerator.ts` |

---

## 11. Local Development

```bash
npm install        # Install dependencies
npm run dev        # Start local server at http://localhost:5173
npm run build      # Build for production
npm run preview    # Preview the production build locally
```

---

## 12. Files You Should NEVER Need to Edit
- `src/main.tsx` — React entry point (no content)
- `src/imageProcessor.ts` — Image processing (technical)
- `tsconfig.json` / `tsconfig.app.json` — TypeScript config
- `postcss.config.js` / `tailwind.config.js` — Style processing
- `eslint.config.js` — Code linting
