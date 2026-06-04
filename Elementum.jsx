import { useState, useEffect, useRef } from "react";

// ── Inline styles / CSS injected once ──────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #111111;
    --white: #ffffff;
    --mint: #d6ede2;
    --pink-blob: #f7c5c0;
    --red-accent: #e63946;
    --purple-accent: #7b5ea7;
    --text-body: #444444;
    --text-light: #777777;
    --font-display: 'DM Serif Display', serif;
    --font-body: 'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); color: var(--black); background: #fff; overflow-x: hidden; }

  /* ── Fade-in on scroll ── */
  .reveal {
    opacity: 0;
    transform: translateY(36px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.4s; }

  /* ── Nav ── */
  nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid #f0f0f0;
    padding: 0 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 1.3rem;
    letter-spacing: -0.02em;
    color: var(--black);
    text-decoration: none;
  }
  .nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
  }
  .nav-links a {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-body);
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--black); }
  .nav-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 4px;
  }
  .nav-hamburger span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--black);
    border-radius: 2px;
    transition: all 0.3s;
  }

  /* ── Hero ── */
  .hero {
    padding: 80px 5% 60px;
    position: relative;
    overflow: hidden;
    max-width: 1200px;
    margin: 0 auto;
  }
  .hero-headline {
    font-family: var(--font-display);
    font-size: clamp(2.4rem, 5vw, 4.2rem);
    line-height: 1.15;
    color: var(--black);
    max-width: 700px;
    position: relative;
    z-index: 2;
  }
  .hero-headline .underline-red {
    text-decoration: underline;
    text-decoration-color: var(--red-accent);
    text-underline-offset: 6px;
  }
  .hero-headline .highlight-yellow {
    background: #f5e642;
    padding: 0 4px;
    border-radius: 3px;
  }
  .hero-subtitle {
    margin-top: 1.2rem;
    font-size: 0.9rem;
    color: var(--text-light);
    max-width: 460px;
    line-height: 1.7;
  }
  /* Decorative blobs */
  .blob-pink {
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, #f9d4cf 0%, transparent 70%);
    border-radius: 50%;
    top: -60px;
    right: -60px;
    pointer-events: none;
    z-index: 0;
  }
  .blob-squiggle-left {
    position: absolute;
    left: -20px;
    top: 140px;
    width: 60px;
    pointer-events: none;
    z-index: 1;
  }
  .purple-leaf {
    position: absolute;
    right: 5%;
    top: 80px;
    width: 52px;
    z-index: 2;
  }

  /* ── Avatar cluster ── */
  .avatar-cluster {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 3rem;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  .avatar-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #fff;
    box-shadow: 0 4px 18px rgba(0,0,0,0.12);
    background: #e8e8e8;
    flex-shrink: 0;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .avatar-circle:hover {
    transform: translateY(-6px) scale(1.06);
    box-shadow: 0 12px 32px rgba(0,0,0,0.18);
  }
  .avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .avatar-circle-lg {
    width: 100px;
    height: 100px;
  }

  /* ── Section shared ── */
  .section {
    padding: 80px 5%;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* ── About / Tomorrow ── */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }
  .about-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-light);
    margin-bottom: 1rem;
  }
  .about-heading {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 3vw, 2.8rem);
    line-height: 1.2;
    color: var(--black);
  }
  .about-heading .underline-red {
    text-decoration: underline;
    text-decoration-color: var(--red-accent);
    text-underline-offset: 5px;
  }
  .about-body {
    margin-top: 1.2rem;
    font-size: 0.88rem;
    color: var(--text-light);
    line-height: 1.8;
    max-width: 380px;
  }
  .read-more {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 1.6rem;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--black);
    text-decoration: none;
    border-bottom: 2px solid var(--black);
    padding-bottom: 2px;
    transition: gap 0.2s, border-color 0.2s;
  }
  .read-more:hover { gap: 14px; border-color: var(--red-accent); color: var(--red-accent); }
  .image-card {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
  }
  .image-card img {
    width: 100%;
    height: 360px;
    object-fit: cover;
    display: block;
    border-radius: 16px;
  }
  .red-triangle {
    position: absolute;
    bottom: -10px;
    left: -10px;
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 86px solid var(--red-accent);
    z-index: 3;
  }

  /* ── Help section (flipped) ── */
  .help-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    position: relative;
  }
  .help-image-wrap {
    position: relative;
  }
  .help-image-wrap img {
    width: 100%;
    height: 360px;
    object-fit: cover;
    border-radius: 50%;
    display: block;
  }
  .squiggle-line {
    position: absolute;
    right: -40px;
    top: 50%;
    transform: translateY(-50%);
    width: 80px;
    pointer-events: none;
  }

  /* ── Services ── */
  .services-heading {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 3.2rem);
    line-height: 1.15;
    max-width: 460px;
  }
  .services-heading .underline-box {
    display: inline-block;
    border-bottom: 3px solid var(--black);
  }
  .services-list {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .service-row {
    display: grid;
    grid-template-columns: 200px 1fr auto;
    align-items: center;
    padding: 20px 0;
    border-top: 1px solid #e8e8e8;
    cursor: pointer;
    transition: background 0.2s;
    border-radius: 8px;
    padding-left: 8px;
    padding-right: 8px;
  }
  .service-row:last-child { border-bottom: 1px solid #e8e8e8; }
  .service-row:hover { background: #f9f9f9; }
  .service-tag {
    font-size: 0.78rem;
    color: var(--text-light);
    line-height: 1.5;
  }
  .service-name {
    font-family: var(--font-display);
    font-size: clamp(1.1rem, 2vw, 1.5rem);
    color: var(--black);
  }
  .service-arrow {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, border-color 0.2s;
    font-size: 1rem;
    color: var(--black);
  }
  .service-row:hover .service-arrow {
    background: var(--black);
    border-color: var(--black);
    color: #fff;
  }

  /* ── Testimonial ── */
  .testimonial-section {
    padding: 80px 5%;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
  }
  .testimonial-heading {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    text-align: center;
    margin-bottom: 3rem;
  }
  .testimonial-heading .underline-red {
    text-decoration: underline;
    text-decoration-color: var(--red-accent);
    text-underline-offset: 5px;
  }
  .testimonial-grid {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 32px;
    align-items: start;
  }
  .t-avatars-left, .t-avatars-right {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-top: 20px;
  }
  .t-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #fff;
    box-shadow: 0 3px 12px rgba(0,0,0,0.1);
    background: #e8e8e8;
  }
  .t-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .testimonial-card {
    background: #fff;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 40px rgba(0,0,0,0.07);
    position: relative;
  }
  .testimonial-card::before {
    content: '\201C';
    font-family: var(--font-display);
    font-size: 5rem;
    color: #eee;
    position: absolute;
    top: 8px;
    left: 20px;
    line-height: 1;
  }
  .testimonial-card::after {
    content: '\201D';
    font-family: var(--font-display);
    font-size: 5rem;
    color: #eee;
    position: absolute;
    bottom: -10px;
    right: 20px;
    line-height: 1;
  }
  .testimonial-text {
    font-size: 0.88rem;
    color: var(--text-body);
    line-height: 1.85;
    position: relative;
    z-index: 1;
  }
  .testimonial-author {
    margin-top: 1.4rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .author-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    overflow: hidden;
    background: #e8e8e8;
  }
  .author-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .author-name {
    font-weight: 600;
    font-size: 0.85rem;
  }
  .author-role {
    font-size: 0.78rem;
    color: var(--text-light);
  }

  /* ── Newsletter ── */
  .newsletter {
    background: var(--mint);
    padding: 80px 5%;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .newsletter-heading {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 3.2rem);
    line-height: 1.2;
    max-width: 500px;
    margin: 0 auto;
  }
  .newsletter-sub {
    font-size: 0.85rem;
    color: var(--text-light);
    margin-top: 1rem;
    max-width: 360px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.7;
  }
  .newsletter-btn {
    display: inline-block;
    margin-top: 2rem;
    background: var(--black);
    color: #fff;
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 0.82rem;
    letter-spacing: 0.06em;
    padding: 14px 36px;
    border-radius: 32px;
    border: none;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }
  .newsletter-btn:hover { background: #333; transform: translateY(-2px); }
  .nl-purple-leaf {
    position: absolute;
    right: 6%;
    top: 24px;
    width: 50px;
  }

  /* ── Footer ── */
  footer {
    background: #fff;
    padding: 60px 5% 32px;
    border-top: 1px solid #f0f0f0;
  }
  .footer-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .footer-col-title {
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--black);
    margin-bottom: 1.2rem;
  }
  .footer-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .footer-links a {
    font-size: 0.83rem;
    color: var(--text-light);
    text-decoration: none;
    transition: color 0.2s;
  }
  .footer-links a:hover { color: var(--black); }
  .footer-bottom {
    max-width: 1200px;
    margin: 40px auto 0;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
    text-align: center;
    font-size: 0.78rem;
    color: var(--text-light);
  }
  .footer-address {
    font-size: 0.82rem;
    color: var(--text-light);
    line-height: 1.8;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .nav-hamburger { display: flex; }
    .about-grid, .help-grid { grid-template-columns: 1fr; gap: 32px; }
    .help-grid .help-image-wrap { order: -1; }
    .help-image-wrap img { height: 280px; border-radius: 16px; }
    .testimonial-grid { grid-template-columns: 1fr; }
    .t-avatars-left, .t-avatars-right { flex-direction: row; flex-wrap: wrap; }
    .footer-grid { grid-template-columns: repeat(2, 1fr); }
    .service-row { grid-template-columns: 1fr auto; }
    .service-tag { display: none; }
    .avatar-cluster { gap: 10px; }
    .avatar-circle { width: 60px; height: 60px; }
    .avatar-circle-lg { width: 78px; height: 78px; }
  }
  @media (max-width: 480px) {
    .footer-grid { grid-template-columns: 1fr 1fr; }
  }
`;

// ── Placeholder image component using DiceBear avatars ──────────────────────
const Avatar = ({ seed, size = 80, className = "" }) => (
  <div
    className={`avatar-circle ${className}`}
    style={{ width: size, height: size }}
  >
    <img
      src={`https://api.dicebear.com/7.x/personas/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
      alt="team member"
    />
  </div>
);

// ── SVG decorations ──────────────────────────────────────────────────────────
const Squiggle = () => (
  <svg viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 5 Q50 30 10 55 Q50 80 10 105" stroke="#e63946" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
);
const PurpleLeaf = () => (
  <svg viewBox="0 0 52 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26 4 C50 4 50 40 26 76 C2 40 2 4 26 4Z" fill="#7b5ea7" opacity="0.85"/>
  </svg>
);
const SquiggleLine = () => (
  <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 30 Q20 10 40 30 Q60 50 75 30" stroke="#e63946" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);
const Arrow = () => <span style={{fontSize:"0.9rem"}}>→</span>;

// ── useReveal hook ───────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Elementum() {
  const [menuOpen, setMenuOpen] = useState(false);
  useReveal();

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* ── NAV ── */}
      <nav>
        <a href="#" className="nav-logo">Elementum</a>
        <ul className="nav-links">
          {["Home","About","Services","Contact","FAQ"].map(l => (
            <li key={l}><a href="#">{l}</a></li>
          ))}
        </ul>
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{background:"#fff",padding:"16px 5%",borderBottom:"1px solid #eee",display:"flex",flexDirection:"column",gap:"16px"}}>
          {["Home","About","Services","Contact","FAQ"].map(l => (
            <a key={l} href="#" style={{fontSize:"0.95rem",fontFamily:"var(--font-body)",color:"var(--black)",textDecoration:"none"}}>{l}</a>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <div style={{position:"relative", overflow:"hidden"}}>
        <section className="hero">
          <div className="blob-pink" />
          <div className="blob-squiggle-left"><Squiggle /></div>
          <div className="purple-leaf"><PurpleLeaf /></div>

          <h1 className="hero-headline reveal">
            The <span className="underline-red">thinkers</span> and<br/>
            doers were <span className="highlight-yellow">changing</span><br/>
            the <span className="underline-red">status</span> Quo with
          </h1>
          <p className="hero-subtitle reveal reveal-delay-1">
            We are a team of strategists, designers, communicators, researchers.
            Together, we believe that progress only happens when you refuse to
            play things safe.
          </p>

          {/* Avatar cluster */}
          <div className="avatar-cluster reveal reveal-delay-2">
            {["felix","mia","noah","zoe","raj","lena","omar","sara"].map((s, i) => (
              <Avatar key={s} seed={s} size={i === 0 || i === 4 ? 100 : 80} className={i === 0 || i === 4 ? "avatar-circle-lg" : ""} />
            ))}
          </div>
        </section>
      </div>

      {/* ── ABOUT — Tomorrow should be better ── */}
      <section className="section" style={{paddingTop:40}}>
        <div className="about-grid">
          <div className="reveal">
            <p className="about-label">About Us</p>
            <h2 className="about-heading">
              <span className="underline-red">Tomorrow</span> should<br/>
              be better than today
            </h2>
            <p className="about-body">
              We are a team of strategists, designers, communicators, researchers.
              Together, we believe that progress only happens when you refuse to
              play things safe.
            </p>
            <a href="#" className="read-more">Read more <Arrow /></a>
          </div>

          <div className="image-card reveal reveal-delay-2">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=640&q=80"
              alt="Team working together"
            />
            <div className="red-triangle" />
          </div>
        </div>
      </section>

      {/* ── HELP — See how we can help ── */}
      <section className="section">
        <div className="help-grid">
          <div className="help-image-wrap reveal">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=640&q=80"
              alt="Team collaborating"
            />
            <div className="squiggle-line"><SquiggleLine /></div>
            {/* Red triangle decoration */}
            <div style={{position:"absolute",bottom:-8,right:"15%",width:0,height:0,borderLeft:"40px solid transparent",borderRight:"40px solid transparent",borderBottom:"68px solid #e63946"}} />
          </div>

          <div className="reveal reveal-delay-1" style={{paddingLeft:"clamp(0px, 4vw, 48px)"}}>
            <h2 className="about-heading">
              See how we can<br/>
              <span style={{textDecoration:"underline",textDecorationColor:"var(--red-accent)",textUnderlineOffset:"5px"}}>help you</span> progress
            </h2>
            <p className="about-body">
              We add a layer of business insights and action that allows change
              digital, content and social research.
            </p>
            <a href="#" className="read-more">Read more <Arrow /></a>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section" style={{paddingTop:40}}>
        <h2 className="services-heading reveal">
          What we <span className="services-heading__underline" style={{textDecoration:"underline",textUnderlineOffset:"5px"}}>can</span><br/>
          <span style={{textDecoration:"underline",textUnderlineOffset:"5px"}}>offer</span> you!
        </h2>

        <div className="services-list">
          {[
            { tag: "Office of multiple\ninterest content",  name: "Colaborative & partnership" },
            { tag: "The hanger US Air force\ndigital experimental", name: "We talk about our weight" },
            { tag: "Delta faucet content,\nsocial, digital",      name: "Piloting digital confidence" },
          ].map(({ tag, name }, i) => (
            <div className={`service-row reveal reveal-delay-${i+1}`} key={name}>
              <span className="service-tag" style={{whiteSpace:"pre-line"}}>{tag}</span>
              <span className="service-name">{name}</span>
              <div className="service-arrow"><Arrow /></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="testimonial-section">
        <h2 className="testimonial-heading reveal">
          What our customer<br/>
          says <span className="underline-red">About Us</span>
        </h2>

        <div className="testimonial-grid reveal">
          <div className="t-avatars-left">
            {["alice","bob","carol"].map(s => (
              <div key={s} className="t-avatar">
                <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${s}&backgroundColor=b6e3f4,c0aede`} alt="reviewer" />
              </div>
            ))}
          </div>

          <div className="testimonial-card">
            <p className="testimonial-text">
              Elementum delivered the site inthe timeline as they requested. Inthe end, the client found a 50% increase in traffic with in days since its launch. They also had an impressive ability to use technologies that the company hadn't used, which have also proved to be easy to use and reliable.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img src="https://api.dicebear.com/7.x/personas/svg?seed=dan&backgroundColor=ffd5dc" alt="Dan" />
              </div>
              <div>
                <p className="author-name">Daniel Hernandez</p>
                <p className="author-role">CEO, Startup Co.</p>
              </div>
            </div>
          </div>

          <div className="t-avatars-right">
            {["emma","frank","grace"].map(s => (
              <div key={s} className="t-avatar">
                <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${s}&backgroundColor=d1d4f9,ffdfbf`} alt="reviewer" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <div className="newsletter">
        <div className="nl-purple-leaf"><PurpleLeaf /></div>
        <h2 className="newsletter-heading reveal">
          Subscribe to<br/>our newsletter
        </h2>
        <p className="newsletter-sub reveal reveal-delay-1">
          To make your site special and even more memorable
        </p>
        <button className="newsletter-btn reveal reveal-delay-2">Subscribe Now</button>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-grid">
          <div>
            <p className="footer-col-title">Company</p>
            <ul className="footer-links">
              {["Home","About","Studio","Services","Blog"].map(l => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
          <div>
            <p className="footer-col-title">Terms & Policies</p>
            <ul className="footer-links">
              {["Privacy Policy","Terms & Conditions","Support","Explore","Accessibility"].map(l => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
          <div>
            <p className="footer-col-title">Follow Us</p>
            <ul className="footer-links">
              {["Instagram","LinkedIn","YouTube","Twitter"].map(l => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
          <div>
            <p className="footer-col-title">Terms & Policies</p>
            <p className="footer-address">
              Jeffrey Fischer 418<br/>
              Pit Chicago IL 43687<br/><br/>
              (123) 456-789 999<br/>
              info@elementum.com
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          ©2022 Elementum · All rights reserved
        </div>
      </footer>
    </>
  );
}
