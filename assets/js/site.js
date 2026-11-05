(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) document.documentElement.classList.add('reduced');
  const page = document.body.dataset.page;

  // shared chrome
  const cats = [
    ['Aktualno', 'img/cat-igrace.jpg'],
    ['Darilni program', 'img/cat-darilni.jpg'],
    ['Poslovna darila', 'img/cat-poslovna.jpg'],
    ['Igrače', 'img/cat-igrace.jpg'],
    ['Nakit', 'img/cat-nakit.jpg'],
    ['Ure', 'img/cat-ure.jpg'],
    ['Aranžirana darila', 'img/cat-aranzirana.jpg'],
    ['Kozmetika', 'img/cat-kozmetika.jpg'],
    ['Galanterija', 'img/cat-galanterija.jpg'],
  ];
  const subs = ['Albumi', 'Brisače', 'Darilni artikli', 'Gobelini', 'Gospodinjstvo', 'Hranilniki', 'Malčki', 'Okvirji', 'Slike', 'Svetilke', 'Svečniki', 'Unikatni izdelki', 'Vaze', 'Kipi', 'Fontane'];
  const link = c => `ponudba.html#${encodeURIComponent(c)}`;

  document.body.insertAdjacentHTML('afterbegin', `
  <header class="nav" id="nav">
    <a class="nav-logo" href="index.html" aria-label="Trgovina Darka, domov"><img src="assets/img/logo-darka.png" alt="Trgovina Darka"></a>
    <nav class="nav-links">
      <button id="megaBtn" aria-expanded="false" class="${page === 'ponudba' ? 'active' : ''}">Ponudba</button>
      <a href="${link('Poslovna darila')}">Poslovna darila</a>
      <a href="o-nas.html" class="${page === 'o-nas' ? 'active' : ''}">O nas</a>
      <a href="o-nas.html#kontakt">Kontakt</a>
    </nav>
    <div class="nav-right">
      <a class="btn btn-ink nav-call" href="tel:+38631586122">031 586 122</a>
      <button class="burger" id="burger" aria-label="Meni"><span></span><span></span></button>
    </div>
  </header>
  <div class="mega-scrim" id="megaScrim"></div>
  <div class="mega" id="mega">
    <div class="mega-col mega-big">
      <h4>Naša ponudba</h4>
      ${cats.map(([c, i]) => `<a href="${link(c)}" data-img="assets/${i}">${c}</a>`).join('')}
    </div>
    <div class="mega-col mega-list">
      <h4>Darilni program</h4>
      ${subs.slice(0, 8).map(s => `<a href="${link('Darilni program')}/${encodeURIComponent(s)}">${s}</a>`).join('')}
    </div>
    <div class="mega-col mega-list">
      <h4>&nbsp;</h4>
      ${subs.slice(8).map(s => `<a href="${link('Darilni program')}/${encodeURIComponent(s)}">${s}</a>`).join('')}
    </div>
    <div class="mega-img"><img id="megaImg" src="assets/img/cat-darilni.jpg" alt=""></div>
  </div>
  <div class="mmenu">
    <div>${['Ponudba|ponudba.html', 'Poslovna darila|' + link('Poslovna darila'), 'O nas|o-nas.html', 'Kontakt|o-nas.html#kontakt'].map(s => { const [t, h] = s.split('|'); return `<a class="big" href="${h}">${t}</a>`; }).join('')}</div>
    <div><a class="btn btn-ink" href="tel:+38631586122">Pokličite 031 586 122</a></div>
  </div>`);

  document.body.insertAdjacentHTML('beforeend', `
  <footer class="foot">
    <p class="foot-lbl">Za nasvet pri izbiri darila pokličite Darko</p>
    <a class="foot-call" href="tel:+38631586122">031 586 122</a>
    <div class="foot-grid">
      <div><span class="foot-logo"><img src="assets/img/logo-darka.png" alt="Trgovina Darka"></span></div>
      <div><h5>Trgovina</h5>Obrtniška ulica 39<br>8210 Trebnje<br><a href="tel:+38673044900">07 30 44 900</a><br><a href="mailto:info@trgovina-darka.si">info@trgovina-darka.si</a></div>
      <div><h5>Delovni čas</h5>Pon. do pet. 8:00 do 18:00<br>Sobota 8:00 do 12:00<br>Nedelje in prazniki zaprto</div>
      <div><h5>Ponudba</h5>${cats.slice(1, 7).map(([c]) => `<a href="${link(c)}">${c}</a>`).join('<br>')}</div>
    </div>
    <div class="foot-bottom"><span>TDR d.o.o., ID za DDV SI26173379</span><a href="o-nas.html#podatki">Varovanje podatkov</a></div>
  </footer>`);

  // mega menu
  const mega = document.getElementById('mega'), scrim = document.getElementById('megaScrim'), btn = document.getElementById('megaBtn');
  const setMega = o => { mega.classList.toggle('open', o); scrim.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); };
  btn.addEventListener('click', () => setMega(!mega.classList.contains('open')));
  scrim.addEventListener('click', () => setMega(false));
  addEventListener('keydown', e => e.key === 'Escape' && setMega(false));
  const megaImg = document.getElementById('megaImg');
  mega.querySelectorAll('[data-img]').forEach(a => a.addEventListener('mouseenter', () => { megaImg.src = a.dataset.img; }));
  mega.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMega(false)));
  document.getElementById('burger').addEventListener('click', () => document.body.classList.toggle('menu-open'));

  // nav state
  const nav = document.getElementById('nav');
  let lastY = 0;
  const onScroll = y => {
    nav.classList.toggle('scrolled', y > 40);
    nav.classList.toggle('hide', y > lastY && y > 600 && !mega.classList.contains('open'));
    lastY = y;
  };

  window.DARKA = { reduced };
  if (!window.gsap || reduced) { addEventListener('scroll', () => onScroll(scrollY)); window.DARKA.ready = Promise.resolve(); return; }

  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', e => { ScrollTrigger.update(); onScroll(e.scroll); });
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.DARKA.lenis = lenis;

  // generic reveals
  gsap.utils.toArray('.rv').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
  // image parallax inside frames
  gsap.utils.toArray('[data-par]').forEach(img => gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
})();
