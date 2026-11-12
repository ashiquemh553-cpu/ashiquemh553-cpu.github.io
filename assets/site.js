const legacyRoutes = {
  '#work': '/portfolio/',
  '#about': '/about/',
  '#approach': '/about/#approach',
  '#contact': '/contact/',
};
if (location.pathname === '/' && Object.hasOwn(legacyRoutes, location.hash)) {
  location.replace(legacyRoutes[location.hash]);
}

const themeToggle = document.querySelector('.theme-toggle');
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#080808' : '#f0f0ee';
}
if (themeToggle) {
  applyTheme(document.documentElement.dataset.theme);
  themeToggle.hidden = false;
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try { localStorage.setItem('ashique-portfolio-theme', theme); } catch {}
  });
}

const clock = document.querySelector('.local-time');
if (clock) {
  const format = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true,
  });
  function updateClock() {
    clock.textContent = format.format(new Date()).toUpperCase();
    clock.dateTime = new Date().toISOString();
  }
  updateClock();
  setInterval(updateClock, 30000);
}

const title = document.querySelector('#home-title-text');
if (title) {
  const titleLayers = [title, document.querySelector('#home-title-frosted')].filter(Boolean);
  const defaultTitle = title.textContent;
  let titleTimeout;
  function showTitle(text) {
    clearTimeout(titleTimeout);
    if (title.textContent === text) {
      titleLayers.forEach(layer => layer.classList.remove('changing'));
      return;
    }
    titleLayers.forEach(layer => layer.classList.add('changing'));
    titleTimeout = setTimeout(() => {
      titleLayers.forEach(layer => {
        layer.textContent = text;
        layer.classList.remove('changing');
      });
    }, 110);
  }
  for (const tile of document.querySelectorAll('[data-home-title]')) {
    tile.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') showTitle(tile.dataset.homeTitle);
    });
    tile.addEventListener('pointerleave', () => {
      const focused = document.activeElement?.closest('[data-home-title]');
      showTitle(focused?.dataset.homeTitle || defaultTitle);
    });
    tile.addEventListener('focusin', () => showTitle(tile.dataset.homeTitle));
    tile.addEventListener('focusout', event => {
      const next = event.relatedTarget?.closest('[data-home-title]');
      showTitle(next?.dataset.homeTitle || defaultTitle);
    });
  }
}

// Progress is tied to the reader's scroll position and reverses when scrolling up.
// Keep ordinary, fully readable paragraphs when JavaScript or motion is disabled.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealBlocks = Array.from(document.querySelectorAll('[data-scroll-reveal]'));
if (revealBlocks.length) {
  const blocks = revealBlocks.map(element => {
    const words = [];
    for (const paragraph of element.querySelectorAll('p')) {
      const fragment = document.createDocumentFragment();
      for (const token of paragraph.textContent.split(/(\s+)/)) {
        if (!token) continue;
        if (/^\s+$/.test(token)) fragment.append(document.createTextNode(token));
        else {
          const word = document.createElement('span');
          word.className = 'reveal-word';
          word.textContent = token;
          words.push(word);
          fragment.append(word);
        }
      }
      paragraph.replaceChildren(fragment);
    }
    return { element, words };
  });
  let framePending = false;
  function updateReveal() {
    framePending = false;
    const height = window.innerHeight;
    for (const { element, words } of blocks) {
      const bounds = element.getBoundingClientRect();
      const progress = motionPreference.matches ? 1 : Math.max(0, Math.min(1,
        (height * .85 - bounds.top) / (bounds.height + height * .3)));
      const revealed = progress * (words.length + 3);
      words.forEach((word, index) => {
        const opacity = .18 + .82 * Math.max(0, Math.min(1, (revealed - index) / 3));
        word.style.opacity = opacity.toFixed(3);
      });
    }
  }
  function queueReveal() {
    if (!framePending) { framePending = true; requestAnimationFrame(updateReveal); }
  }
  window.addEventListener('scroll', queueReveal, { passive:true });
  window.addEventListener('resize', queueReveal);
  window.addEventListener('pageshow', queueReveal);
  motionPreference.addEventListener('change', queueReveal);
  document.fonts.ready.then(queueReveal);
  updateReveal();
}

const filters = document.querySelector('.filters');
if (filters) {
  const buttons = Array.from(filters.querySelectorAll('[data-filter]'));
  const grid = document.querySelector('.project-grid');
  const projects = Array.from(grid.querySelectorAll('[data-category]'));
  const status = document.querySelector('#filter-status');

  function selectFilter(category) {
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    for (const project of projects) project.hidden = category !== 'All' && project.dataset.category !== category;
    const count = projects.filter(project => !project.hidden).length;
    status.textContent = 'Showing ' + count + (count === 1 ? ' project.' : ' projects.');
  }

  const url = new URL(window.location.href);
  const initial = buttons.find(button => button.dataset.filter.toLowerCase() === url.searchParams.get('work'));
  selectFilter(initial?.dataset.filter || 'All');
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    const category = button.dataset.filter;
    selectFilter(category);
    const updated = new URL(window.location.href);
    if (category === 'All') updated.searchParams.delete('work');
    else updated.searchParams.set('work', category.toLowerCase());
    window.history.replaceState(null, '', updated);
  });
}

const tablist = document.querySelector('[data-workflow-tabs]');
if (tablist) {
  const tabs = Array.from(tablist.querySelectorAll('button'));
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  tablist.setAttribute('role', 'tablist');
  for (const [index, tab] of tabs.entries()) {
    tab.setAttribute('role', 'tab');
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
    tab.addEventListener('click', () => activate(index));
  }

  function activate(index, focus = false) {
    for (const [position, tab] of tabs.entries()) {
      const selected = position === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[position].hidden = !selected;
    }
    if (focus) tabs[index].focus();
  }

  tablist.addEventListener('keydown', event => {
    const index = tabs.indexOf(event.target);
    if (index < 0) return;
    const destinations = {
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!Object.hasOwn(destinations, event.key)) return;
    event.preventDefault();
    activate(destinations[event.key], true);
  });
  activate(0);
  tablist.hidden = false;
}

const copyButton = document.querySelector('[data-copy]');
if (copyButton && navigator.clipboard) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    const original = copyButton.innerHTML;
    try {
      await navigator.clipboard.writeText(copyButton.dataset.copy);
      copyButton.textContent = 'Email copied';
    } catch {
      copyButton.textContent = 'Select and copy the email above';
    }
    setTimeout(() => { copyButton.innerHTML = original; }, 2000);
  });
}

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.hidden = false;
  const result = contactForm.querySelector('.draft-result');
  const draft = document.querySelector('#open-email-draft');
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const values = new FormData(contactForm);
    const name = String(values.get('name')).trim();
    const email = String(values.get('email')).trim();
    const message = String(values.get('message')).trim();
    const topic = String(values.get('topic'));
    const subject = topic + ' - ' + name;
    const body = 'Hi Ashique,\n\n' + message + '\n\n' + name + '\n' + email;
    draft.href = 'mailto:' + contactForm.dataset.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    result.hidden = false;
    draft.focus();
  });
  contactForm.addEventListener('input', () => { result.hidden = true; });
}
