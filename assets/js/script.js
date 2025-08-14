// let scrollPercentage = () => {
//     let scrollProgress = document.getElementById("progress");
//     let progressValue = document.getElementById("progress-value");
//     let pos = document.documentElement.scrollTop;
//     let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
//     let scrollValue = Math.round( pos * 100 / calcHeight);

//     scrollProgress.style.background = `conic-gradient(#008fff ${scrollValue}%, rgba(255, 255, 255, 0.2) ${scrollValue}%)`;
//     progressValue.textContent = `${scrollValue}%`;
// }

// window.onscroll = scrollPercentage;
// window.onload = scrollPercentage;

// contactBtn.addEventListener('click',()=>{
//     window.scrollTo(0,document.body.scrollHeight);
// })
// Navbar ScrollSpy
let sections = document.querySelectorAll('.page-scroll');
let navLinks = document.querySelectorAll('header ul li a');
let temp = sections[sections.length - 1];

sections.forEach(section => {
    section.addEventListener('click', () => {
        let id = section.getAttribute('id');
        navLinks.forEach(links => {
            links.classList.remove('active');
            document.querySelector('.page[href*=' + id + ']').classList.add('active');
        })
    })
})

window.onscroll = () => {

    sections.forEach(section => {

        let top = window.scrollY;
        let offset = section.offsetTop;
        let height = section.offsetHeight;
        let id = section.getAttribute('id');
        let viewportHeight = window.innerHeight;
        let viewportWidth = window.innerWidth;
        let scrollheight = document.body.scrollHeight;
        if (top + viewportHeight / 2 >= offset && top < offset + height) {
            flg = 1;
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('.page[href*=' + id + ']').classList.add('active');
            })
        }
        if (top < 100) {
            let id = "top";
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('.page[href*=' + id + ']').classList.add('active');
            })
        }

        if (viewportWidth < 900) {
            if ((top + viewportHeight - scrollheight <= viewportWidth / 10 && top + viewportHeight - scrollheight > 0) || (scrollheight - top - viewportHeight <= viewportWidth / 10 && scrollheight - top - viewportHeight > 0)) {
                let id = "contact";
                navLinks.forEach(links => {
                    links.classList.remove('active');
                    document.querySelector('.page[href*=' + id + ']').classList.add('active');
                })

            }
        }

    })

}

// Tradutor VVV
document.addEventListener('DOMContentLoaded', () => {
  const LANG_STORAGE_KEY = 'site_lang';
  const DEFAULT_LANG = 'br';
  const HTML_LANG_MAP = { br: 'pt-BR', en: 'en', es: 'es', de: 'de', ru: 'ru' };

  const flagRoot   = document.querySelector('.flag-select');
  const flagList   = flagRoot?.querySelector('.flag-list');
  const flagNative = flagRoot?.querySelector('.flag-native');
  const flagBtn    = flagRoot?.querySelector('.flag-btn');

  const get = (obj, path) => path.split('.').reduce((o, p) => (o && p in o ? o[p] : undefined), obj);

  function applyTranslations(dict) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = get(dict, key);
      if (typeof val === 'string') el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const attrs = (el.getAttribute('data-i18n-attr') || '')
        .split(',').map(s => s.trim()).filter(Boolean);
      const val = get(dict, key);
      if (typeof val !== 'string') return;
      attrs.forEach(attr => el.setAttribute(attr, val));
    });
  }

  function reflectSelection(code) {
    const li = flagList?.querySelector(`.flag-option[data-value="${code}"]`);
    if (!li || !flagBtn) return;
    const imgSrc = li.querySelector('img')?.getAttribute('src') || '';
    const text   = li.querySelector('span')?.textContent || '';
    flagBtn.querySelector('img.flag-ico')?.setAttribute('src', imgSrc);
    const label = flagBtn.querySelector('.flag-label');
    if (label) label.textContent = text;
    flagList?.querySelectorAll('.flag-option[aria-selected="true"]').forEach(x => x.setAttribute('aria-selected','false'));
    li.setAttribute('aria-selected','true');
    if (flagNative) flagNative.value = code;
  }

  async function setLanguage(code, { persist = true } = {}) {
    try {
      const url = `assets/json/i18n/${code}.json`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Falha ao carregar ${url}`);
      const dict = await res.json();

      document.documentElement.setAttribute('lang', HTML_LANG_MAP[code] || code);
      applyTranslations(dict);
      reflectSelection(code);
      if (persist) localStorage.setItem(LANG_STORAGE_KEY, code);
    } catch (e) {
      console.error('Erro ao aplicar idioma', code, e);
    }
  }

  flagList?.addEventListener('click', (e) => {
    const li = e.target.closest('.flag-option');
    if (!li) return;
    const code = li.getAttribute('data-value');
    if (code) setLanguage(code);
  });

  flagNative?.addEventListener('change', (e) => setLanguage(e.target.value));

  const initial = (() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved) return saved;
    const qp = new URLSearchParams(location.search).get('lang');
    if (qp) return qp;
    const nav = (navigator.language || '').toLowerCase();
    if (nav.startsWith('br')) return 'br';
    if (nav.startsWith('en')) return 'en';
    if (nav.startsWith('es')) return 'es';
    if (nav.startsWith('de')) return 'de';
    if (nav.startsWith('ru')) return 'ru';
    return DEFAULT_LANG;
  })();

  window.I18N = { setLanguage };
  setLanguage(initial, { persist: false });
});