// product card + detail modal, shared by home and catalogue
window.DarkaShop = (() => {
  const all = window.DARKA_PRODUCTS || [];
  const byId = Object.fromEntries(all.map(p => [p.id, p]));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const card = p => `
    <article class="pcard" data-id="${p.id}" tabindex="0">
      <div class="pcard-img"><img src="assets/products/${p.f}" alt="${esc(p.n)}" loading="lazy"></div>
      <div class="pcard-m"><span class="n">${esc(p.n)}</span><span class="pr">${p.p} €</span></div>
      <div class="pcard-s">${esc(p.s || p.c)}</div>
    </article>`;

  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal" id="modal" aria-hidden="true">
      <div class="modal-bg" data-close></div>
      <div class="modal-box" role="dialog" aria-modal="true">
        <button class="modal-x" data-close aria-label="Zapri">×</button>
        <div class="modal-img"><img id="mImg" alt=""></div>
        <div class="modal-info">
          <span class="muted" id="mCat"></span>
          <h3 class="h3" id="mName"></h3>
          <p class="lead muted" id="mDesc"></p>
          <div class="modal-price" id="mPrice"></div>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <a class="btn btn-ink" id="mMail">Povprašajte po e-pošti <span class="arr">→</span></a>
            <a class="btn btn-line" href="tel:+38631586122">031 586 122</a>
          </div>
        </div>
      </div>
    </div>`);
  const modal = document.getElementById('modal');
  const open = id => {
    const p = byId[id]; if (!p) return;
    mImg.src = `assets/products/${p.f}`; mImg.alt = p.n;
    mCat.textContent = [p.c, p.s].filter(Boolean).join(', ');
    mName.textContent = p.n;
    mDesc.textContent = p.d || 'Za več informacij o izdelku nas pokličite ali nam pišite.';
    mPrice.textContent = `${p.p} €`;
    mMail.href = `mailto:info@trgovina-darka.si?subject=${encodeURIComponent('Povpraševanje: ' + p.n)}`;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    window.DARKA?.lenis?.stop();
  };
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); window.DARKA?.lenis?.start(); };
  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
  addEventListener('keydown', e => e.key === 'Escape' && close());
  document.addEventListener('click', e => {
    const c = e.target.closest('.pcard');
    if (c && !c.dataset.dragged) open(+c.dataset.id);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList?.contains('pcard')) open(+e.target.dataset.id); });

  return { all, byId, card };
})();
