(() => {
  const { byId, card, all } = window.DarkaShop;
  const picks = [685, 61, 132, 494, 543, 677, 214, 44, 613, 130, 447, 559, 497, 15];
  const shelfTrack = document.getElementById('shelfTrack');
  shelfTrack.innerHTML = picks.map(id => byId[id]).filter(Boolean).map(card).join('');
  // the track moves by transform, so native lazy loading never fires for later cards
  shelfTrack.querySelectorAll('img').forEach(im => (im.loading = 'eager'));
  document.getElementById('cnt').textContent = Math.floor(all.length / 10) * 10 + '+';

  // opening status
  const now = new Date(), d = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
  const isOpen = (d >= 1 && d <= 5 && h >= 8 && h < 18) || (d === 6 && h >= 8 && h < 12);
  document.getElementById('status').textContent = isOpen ? 'Zdaj odprto' : 'Zdaj zaprto';
  document.getElementById('dot').classList.toggle('open', isOpen);
  document.querySelectorAll('#hours [data-d]').forEach(r => {
    const [a, b = a] = r.dataset.d.split('-').map(Number);
    if (d >= a && d <= b) r.querySelector('b').classList.add('red');
  });

  // split statement into words
  const st = document.getElementById('statement');
  st.innerHTML = st.textContent.split(' ').map(w => `<span class="w">${w}</span>`).join(' ');

  const loader = document.getElementById('loader');
  if (!window.gsap || window.DARKA.reduced) {
    loader.remove();
    st.querySelectorAll('.w').forEach(w => (w.style.opacity = 1));
    return;
  }

  // loader then hero
  const lines = gsap.utils.toArray('.hero h1 .ln > span');
  gsap.set(lines, { yPercent: 110 });
  gsap.timeline()
    .to('.loader-logo', { clipPath: 'inset(0 0% 0 0)', duration: .9, ease: 'expo.inOut' })
    .to('.loader-bar', { scaleX: 1, duration: .7, ease: 'expo.inOut' }, '-=.5')
    .to(loader, { yPercent: -100, duration: .9, ease: 'expo.inOut' }, '+=.1')
    .set(loader, { display: 'none' })
    .to(lines, { yPercent: 0, duration: 1.2, stagger: .09, ease: 'expo.out' }, '-=.5')
    .from('#heroImg', { scale: 1.2, duration: 1.8, ease: 'expo.out' }, '<');

  // hero image opens to full bleed and drifts
  gsap.fromTo('#heroMedia', { '--c': () => getComputedStyle(document.documentElement).getPropertyValue('--gut'), '--r': '8px' }, { '--c': '0px', '--r': '0px', ease: 'none', scrollTrigger: { trigger: '#heroMedia', start: 'top 75%', end: 'top 5%', scrub: true } });
  gsap.to('#heroImg', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '#heroMedia', start: 'top bottom', end: 'bottom top', scrub: true } });

  // statement words light up
  gsap.to(st.querySelectorAll('.w'), { opacity: 1, stagger: .08, ease: 'none', scrollTrigger: { trigger: st, start: 'top 80%', end: 'bottom 45%', scrub: true } });

  // story steps swap the sticky image
  const imgs = document.querySelectorAll('.story-media img');
  document.querySelectorAll('.step').forEach((s, i) => ScrollTrigger.create({
    trigger: s, start: 'top 60%', end: 'bottom 60%',
    onToggle: self => {
      if (!self.isActive) return;
      document.querySelectorAll('.step').forEach((x, j) => x.classList.toggle('on', j === i));
      imgs.forEach((im, j) => im.classList.toggle('on', j === i));
    },
  }));

  // shelf: pinned horizontal travel on desktop, native swipe on touch
  const track = document.getElementById('shelfTrack');
  ScrollTrigger.matchMedia({
    '(min-width: 701px)': () => {
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#shelf', start: 'top top+=60', end: () => '+=' + dist(), pin: true, scrub: .6, invalidateOnRefresh: true } });
    },
    '(max-width: 700px)': () => {
      const sh = document.getElementById('shelf');
      sh.style.overflowX = 'auto'; sh.style.scrollSnapType = 'x mandatory';
    },
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
