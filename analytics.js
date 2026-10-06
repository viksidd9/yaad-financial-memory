(() => {
  const namespace = 'yaad-financial-memory-viksidd9';
  const expectedHost = 'viksidd9.github.io';
  const ignoreKey = 'yaad_analytics_ignore';
  const params = new URLSearchParams(window.location.search);

  // One-time owner/privacy switches. They run before any tracking.
  if (params.get('analytics_ignore') === '1') {
    localStorage.setItem(ignoreKey, '1');
    params.delete('analytics_ignore');
    const q = params.toString();
    history.replaceState(null, '', window.location.pathname + (q ? '?' + q : '') + window.location.hash);
    return;
  }
  if (params.get('analytics_include') === '1') {
    localStorage.removeItem(ignoreKey);
    params.delete('analytics_include');
    const q = params.toString();
    history.replaceState(null, '', window.location.pathname + (q ? '?' + q : '') + window.location.hash);
  }

  const isProduction = window.location.hostname === expectedHost &&
    window.location.pathname.startsWith('/yaad-financial-memory');
  const ignored = localStorage.getItem(ignoreKey) === '1';
  const dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1';

  if (!isProduction || ignored || dnt) return;

  const base = 'https://counterapi.com/api/' + encodeURIComponent(namespace);
  const hit = (action, key) => {
    const img = new Image();
    img.width = 1;
    img.height = 1;
    img.alt = '';
    img.referrerPolicy = 'strict-origin-when-cross-origin';
    img.src = base + '/' + encodeURIComponent(action) + '/' + encodeURIComponent(key) + '?trackOnly=true&t=' + Date.now();
  };

  const pageKey = window.location.pathname.includes('/mockups') ? 'mockups' : 'landing';
  hit('view', pageKey);

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a,button');
    if (!link) return;
    const text = (link.textContent || '').trim().toLowerCase();
    const href = link.getAttribute('href') || '';
    let key = null;

    if (text.includes('see every human interaction') || href.includes('/mockups')) key = 'human-interactions';
    else if (text.includes('join the first 1,000')) key = 'join-first-1000';
    else if (text.includes('remember my month')) key = 'remember-my-month';

    if (key) {
      const action = 'cta';
      hit(action, key);
    }
  }, { passive: true });

  const joinForm = document.querySelector('.joinform');
  if (joinForm) {
    joinForm.addEventListener('submit', () => hit('cta', 'join-pilot'));
  }
})();
