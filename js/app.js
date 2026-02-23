/* ─────────────────────────────────────────────
   GPO Fishing Macro Guide — app.js
   Vanilla JS, no dependencies, no build step.
───────────────────────────────────────────── */

// ── Section definitions ──────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'setup',
    label: 'Setup',
    icon: '🎣',
    slides: [
      'Step 1 – Launch & Configure',
      'Step 2 – Assign Hotkey Slots',
    ],
  },
  {
    id: 'auto-craft',
    label: 'Auto Craft',
    icon: '⚒️',
    slides: [
      'Position Setup',
      'Configure Left Dialog',
      'Configure Middle Dialog',
      'Configure Add Ingredient',
      'Configure Top Recipe Slot',
      'Configure Craft Button',
      'Configure Craft Selected',
      'Configure Menu Close',
      'Add and Configure Recipes',
      'Add Recipe',
    ],
  },
  {
    id: 'auto-buy',
    label: 'Auto Buy',
    icon: '🛒',
    slides: [
      'Position Setup',
      'Configure Left Dialog',
      'Configure Middle Dialog',
      'Configure Right Dialog',
    ],
  },
  {
    id: 'auto-store',
    label: 'Auto Store',
    icon: '📦',
    slides: ['Set up the store location'],
  },
  {
    id: 'auto-select',
    label: 'Auto Select',
    icon: '🎯',
    slides: ['Enable Auto Select'],
  },
];

// ── State ─────────────────────────────────────────────────────────────────────
let activeView = 'home';
let expandedSection = null;               // id of the open section, or null
const slideIndex = {};                    // { sectionId: currentIndex }

SECTIONS.forEach(s => { slideIndex[s.id] = 0; });

// ── DOM refs ──────────────────────────────────────────────────────────────────
const nav = document.getElementById('sidebarNav');
const main = document.getElementById('mainContent');

// ── Sidebar builder ───────────────────────────────────────────────────────────
function buildSidebar() {
  nav.innerHTML = '';

  // Home button
  const homeBtn = makeNavBtn('home', '🏠', 'Home', false, 0);
  homeBtn.classList.toggle('active', activeView === 'home');
  homeBtn.addEventListener('click', () => navigateTo('home'));
  nav.appendChild(homeBtn);

  // Section buttons + sub-items
  SECTIONS.forEach(section => {
    const isOpen = expandedSection === section.id;
    const isActive = activeView === section.id;

    const btn = makeNavBtn(section.id, section.icon, section.label, true, 0);
    btn.classList.toggle('active', isActive && !isOpen);
    btn.classList.toggle('nav-btn-expanded', isOpen);

    // Chevron
    const chevron = document.createElement('span');
    chevron.className = 'nav-chevron';
    chevron.textContent = isOpen ? '▾' : '›';
    btn.appendChild(chevron);

    btn.addEventListener('click', () => toggleSection(section.id));
    nav.appendChild(btn);

    // Sub-items (slide titles)
    if (isOpen) {
      const subList = document.createElement('div');
      subList.className = 'nav-sub-list';

      // "Overview" sub-item → shows the section view at slide 0
      section.slides.forEach((title, idx) => {
        const sub = makeNavBtn(section.id + '-' + idx, null, title, false, 1);
        sub.classList.toggle('active', activeView === section.id && slideIndex[section.id] === idx);
        sub.addEventListener('click', () => {
          goToSlide(section.id, idx);
          navigateTo(section.id);
        });
        subList.appendChild(sub);
      });

      nav.appendChild(subList);
    }
  });
}

function makeNavBtn(id, icon, label, hasChevron, depth) {
  const btn = document.createElement('button');
  btn.className = 'nav-btn' + (depth > 0 ? ' nav-sub-btn' : '');
  btn.dataset.id = id;

  if (icon) {
    const ico = document.createElement('span');
    ico.className = 'nav-icon';
    ico.textContent = icon;
    btn.appendChild(ico);
  } else {
    // step number badge for sub-items
    const num = document.createElement('span');
    num.className = 'nav-sub-num';
    // extract index from id like "setup-0"
    const parts = id.split('-');
    const n = parseInt(parts[parts.length - 1], 10);
    num.textContent = String(n + 1).padStart(2, '0');
    btn.appendChild(num);
  }

  const txt = document.createElement('span');
  txt.className = 'nav-label';
  txt.textContent = label;
  btn.appendChild(txt);

  return btn;
}

// ── Navigation ────────────────────────────────────────────────────────────────
function navigateTo(id) {
  // deactivate all views
  main.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + id);
  if (target) target.classList.add('active');
  activeView = id;
  buildSidebar();
}

function toggleSection(id) {
  if (expandedSection === id) {
    expandedSection = null;
  } else {
    expandedSection = id;
    navigateTo(id);
    return; // navigateTo calls buildSidebar
  }
  buildSidebar();
}

// ── Slideshow logic ───────────────────────────────────────────────────────────
function goToSlide(sectionId, index) {
  const wrap = document.getElementById('ss-' + sectionId);
  if (!wrap) return;

  const slides = wrap.querySelectorAll('.slide');
  const dots   = wrap.querySelectorAll('.slide-dot');
  const total  = slides.length;

  // clamp
  index = ((index % total) + total) % total;
  slideIndex[sectionId] = index;

  slides.forEach((s, i) => s.classList.toggle('visible', i === index));
  dots.forEach((d, i)   => d.classList.toggle('active',  i === index));

  // keep sidebar sub-item highlight in sync when already on this view
  if (activeView === sectionId) buildSidebar();
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

  // keyboard arrows when viewport is hovered / focused
  wrap.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goToSlide(sectionId, slideIndex[sectionId] - 1);
    if (e.key === 'ArrowRight') goToSlide(sectionId, slideIndex[sectionId] + 1);
  });
  wrap.querySelector('.slideshow-viewport').setAttribute('tabindex', '0');
}

// ── Image fallback ────────────────────────────────────────────────────────────
window.imgFallback = function imgFallback(img, title) {
  const slide = img.closest('.slide');
  img.remove();
  const fb = document.createElement('div');
  fb.className = 'img-fallback';
  fb.innerHTML = `
    <div class="img-fallback-icon">🖼️</div>
    <div class="img-fallback-label">Image not available</div>
    ${title ? `<div class="img-fallback-title">${title}</div>` : ''}
  `;
  slide.insertBefore(fb, slide.firstChild);
};

// ── Welcome card clicks ───────────────────────────────────────────────────────
document.querySelectorAll('.welcome-card[data-target]').forEach(card => {
  card.addEventListener('click', () => {
    const id = card.dataset.target;
    expandedSection = id;
    navigateTo(id);
  });
});

// ── Global keyboard nav (arrow keys) ─────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (activeView === 'home') return;
  const section = SECTIONS.find(s => s.id === activeView);
  if (!section) return;
  if (e.key === 'ArrowLeft')  goToSlide(activeView, slideIndex[activeView] - 1);
  if (e.key === 'ArrowRight') goToSlide(activeView, slideIndex[activeView] + 1);
});

// ── Init ──────────────────────────────────────────────────────────────────────
buildSidebar();
SECTIONS.forEach(s => bindSlideshow(s.id));

