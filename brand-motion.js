const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');

function installProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<i></i>';
  document.body.appendChild(bar);

  const update = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const pct = Math.max(0, Math.min(100, scrollY / max * 100));
    document.documentElement.style.setProperty('--scroll-progress', pct.toFixed(2) + '%');
    document.querySelector('.nav')?.classList.toggle('is-scrolled', scrollY > 28);
  };
  update();
  addEventListener('scroll', update, {passive:true});
  addEventListener('resize', update, {passive:true});
}

function installPointerGlow() {
  if (!finePointer.matches || reduced.matches) return;
  addEventListener('pointermove', event => {
    document.documentElement.style.setProperty('--pointer-x', (event.clientX / innerWidth * 100).toFixed(1) + '%');
    document.documentElement.style.setProperty('--pointer-y', (event.clientY / innerHeight * 100).toFixed(1) + '%');
  }, {passive:true});
}

function installSectionState() {
  const bands = [...document.querySelectorAll('.band, .judge-section, .interaction-library-head')];
  if (!('IntersectionObserver' in window)) {
    bands.forEach(el => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting));
  }, {threshold:.14, rootMargin:'-8% 0px -28% 0px'});
  bands.forEach(el => io.observe(el));
}

function installStoryRail() {
  const links = [...document.querySelectorAll('.story-rail a[href^="#"]')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const map = new Map(links.map(link => [link.getAttribute('href').slice(1), link]));
  const targets = [...map.keys()].map(id => document.getElementById(id)).filter(Boolean);
  const io = new IntersectionObserver(entries => {
    const visible = entries.filter(x => x.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach(link => link.classList.remove('is-active'));
    map.get(visible.target.id)?.classList.add('is-active');
  }, {threshold:[.2,.45,.7], rootMargin:'-22% 0px -48% 0px'});
  targets.forEach(el => io.observe(el));
}

function installHeroParallax() {
  const hero = document.querySelector('.hero-visual, .mock-memory-panel');
  if (!hero || reduced.matches || !finePointer.matches) return;

  let targetX = 0, targetY = 0, x = 0, y = 0, raf = 0;
  const tick = () => {
    x += (targetX - x) * .07;
    y += (targetY - y) * .07;
    hero.style.setProperty('--brand-parallax-x', x.toFixed(2) + 'px');
    hero.style.setProperty('--brand-parallax-y', y.toFixed(2) + 'px');
    hero.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
    raf = requestAnimationFrame(tick);
  };
  addEventListener('pointermove', e => {
    targetX = (e.clientX / innerWidth - .5) * 12;
    targetY = (e.clientY / innerHeight - .5) * 9;
  }, {passive:true});
  addEventListener('pointerleave', () => { targetX = 0; targetY = 0; }, {passive:true});
  raf = requestAnimationFrame(tick);
  reduced.addEventListener?.('change', () => {
    if (reduced.matches) {
      cancelAnimationFrame(raf);
      hero.style.transform = '';
    }
  });
}

installProgress();
installPointerGlow();
installSectionState();
installStoryRail();
installHeroParallax();
