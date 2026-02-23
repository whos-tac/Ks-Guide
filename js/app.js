/* ─────────────────────────────────────────────
   GPO Fishing Macro Guide — app.js
   Vanilla JS, no dependencies, no build step.
───────────────────────────────────────────── */

// ── SVG icon strings ──────────────────────────────────────────────────────────
const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>`,
  setup: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="20" x2="20" y2="4"/><circle cx="20" cy="4" r="1.3" fill="currentColor" stroke="none"/><path d="M20 4 C22 9,22 14,19 17" stroke-dasharray="2 1.5"/><path d="M19 17 C17 19,16 21,17.5 22 C19 23,21 21,20 19"/></svg>`,
  'auto-craft': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4l5 5-9.5 9.5-5-5z"/><line x1="2" y1="22" x2="8.5" y2="15.5"/><path d="M15 4 C15 4,17 2,19 3" stroke-width="2.5"/></svg>`,
  'auto-buy': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  'auto-store': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  'auto-select': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>`,
  step: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
};

// ── Section definitions ──────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'setup',
    label: 'Setup',
    slides: ['Step 1 – Launch & Configure', 'Step 2 – Assign Hotkey Slots'],
  },
  {
    id: 'auto-craft',
    label: 'Auto Craft',
    slides: [
      'Position Setup', 'Configure Left Dialog', 'Configure Middle Dialog',
      'Configure Add Ingredient', 'Configure Top Recipe Slot', 'Configure Craft Button',
      'Configure Craft Selected', 'Configure Menu Close', 'Add and Configure Recipes', 'Add Recipe',
    ],
  },
  {
    id: 'auto-buy',
    label: 'Auto Buy',
    slides: ['Position Setup', 'Configure Left Dialog', 'Configure Middle Dialog', 'Configure Right Dialog'],
  },
  {
    id: 'auto-store',
    label: 'Auto Store',
    slides: ['Set up the store location'],
  },
  {
    id: 'auto-select',
    label: 'Auto Select',
    slides: ['Enable Auto Select'],
  },
];

// ── State ─────────────────────────────────────────────────────────────────────
let activeView = 'home';
const slideIndex = {};
SECTIONS.forEach(s => { slideIndex[s.id] = 0; });

// ── DOM refs ──────────────────────────────────────────────────────────────────
const topbarNav = document.getElementById('topbarNav');
const subNav    = document.getElementById('subNav');
const main      = document.getElementById('mainContent');

// ── Top bar builder ───────────────────────────────────────────────────────────
function buildTopbar() {
  topbarNav.innerHTML = '';

  // Home
  const homeBtn = makeNavBtn('home', 'Home');
  homeBtn.classList.toggle('active', activeView === 'home');
  homeBtn.addEventListener('click', () => navigateTo('home'));
  topbarNav.appendChild(homeBtn);

  // Sections
  SECTIONS.forEach(section => {
    const btn = makeNavBtn(section.id, section.label);
    btn.classList.toggle('active', activeView === section.id);
    btn.addEventListener('click', () => navigateTo(section.id));
    topbarNav.appendChild(btn);
  });
}

function makeNavBtn(id, label) {
  const btn = document.createElement('button');
  btn.className = 'topnav-btn';
  btn.dataset.id = id;
  btn.innerHTML = `<span class="topnav-icon">${ICONS[id] || ''}</span><span class="topnav-label">${label}</span>`;
  return btn;
}

// ── Sub-nav builder (step pills shown when a section is active) ───────────────
function buildSubnav() {
  subNav.innerHTML = '';
  if (activeView === 'home') {
    subNav.classList.remove('visible');
    return;
  }
  const section = SECTIONS.find(s => s.id === activeView);
  if (!section) { subNav.classList.remove('visible'); return; }

  subNav.classList.add('visible');

  section.slides.forEach((title, idx) => {
    const btn = document.createElement('button');
    btn.className = 'subnav-btn';
    btn.classList.toggle('active', slideIndex[section.id] === idx);
    btn.innerHTML = `<span class="subnav-num">${String(idx + 1).padStart(2, '0')}</span><span class="subnav-label">${title}</span>`;
    btn.addEventListener('click', () => {
      goToSlide(section.id, idx);
    });
    subNav.appendChild(btn);
  });
}


// ── Navigation ────────────────────────────────────────────────────────────────
function navigateTo(id) {
  main.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + id);
  if (target) target.classList.add('active');
  activeView = id;
  buildTopbar();
  buildSubnav();
}

// ── Slideshow logic ───────────────────────────────────────────────────────────
function goToSlide(sectionId, index) {
  const wrap = document.getElementById('ss-' + sectionId);
  if (!wrap) return;

  const slides = wrap.querySelectorAll('.slide');
  const dots   = wrap.querySelectorAll('.slide-dot');
  const total  = slides.length;

  index = ((index % total) + total) % total;
  slideIndex[sectionId] = index;

  slides.forEach((s, i) => s.classList.toggle('visible', i === index));
  dots.forEach((d, i)   => d.classList.toggle('active',  i === index));

  if (activeView === sectionId) buildSubnav();
}

function bindSlideshow(sectionId) {
  const wrap = document.getElementById('ss-' + sectionId);
  if (!wrap) return;

  wrap.querySelector('.slide-arrow.prev').addEventListener('click', () =>
    goToSlide(sectionId, slideIndex[sectionId] - 1));
  wrap.querySelector('.slide-arrow.next').addEventListener('click', () =>
    goToSlide(sectionId, slideIndex[sectionId] + 1));
  wrap.querySelectorAll('.slide-dot').forEach(dot => {
    dot.addEventListener('click', () =>
      goToSlide(sectionId, parseInt(dot.dataset.dot, 10)));
  });

  wrap.querySelector('.slideshow-viewport').setAttribute('tabindex', '0');
  wrap.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goToSlide(sectionId, slideIndex[sectionId] - 1);
    if (e.key === 'ArrowRight') goToSlide(sectionId, slideIndex[sectionId] + 1);
  });
}

// ── Image fallback ────────────────────────────────────────────────────────────
window.imgFallback = function imgFallback(img, title) {
  const slide = img.closest('.slide');
  img.remove();
  const fb = document.createElement('div');
  fb.className = 'img-fallback';
  fb.innerHTML = `
    <div class="img-fallback-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
    <div class="img-fallback-label">Image not available</div>
    ${title ? `<div class="img-fallback-title">${title}</div>` : ''}
  `;
  slide.insertBefore(fb, slide.firstChild);
};

// ── Welcome card clicks ───────────────────────────────────────────────────────
document.querySelectorAll('.welcome-card[data-target]').forEach(card => {
  card.addEventListener('click', () => navigateTo(card.dataset.target));
});

// ── Global keyboard nav ───────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (activeView === 'home') return;
  if (e.key === 'ArrowLeft')  goToSlide(activeView, slideIndex[activeView] - 1);
  if (e.key === 'ArrowRight') goToSlide(activeView, slideIndex[activeView] + 1);
});

// ── Init ──────────────────────────────────────────────────────────────────────
buildTopbar();
buildSubnav();
SECTIONS.forEach(s => bindSlideshow(s.id));

