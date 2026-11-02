/* Вариант 2: параметрический чертёж изделия. Геометрия считается из чисел, поэтому любое изменение плавно перетекает */
(function () {
  const CM = 4.6; // единиц чертежа на сантиметр длины
  const TOP = 70;
  const CX = 260;

  M.coat = {
    lengths: [['jacket', 'Жакет', 62], ['short', 'Укороченное', 82], ['knee', 'До колена', 100], ['midi', 'Миди', 118], ['maxi', 'Макси', 135]],
    fits: [['slim', 'Приталенный', { sw: 74, cw: 66, ww: 50, hw: 74 }], ['straight', 'Прямой', { sw: 80, cw: 78, ww: 74, hw: 90 }], ['over', 'Оверсайз', { sw: 104, cw: 100, ww: 98, hw: 112 }]],
    sleeves: [['classic', 'Классический', { sl: 268, cuff: 42, out: 26 }], ['wide', 'Широкий', { sl: 262, cuff: 66, out: 36 }], ['short', 'Укороченный', { sl: 212, cuff: 52, out: 22 }]],
    collars: [['lapel', 'Лацканы'], ['stand', 'Стойка'], ['hood', 'Капюшон']],
    closures: [['double', 'Двубортная'], ['single', 'Однобортная'], ['wrap', 'На запах']],
    pockets: [['welt', 'Прорезные'], ['patch', 'Накладные']],
    fabrics: [['Песок', '#D0B999'], ['Латте', '#B59D84'], ['Кофе', '#7A5F4C'], ['Шоколад', '#43302A'], ['Бургунди', '#5B2632'], ['Графит', '#4B4B4E'], ['Чёрный', '#1C1A19'], ['Молочный', '#EFE8DA']],
    materials: ['Итальянская шерсть', 'Итальянский коттон', 'Плащевая ткань'],
    bases: [
      { k: 'coat', name: 'Пальто', price: 14900, set: { len: 'midi', fit: 'straight', sleeve: 'classic', collar: 'lapel', closure: 'double', belt: false, pocket: 'welt', fabric: 'Кофе', material: 'Итальянская шерсть' } },
      { k: 'trench', name: 'Тренч', price: 13900, set: { len: 'maxi', fit: 'straight', sleeve: 'classic', collar: 'lapel', closure: 'double', belt: true, pocket: 'welt', fabric: 'Песок', material: 'Итальянский коттон' } },
      { k: 'pilot', name: 'Пилот', price: 12900, set: { len: 'short', fit: 'over', sleeve: 'wide', collar: 'lapel', closure: 'single', belt: false, pocket: 'patch', fabric: 'Латте', material: 'Итальянская шерсть' } },
      { k: 'blazer', name: 'Жакет', price: 6900, set: { len: 'jacket', fit: 'straight', sleeve: 'classic', collar: 'lapel', closure: 'single', belt: false, pocket: 'welt', fabric: 'Бургунди', material: 'Итальянская шерсть' } },
    ],
  };
  const C = M.coat;
  const find = (arr, k) => arr.find((x) => x[0] === k);
  const lumi = (hex) => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255; };

  const toParams = (s) => {
    const len = find(C.lengths, s.len)[2];
    const f = find(C.fits, s.fit)[2];
    const sl = find(C.sleeves, s.sleeve)[2];
    return { hem: TOP + len * CM, sw: f.sw, cw: f.cw, ww: s.belt ? Math.min(f.ww, f.cw - 16) : f.ww, hw: f.hw + (len > 100 ? (len - 100) * 0.5 : 0), sl: sl.sl, cuff: sl.cuff, out: sl.out + (f.sw - 74) * 0.2 };
  };

  const paths = (p) => {
    const nw = 25;
    const wy = 290;
    const hem = p.hem;
    const hemCurve = hem + 7;
    const body = `M${CX - nw} ${TOP} L${CX - p.sw} ${TOP + 34} Q${CX - p.cw - 2} ${TOP + 90} ${CX - p.cw} ${TOP + 140} Q${CX - p.ww - 2} ${wy - 32} ${CX - p.ww} ${wy} Q${CX - p.hw + 8} ${(wy + hem) / 2} ${CX - p.hw} ${hem} Q${CX} ${hemCurve} ${CX + p.hw} ${hem} Q${CX + p.hw - 8} ${(wy + hem) / 2} ${CX + p.ww} ${wy} Q${CX + p.ww + 2} ${wy - 32} ${CX + p.cw} ${TOP + 140} Q${CX + p.cw + 2} ${TOP + 90} ${CX + p.sw} ${TOP + 34} L${CX + nw} ${TOP} Q${CX} ${TOP + 22} ${CX - nw} ${TOP} Z`;
    const sTop = TOP + 34;
    const sEnd = sTop + p.sl;
    const ox = CX + p.sw + p.out;
    const sleeveR = `M${CX + p.sw} ${sTop} Q${ox + 6} ${sTop + 40} ${ox + 18} ${sEnd} L${ox + 18 - p.cuff} ${sEnd + 6} Q${CX + p.cw + 8} ${TOP + 210} ${CX + p.cw} ${TOP + 140} Q${CX + p.cw + 2} ${TOP + 90} ${CX + p.sw} ${sTop} Z`;
    const cuff = `M${ox + 15} ${sEnd - 22} L${ox + 16 - p.cuff} ${sEnd - 16}`;
    const stitch = `M${CX - p.hw + 3} ${hem - 14} Q${CX} ${hem - 7} ${CX + p.hw - 3} ${hem - 14}`;
    const pY = Math.min(hem - 96, 372);
    return { body, sleeveR, cuff, stitch, hem, pY, wy, p };
  };

  /* Отрисовка в существующий svg: только атрибуты, без перестройки */
  const paint = (svg, p, s) => {
    const g = paths(p);
    const set = (sel, attr, val) => { svg.querySelectorAll(sel).forEach((e) => e.setAttribute(attr, val)); };
    set('[data-c=body]', 'd', g.body);
    set('[data-c=sleeve]', 'd', g.sleeveR);
    set('[data-c=cuff]', 'd', g.cuff);
    set('[data-c=stitch]', 'd', g.stitch);
    set('[data-c=placket]', 'd', `M${CX} 214 L${CX} ${g.hem + 2}`);
    set('[data-c=placket2]', 'd', `M${CX + 30} 196 L${CX + 30} ${g.hem - 1}`);
    set('[data-c=wrapline]', 'd', `M${CX - 24} 184 Q${CX + 8} ${g.wy - 20} ${CX + 42} ${g.hem}`);
    const bw = p.ww + 6;
    set('[data-c=belt]', 'd', `M${CX - bw} ${g.wy - 11} L${CX + bw} ${g.wy - 11} L${CX + bw} ${g.wy + 11} L${CX - bw} ${g.wy + 11} Z`);
    set('[data-c=tie]', 'd', `M${CX + 8} ${g.wy + 8} L${CX - 16} ${g.wy + 92} L${CX + 4} ${g.wy + 94} L${CX + 24} ${g.wy + 8} Z`);
    const px = Math.min(p.ww, p.hw) * 0.34 + 18;
    set('[data-c=patchL]', 'd', `M${CX - px - 56} ${g.pY} L${CX - px} ${g.pY} L${CX - px} ${g.pY + 74} L${CX - px - 56} ${g.pY + 74} Z`);
    set('[data-c=flapL]', 'd', `M${CX - px - 56} ${g.pY + 14} L${CX - px} ${g.pY + 14}`);
    set('[data-c=weltL]', 'd', `M${CX - px - 44} ${g.pY + 46} L${CX - px - 4} ${g.pY + 14}`);
    const btn = svg.querySelectorAll('[data-c=btn]');
    const ys = [226, 290, 354, 418];
    btn.forEach((b, i) => { b.setAttribute('cy', Math.min(ys[i % 4], g.hem - 24)); });
    // размерные линии
    const dx = CX + 186;
    set('[data-c=dimL]', 'd', `M${dx} ${TOP} L${dx} ${g.hem} M${dx - 7} ${TOP} L${dx + 7} ${TOP} M${dx - 7} ${g.hem} L${dx + 7} ${g.hem}`);
    const label = svg.querySelector('[data-c=dimT]');
    if (label) { label.setAttribute('x', dx + 10); label.setAttribute('y', (TOP + g.hem) / 2); }
    if (label && s) label.textContent = `${Math.round((g.hem - TOP) / CM)} см`;
    const dy = TOP - 30;
    set('[data-c=dimS]', 'd', `M${CX - p.sw} ${dy} L${CX + p.sw} ${dy} M${CX - p.sw} ${dy - 6} L${CX - p.sw} ${dy + 6} M${CX + p.sw} ${dy - 6} L${CX + p.sw} ${dy + 6}`);
  };

  M.coatSVG = (o = {}) => `
    <svg class="coat ${o.cls || ''}" viewBox="0 0 520 780" role="img" aria-label="Чертёж изделия">
      <g class="coat-hood" data-part="hood"><path d="M${CX - 44} 76 C${CX - 62} 22 ${CX + 62} 22 ${CX + 44} 76 Q${CX} 104 ${CX - 44} 76 Z"/></g>
      <path class="coat-fab" data-c="sleeve"/><path class="coat-fab" data-c="sleeve" transform="translate(${CX * 2} 0) scale(-1 1)"/>
      <path class="coat-det" data-c="cuff"/><path class="coat-det" data-c="cuff" transform="translate(${CX * 2} 0) scale(-1 1)"/>
      <path class="coat-fab coat-main" data-c="body"/>
      <path class="coat-sti" data-c="stitch"/>
      <path class="coat-det" data-part="placket" data-c="placket"/>
      <path class="coat-det" data-part="placket2" data-c="placket2"/>
      <path class="coat-det" data-part="wrap" data-c="wrapline"/>
      <g data-part="welt"><path class="coat-det" data-c="weltL"/><path class="coat-det" data-c="weltL" transform="translate(${CX * 2} 0) scale(-1 1)"/></g>
      <g data-part="patch"><path class="coat-fab" data-c="patchL"/><path class="coat-det" data-c="flapL"/><path class="coat-fab" data-c="patchL" transform="translate(${CX * 2} 0) scale(-1 1)"/><path class="coat-det" data-c="flapL" transform="translate(${CX * 2} 0) scale(-1 1)"/></g>
      <g data-part="buttons1">${[0, 1, 2, 3].map(() => `<circle class="coat-btn" data-c="btn" cx="${CX + 10}" r="4.200"/>`).join('')}</g>
      <g data-part="buttons2">${[0, 1, 2, 3].map(() => `<circle class="coat-btn" data-c="btn" cx="${CX + 16}" r="4.200"/>`).join('')}${[0, 1, 2, 3].map(() => `<circle class="coat-btn" data-c="btn" cx="${CX - 22}" r="4.200"/>`).join('')}</g>
      <g data-part="lapel">
        <path class="coat-fab" d="M${CX - 25} 70 L${CX - 58} 128 L${CX - 40} 142 L${CX - 56} 154 L${CX} 226 L${CX} 118 Q${CX - 12} 96 ${CX - 25} 70 Z"/>
        <path class="coat-fab" d="M${CX + 25} 70 L${CX + 58} 128 L${CX + 40} 142 L${CX + 56} 154 L${CX} 226 L${CX} 118 Q${CX + 12} 96 ${CX + 25} 70 Z"/>
      </g>
      <g data-part="stand"><path class="coat-fab" d="M${CX - 29} 46 Q${CX} 58 ${CX + 29} 46 L${CX + 33} 92 Q${CX} 116 ${CX - 33} 92 Z"/><path class="coat-det" d="M${CX} 104 L${CX} 214"/></g>
      <g data-part="hoodfront"><path class="coat-fab" d="M${CX - 34} 70 Q${CX} 128 ${CX + 34} 70 L${CX + 42} 92 Q${CX} 152 ${CX - 42} 92 Z"/><path class="coat-det" d="M${CX} 124 L${CX} 214"/></g>
      <g data-part="belt"><path class="coat-fab" data-c="belt"/><path class="coat-fab" data-c="tie"/></g>
      <g class="coat-dim" data-part="dims"><path data-c="dimL"/><text data-c="dimT"></text><path data-c="dimS"/></g>
    </svg>`;

  M.coatApply = (svg, s, animate = true) => {
    const fab = find(C.fabrics, s.fabric)[1];
    const dark = lumi(fab) < 0.42;
    svg.style.setProperty('--fab', fab);
    svg.style.setProperty('--det', dark ? 'rgba(255,255,255,.5)' : 'rgba(40,30,25,.62)');
    svg.style.setProperty('--edge', dark ? '#120e0c' : 'rgba(40,30,25,.72)');
    const vis = {
      hood: s.collar === 'hood', hoodfront: s.collar === 'hood', lapel: s.collar === 'lapel', stand: s.collar === 'stand',
      placket: s.closure === 'single', placket2: s.closure === 'double', wrap: s.closure === 'wrap',
      buttons1: s.closure === 'single', buttons2: s.closure === 'double',
      belt: !!s.belt, welt: s.pocket === 'welt', patch: s.pocket === 'patch',
    };
    Object.entries(vis).forEach(([k, v]) => svg.querySelectorAll(`[data-part="${k}"]`).forEach((e) => e.classList.toggle('off', !v)));
    const to = toParams(s);
    const from = svg._p || to;
    cancelAnimationFrame(svg._raf);
    if (!animate || !svg._p || M.reduced) { svg._p = to; paint(svg, to, s); return; }
    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 4);
    const step = (now) => {
      const k = ease(Math.min(1, (now - t0) / 720));
      const p = {};
      Object.keys(to).forEach((n) => { p[n] = from[n] + (to[n] - from[n]) * k; });
      svg._p = p;
      paint(svg, p, s);
      if (k < 1) svg._raf = requestAnimationFrame(step);
    };
    svg._raf = requestAnimationFrame(step);
  };

  M.coatLabel = (s) => ({
    Длина: find(C.lengths, s.len)[1] + `, ${find(C.lengths, s.len)[2]} см`,
    Силуэт: find(C.fits, s.fit)[1],
    Рукав: find(C.sleeves, s.sleeve)[1],
    Воротник: find(C.collars, s.collar)[1],
    Застёжка: find(C.closures, s.closure)[1],
    Пояс: s.belt ? 'Есть' : 'Нет',
    Карманы: find(C.pockets, s.pocket)[1],
    Ткань: s.material,
    Цвет: s.fabric,
  });
})();
