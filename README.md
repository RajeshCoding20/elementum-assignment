# Elementum — Frontend Assignment

A fully responsive React landing page built from the provided Figma design.

## Sections
- Navbar (sticky, mobile hamburger menu)
- Hero (headline, avatar cluster, decorative blobs)
- About (two-column layout with image)
- Help (flipped layout with circular image)
- Services (3 interactive rows with hover states)
- Testimonial (flanked avatar layout with quote card)
- Newsletter (mint green CTA section)
- Footer (4-column responsive layout)

## Tech Stack
- React (functional components + hooks)
- CSS-in-JS (inline styles + injected global CSS)
- Google Fonts: DM Serif Display + DM Sans
- IntersectionObserver for scroll-reveal animations
- No external UI libraries

## How to Run
npm create vite@latest my-app -- --template react
cd my-app
# Replace src/App.jsx with Elementum.jsx
npm install
npm run dev
