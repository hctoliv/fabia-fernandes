(() => {
  const WA = '5511951201170';
  const SITE = 'https://fabiafernandesinvestimentosimobiliarios.com/imovel/';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const root = document.documentElement;
  const mobile = () => innerWidth <= 900;

  /* ---------- intro (uma vez por sessão; ?intro repete) ---------- */
  const intro = $('#intro');
  let seen = false;
  try { seen = sessionStorage.getItem('ff-intro') === '1'; } catch (e) {}
  if (location.search.includes('intro')) seen = false;
  const ready = () => root.classList.add('is-ready');
  if (!seen && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('intro-on');
    const out = () => {
      if (intro.classList.contains('is-out')) return;
      intro.classList.add('is-out');
      setTimeout(ready, 350);
      setTimeout(() => root.classList.remove('intro-on'), 1300);
      try { sessionStorage.setItem('ff-intro', '1'); } catch (e) {}
    };
    setTimeout(out, 2500);
    intro.addEventListener('click', out);
    addEventListener('keydown', out, { once: true });
  } else {
    ready();
  }

  /* ---------- header ---------- */
  const hd = $('#hd');
  const zones = $$('[data-hd]');
  let lastY = 0;
  $('#menuBtn').addEventListener('click', () => {
    const open = root.classList.toggle('menu-open');
    $('#menuBtn').setAttribute('aria-expanded', open);
  });
  $$('#nav a').forEach(a => a.addEventListener('click', () => root.classList.remove('menu-open')));

  /* ---------- hero: janela em arco abre para o lounge ---------- */
  const hero = $('#hero'), win = $('#heroWin'), reveal = $('#heroReveal'), copy = $('.hero__copy'), ghost = $('.hero__ghost');
  const floorNum = $('#floorNum');
  let floor = 1;
  setInterval(() => {
    if (scrollY > innerHeight) return;
    floor = floor >= 33 ? 1 : floor + 1;
    floorNum.textContent = String(floor).padStart(2, '0');
  }, 420);

  function heroFrame() {
    const r = hero.getBoundingClientRect();
    const total = hero.offsetHeight - innerHeight;
    const p = clamp(-r.top / total);
    const e = ease(clamp((p - 0.08) / 0.62));
    const vw = innerWidth, vh = innerHeight;
    let w0, h0;
    if (mobile()) { w0 = Math.min(vw * 0.58, 300); h0 = Math.min(vh * 0.40, 400); }
    else { w0 = Math.min(vw * 0.30, 420); h0 = Math.min(vh * 0.78, 640); }
    win.style.setProperty('--w', lerp(w0, vw, e) + 'px');
    win.style.setProperty('--h', lerp(h0, vh, e) + 'px');
    const R = lerp(Math.max(w0, 300), 0, e);
    win.style.setProperty('--r', `${R}px ${R}px 0 0`);
    if (mobile()) {
      win.style.top = lerp(86, 0, e) + 'px';
    } else {
      const startRight = parseFloat(getComputedStyle(root).getPropertyValue('--pad')) || 72;
      win.style.right = lerp(startRight + vw * 0.04, 0, e) + 'px';
    }
    win.style.setProperty('--op', clamp((e - 0.35) / 0.4));
    win.style.setProperty('--os', lerp(1.12, 1, e));
    win.style.setProperty('--fo', 1 - clamp(e * 2.5));
    copy.style.opacity = 1 - clamp(e * 2.2);
    copy.style.translate = `${-e * 80}px 0`;
    ghost.style.translate = `0 ${p * -120}px`;
    hero.style.setProperty('--so', 1 - clamp(p * 6));
    reveal.classList.toggle('on', e > 0.92);
  }

  // parallax leve no ponteiro
  if (matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', ev => {
      if (scrollY > innerHeight * 0.3) return;
      const x = ev.clientX / innerWidth - 0.5, y = ev.clientY / innerHeight - 0.5;
      $('.hero__frame').style.transform = `translate(${x * -14}px, ${y * -10}px)`;
      ghost.style.transform = `translateY(-50%) translate(${x * 30}px, ${y * 20}px)`;
    });
  }

  /* ---------- manifesto palavra a palavra ---------- */
  const mani = $('#maniText');
  mani.innerHTML = mani.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span> `).join('');
  const words = $$('.w', mani);
  function maniFrame() {
    const r = mani.getBoundingClientRect();
    const p = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35));
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  }

  /* ---------- elevador ---------- */
  const SCENES = [
    { slug: 'naeem', img: 'img/andar-naeem.jpg', name: 'Naeem', by: 'Mitre', b: 'Pinheiros', fact: 'Um terreno raro de 5.000 m², a poucos passos da Oscar Freire. Arquitetura Königsberger Vannucchi, paisagismo de Benedito Abbud.', meta: [['139 a 358 m²', 'Área'], ['3 a 4', 'Dormitórios'], ['R$ 2.484.000', 'A partir de']] },
    { slug: 'daslu-residences-sao-paulo', img: 'img/andar-daslu.jpg', name: 'Daslu Residences', by: 'Mitre', b: 'Jardins', fact: 'O primeiro residencial com a assinatura Daslu, na esquina da Rua Chabad com a Gabriel Monteiro da Silva.', meta: [['114,8 m²', 'Área'], ['2 suítes', 'Dormitórios'], ['Sob consulta', 'Valor']] },
    { slug: 'la-galerie', img: 'img/andar-galerie.jpg', name: 'La Galerie', by: 'Cyrela', b: 'Moema', fact: 'Na Av. Sabiá, com plantas de 283 a 416 m² e quatro suítes. Entrega prevista para fevereiro de 2030.', meta: [['283 a 416 m²', 'Área'], ['4 suítes', 'Dormitórios'], ['R$ 8.686.000', 'A partir de']] },
    { slug: 'cyrela-rua-do-livramento-18', img: 'img/andar-portrait.jpg', name: 'Portrait', by: 'Cyrela', b: 'Parque do Ibirapuera', fact: 'Na Rua do Livramento, de frente para o verde do Ibirapuera. Entrega prevista para abril de 2028.', meta: [['232 a 272 m²', 'Área'], ['4 suítes', 'Dormitórios'], ['R$ 8.074.000', 'A partir de']] },
    { slug: 'hay-itaim-mpp1e', img: 'img/imoveis/18.jpg', name: 'Hay Itaim', by: 'Itaim Bibi', b: 'Itaim Bibi', fact: 'Três suítes e três vagas em 292 m², no coração do Itaim.', meta: [['292 m²', 'Área'], ['3 suítes', 'Dormitórios'], ['R$ 16.000.000', 'A partir de']] },
    { slug: 'cyrela-av-lopes-de-azevedo-46', img: 'img/imoveis/34.jpg', name: 'Vista Cyrela', by: 'Torre Venezia', b: 'Jardim Guedala', fact: 'Cyrela e J.Safra no primeiro residencial de 200 metros de altura de São Paulo.', meta: [['464 a 695 m²', 'Área'], ['4 suítes', 'Dormitórios'], ['R$ 24.055.000', 'A partir de']] }
  ];
  const lift = $('#andares'), liftImgs = $('#liftImgs'), liftInfo = $('#liftInfo'), liftBtns = $('#liftBtns');
  lift.style.height = (SCENES.length * 90 + 40) + 'vh';
  SCENES.forEach((s, i) => {
    liftImgs.insertAdjacentHTML('beforeend', `<div class="lift__img"><img src="${s.img}" alt="${s.name}, ${s.b}" ${i > 1 ? 'loading="lazy"' : ''}></div>`);
    liftInfo.insertAdjacentHTML('beforeend', `<article class="lift__card">
      <p class="eyebrow"><span>${String(i + 1).padStart(2, '0')} / ${String(SCENES.length).padStart(2, '0')}</span><span>${s.b}</span></p>
      <h3 class="lift__name">${s.name} <em>${s.by}</em></h3>
      <p class="lift__fact">${s.fact}</p>
      <div class="lift__meta">${s.meta.map(m => `<span><b>${m[0]}</b>${m[1]}</span>`).join('')}</div>
      <a class="lift__link" href="${SITE}${s.slug}" target="_blank" rel="noopener">Ficha completa e plantas</a>
    </article>`);
    liftBtns.insertAdjacentHTML('beforeend', `<button class="lift__btn" data-i="${i}" aria-label="Ir para ${s.name}">${i + 1}</button>`);
  });
  const lImgs = $$('.lift__img'), lCards = $$('.lift__card'), lBtns = $$('.lift__btn');
  let cur = -1;
  function setScene(i) {
    if (i === cur) return;
    lift.classList.toggle('down', i < cur);
    cur = i;
    lImgs.forEach((el, k) => { el.classList.toggle('on', k === i); el.classList.toggle('past', k < i); });
    lCards.forEach((el, k) => el.classList.toggle('on', k === i));
    lBtns.forEach((el, k) => el.classList.toggle('on', k === i));
    $('#liftNum').textContent = String(i + 1).padStart(2, '0');
  }
  function liftFrame() {
    const r = lift.getBoundingClientRect();
    const total = lift.offsetHeight - innerHeight;
    const p = clamp(-r.top / total);
    setScene(Math.min(SCENES.length - 1, Math.floor(p * SCENES.length * 0.999)));
    $('#liftBar').style.transform = `scaleX(${p})`;
  }
  liftBtns.addEventListener('click', e => {
    const b = e.target.closest('.lift__btn'); if (!b) return;
    const total = lift.offsetHeight - innerHeight;
    const i = +b.dataset.i;
    scrollTo({ top: lift.offsetTop + total * ((i + 0.5) / SCENES.length), behavior: 'smooth' });
  });

  /* ---------- processo: linha desenhada ---------- */
  const track = $('#procTrack'), steps = $$('.step');
  function procFrame() {
    const r = track.getBoundingClientRect();
    const p = clamp((innerHeight * 0.75 - r.top) / (r.height + innerHeight * 0.1));
    track.style.setProperty('--p', p);
    steps.forEach((s, i) => s.classList.toggle('on', p > i / steps.length + 0.02));
  }

  /* ---------- parallax ---------- */
  const pars = $$('.proc__city img, .about__fig img');
  function parFrame() {
    pars.forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      img.style.setProperty('--py', (p * -60).toFixed(1) + 'px');
    });
  }

  /* ---------- loop único de scroll ---------- */
  let ticking = false;
  function frame() {
    ticking = false;
    const y = scrollY;
    heroFrame(); maniFrame(); liftFrame(); procFrame(); parFrame();
    // header: tema pela zona sob ele, esconde ao descer
    const z = zones.find(el => { const r = el.getBoundingClientRect(); return r.top <= 40 && r.bottom > 40; });
    hd.classList.toggle('is-light', !!z && z.dataset.hd === 'light');
    hd.classList.toggle('is-solid', y > innerHeight * 0.5);
    if (!root.classList.contains('menu-open')) hd.classList.toggle('is-hidden', y > lastY && y > innerHeight * 1.2);
    lastY = y;
  }
  // roda direto no evento: não depende de requestAnimationFrame (abas em segundo plano e webviews seguram os quadros)
  const onScroll = () => { if (!ticking) { ticking = true; frame(); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();

  /* ---------- reveals e contadores ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -10% 0px' });
  $$('.up, .reveal-mask').forEach(el => io.observe(el));

  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = +el.dataset.count, t0 = performance.now();
    const step = () => { const k = clamp((performance.now() - t0) / 1600); el.textContent = Math.round(ease(k) * to); if (k < 1) setTimeout(step, 30); };
    step();
    cio.unobserve(el);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  // vídeo do hero só toca quando visível
  const hv = $('.hero__vid');
  new IntersectionObserver(([e]) => { e.isIntersecting ? hv.play().catch(() => {}) : hv.pause(); }).observe(hv);

  /* ---------- acervo ---------- */
  const DATA = window.IMOVEIS || [];
  const grid = $('#grid'), fB = $('#fBairro'), fF = $('#fFaixa');
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const bairros = [...new Set(DATA.map(d => d.b))].sort((a, b) => a.localeCompare(b, 'pt'));
  fB.insertAdjacentHTML('beforeend', bairros.map(b => `<option>${b}</option>`).join(''));
  const st = { k: '', b: '', f: '' };
  const gio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); gio.unobserve(e.target); } }), { rootMargin: '0px 0px -5% 0px' });
  const arrow = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
  function render() {
    const [lo, hi] = st.f ? st.f.split('-').map(Number) : [0, Infinity];
    const list = DATA.filter(d => (!st.k || d.k === st.k) && (!st.b || d.b === st.b) && (!st.f || (d.v && d.v >= lo && d.v <= hi)));
    $('#count').textContent = list.length;
    $('#empty').hidden = list.length > 0;
    grid.innerHTML = list.map((d, i) => `<a class="card" href="${SITE}${d.s}" target="_blank" rel="noopener" style="transition-delay:${(i % 4) * 70}ms">
      <div class="card__img"><img src="${d.i}" alt="${d.t}, ${d.b}" loading="lazy" ${d.o ? `style="object-position:${d.o}"` : ''}>
        <span class="card__tag">${d.k}</span>${d.d ? '<span class="card__tag card__tag--gold">Destaque</span>' : ''}<span class="card__go">${arrow}</span></div>
      <p class="card__b">${d.b}</p><h3 class="card__t">${d.t}</h3>
      <p class="card__s">${[d.a, d.sp].filter(Boolean).join(' · ')}</p>
      <p class="card__p">${d.v ? `<small>a partir de</small>${d.p}` : 'Preço a consultar'}</p></a>`).join('');
    $$('.card', grid).forEach(c => gio.observe(c));
  }
  $$('.chip').forEach(c => c.addEventListener('click', () => {
    $$('.chip').forEach(x => x.classList.toggle('is-on', x === c));
    st.k = c.dataset.k; render();
  }));
  fB.addEventListener('change', () => { st.b = fB.value; render(); });
  fF.addEventListener('change', () => { st.f = fF.value; render(); });
  render();

  /* ---------- reels: toque para ouvir ---------- */
  const reels = $$('.reel');
  reels.forEach(r => r.addEventListener('click', () => {
    const v = $('video', r);
    if (!v.src) v.src = r.dataset.src;
    if (r.classList.contains('playing')) { v.pause(); r.classList.remove('playing'); return; }
    reels.forEach(o => { if (o !== r) { $('video', o).pause(); o.classList.remove('playing'); } });
    v.muted = false; v.play().catch(() => {}); r.classList.add('playing');
  }));
  new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) reels.forEach(r => { $('video', r).pause(); r.classList.remove('playing'); });
  })).observe($('#reels'));

  /* ---------- briefing → WhatsApp ---------- */
  const FAIXAS = [500000, 1000000, 1500000, 2000000, 3000000, 5000000, 8000000, 15000000, Infinity];
  const fmt = v => v === Infinity ? 'R$ 25 milhões ou mais' : v >= 1e6 ? `R$ ${String(v / 1e6).replace('.', ',')} ${v === 1e6 ? 'milhão' : 'milhões'}` : `R$ ${v / 1000} mil`;
  const optB = $('#optBairros');
  const topB = ['Jardins', 'Pinheiros', 'Itaim Bibi', 'Moema', 'Brooklin', 'Vila Mariana', 'Ibirapuera', 'Campo Belo', 'Faria Lima', 'Vila Olímpia', 'Vila Nova Conceição', 'Higienópolis'];
  optB.innerHTML = topB.map(b => `<button type="button" class="opt" data-v="${b}">${b}</button>`).join('');
  const brief = { obj: ['Morar'], tipo: [], bairros: [], dorms: ['2'], prazo: ['Em até 6 meses'] };
  $$('.opts').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('.opt'); if (!b) return;
    const name = g.dataset.name, v = b.dataset.v;
    if (g.hasAttribute('data-single')) { brief[name] = [v]; $$('.opt', g).forEach(x => x.classList.toggle('is-on', x === b)); }
    else { b.classList.toggle('is-on'); brief[name] = $$('.opt.is-on', g).map(x => x.dataset.v); }
    dossie(name);
  }));
  const range = $('#faixa'), out = $('#faixaOut');
  range.addEventListener('input', () => dossie('faixa'));
  $('#nome').addEventListener('input', () => dossie('nome'));

  const num = Math.floor(1000 + Math.random() * 8999);
  $('#dosNum').textContent = 'Nº ' + num;
  function matches() {
    const max = FAIXAS[+range.value];
    return DATA.filter(d => {
      if (d.v && d.v > max) return false;
      if (brief.tipo.length) {
        const okT = brief.tipo.some(t => t === 'lançamento' ? /cyrela|mitre|haus|naeem|daslu|petra|galerie|portrait|escape|eden|senses|mandarin|vista|quattri|palace|garden|heaven|zen|gio|haddock|essencia|raizes/i.test(norm(d.t)) : d.k === t);
        if (!okT) return false;
      }
      if (brief.bairros.length && !brief.bairros.some(b => norm(d.b).includes(norm(b)) || (b === 'Jardins' && /jardim (paulista|america)/.test(norm(d.b))))) return false;
      return true;
    });
  }
  function dossie(changed) {
    const max = FAIXAS[+range.value];
    out.textContent = fmt(max);
    range.style.setProperty('--fill', (range.value / range.max * 100) + '%');
    const rows = [
      ['obj', 'Objetivo', brief.obj.join(', ')],
      ['tipo', 'Imóvel', brief.tipo.length ? brief.tipo.join(', ').replace('lançamento', 'na planta') : 'Aberto'],
      ['bairros', 'Bairros', brief.bairros.length ? brief.bairros.join(', ') : 'Aberto'],
      ['faixa', 'Até', fmt(max)],
      ['dorms', 'Dorms.', brief.dorms[0]],
      ['prazo', 'Prazo', brief.prazo[0]],
      ['nome', 'Nome', $('#nome').value.trim() || '…']
    ];
    $('#dosList').innerHTML = rows.map(r => `<dt>${r[1]}</dt><dd class="${r[0] === changed ? 'flash' : ''}">${r[2]}</dd>`).join('');
    const m = matches();
    $('#dosCount').textContent = m.length;
    $('#dosThumbs').innerHTML = m.slice(0, 6).map(d => `<img src="${d.i}" alt="" loading="lazy">`).join('');
    return rows;
  }
  dossie();
  $('#sendBtn').addEventListener('click', () => {
    const rows = dossie();
    const nome = $('#nome').value.trim();
    const msg = `Olá Fabia! ${nome ? 'Sou ' + nome + '. ' : ''}Vim pelo site e quero ajuda para encontrar um imóvel.\n\n` +
      rows.filter(r => r[0] !== 'nome').map(r => `• ${r[1]}: ${r[2]}`).join('\n');
    open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });
})();
