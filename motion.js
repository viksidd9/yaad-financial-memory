const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');
const mobile = () => window.innerWidth <= 800;

document.documentElement.classList.add('js-enhanced');

function setupReveals() {
  const items = [...document.querySelectorAll('[data-reveal]')];
  if (!items.length) return;
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  items.forEach((el, index) => {
    el.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
    observer.observe(el);
  });
}

function setupTilt() {
  const elements = [...document.querySelectorAll('[data-tilt]')];
  const reset = el => {
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
    el.style.setProperty('--glow-x', '50%');
    el.style.setProperty('--glow-y', '50%');
  };
  const bind = el => {
    reset(el);
    el.addEventListener('pointermove', event => {
      if (reduceMotion.matches || !finePointer.matches || mobile()) return reset(el);
      const rect = el.getBoundingClientRect();
      const nx = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const ny = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      const ry = (nx - 0.5) * 8;
      const rx = (0.5 - ny) * 8;
      el.style.setProperty('--tilt-x', `${rx.toFixed(2)}deg`);
      el.style.setProperty('--tilt-y', `${ry.toFixed(2)}deg`);
      el.style.setProperty('--glow-x', `${(nx * 100).toFixed(1)}%`);
      el.style.setProperty('--glow-y', `${(ny * 100).toFixed(1)}%`);
    }, { passive: true });
    el.addEventListener('pointerleave', () => reset(el), { passive: true });
  };
  elements.forEach(bind);
}

function applyDepth() {
  document.querySelectorAll('[data-depth]').forEach(el => {
    const depth = Number(el.dataset.depth || 1);
    el.style.setProperty('--depth', `${Math.min(5, Math.max(0, depth))}`);
  });
}

function onMotionPreference() {
  if (reduceMotion.matches) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
    document.querySelectorAll('[data-tilt]').forEach(el => {
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    });
  }
}

applyDepth();
setupReveals();
setupTilt();
reduceMotion.addEventListener?.('change', onMotionPreference);
