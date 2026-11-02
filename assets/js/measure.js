/* MASY: мерки, таблица размеров и линейная фигура для всех разделов «На заказ» */
(function () {
  const M = window.M;

  M.measures = [
    { k: 'height', name: 'Рост', min: 145, max: 195, def: 168, focus: [20, 0, 360, 930],
      how: 'Встаньте без обуви спиной к стене, пятки вместе. Отметьте верх макушки и измерьте расстояние от пола до отметки.',
      tip: 'Проще всего попросить кого-нибудь приложить книгу к макушке.' },
    { k: 'bust', name: 'Обхват груди', min: 70, max: 130, def: 90, focus: [90, 190, 220, 170],
      how: 'Проведите ленту горизонтально по самым выступающим точкам груди. Сзади лента проходит чуть ниже лопаток.',
      tip: 'Измеряйте в белье, которое обычно носите. Между лентой и телом должен проходить один палец.' },
    { k: 'waist', name: 'Обхват талии', min: 55, max: 120, def: 72, focus: [100, 300, 200, 150],
      how: 'Найдите самое узкое место корпуса, обычно на 2–3 см выше пупка. Лента лежит ровно, параллельно полу.',
      tip: 'Не втягивайте живот: стойте расслабленно и дышите как обычно.' },
    { k: 'hips', name: 'Обхват бёдер', min: 75, max: 140, def: 98, focus: [90, 400, 220, 170],
      how: 'Проведите ленту по самым выступающим точкам ягодиц, строго параллельно полу. Ноги вместе.',
      tip: 'Посмотрите в зеркало сбоку: лента не должна уходить вниз сзади.' },
    { k: 'shoulder', name: 'Ширина плеч', min: 32, max: 52, def: 39, focus: [80, 100, 240, 140],
      how: 'Измерьте по спине от одной плечевой косточки до другой, без округления вниз.',
      tip: 'Косточка хорошо прощупывается, если поднять и опустить плечо.' },
    { k: 'sleeve', name: 'Длина руки', min: 50, max: 72, def: 60, focus: [210, 130, 200, 370],
      how: 'Слегка согните руку. Ведите ленту от плечевой косточки через локоть до косточки запястья.',
      tip: 'Для рукава с запасом на варежки добавим сами, просто укажите в пожеланиях.' },
    { k: 'biceps', name: 'Обхват руки', min: 22, max: 46, def: 29, focus: [230, 200, 130, 110],
      how: 'Измерьте самую широкую часть руки выше локтя. Рука расслаблена и опущена вдоль тела.',
      tip: 'Особенно важно для приталенных рукавов и пальто-жакетов.' },
    { k: 'back', name: 'Длина спины', min: 34, max: 50, def: 40, focus: [100, 110, 200, 280],
      how: 'Наклоните голову и найдите выступающий шейный позвонок. Измерьте от него вниз вдоль позвоночника до линии талии.',
      tip: 'Завяжите на талии тонкую ленту или нитку: так линия будет точно видна.' },
    { k: 'leg', name: 'Длина ноги', min: 88, max: 125, def: 104, focus: [130, 350, 200, 570],
      how: 'Измерьте сбоку от линии талии вниз по бедру до косточки на щиколотке.',
      tip: 'Определяет длину брюк и пропорции пальто в пол.' },
  ];
  M.measureBy = (k) => M.measures.find((x) => x.k === k);

  /* Типовая таблица: заменяется реальной таблицей бренда */
  M.sizeTable = [
    { s: 'XS', ru: 42, bust: 84, waist: 66, hips: 92 },
    { s: 'S', ru: 44, bust: 88, waist: 70, hips: 96 },
    { s: 'M', ru: 46, bust: 92, waist: 74, hips: 100 },
    { s: 'L', ru: 48, bust: 96, waist: 78, hips: 104 },
    { s: 'XL', ru: 50, bust: 100, waist: 82, hips: 108 },
  ];
  M.sizeTableHtml = () => `
    <table class="size-table"><thead><tr><th>Размер</th><th>RU</th><th>Грудь</th><th>Талия</th><th>Бёдра</th></tr></thead>
    <tbody>${M.sizeTable.map((r) => `<tr><td>${r.s}</td><td>${r.ru}</td><td>${r.bust}</td><td>${r.waist}</td><td>${r.hips}</td></tr>`).join('')}</tbody></table>
    <p class="modal-note">Сантиметры, обхваты по телу. Модели свободного кроя садятся на несколько размеров.</p>
    <a class="link" href="#/atelier" data-close>Как правильно снять мерки ${M.ic.arrow}</a>`;

  const nearest = (key, val) => {
    return M.sizeTable.find((r) => r[key] >= val) || M.sizeTable[M.sizeTable.length - 1];
  };
  /* По трём обхватам берём наибольший размер: вещь должна свободно застёгиваться */
  M.sizeFor = (m) => {
    const keys = ['bust', 'waist', 'hips'].filter((k) => m && m[k]);
    if (!keys.length) return null;
    const per = {};
    keys.forEach((k) => (per[k] = nearest(k, m[k])));
    const top = keys.map((k) => per[k]).sort((a, b) => b.ru - a.ru)[0];
    const uneven = new Set(keys.map((k) => per[k].s)).size > 1;
    return { size: top.s, ru: top.ru, per, uneven };
  };
  /* Быстрый старт: подставляем ориентировочные мерки по росту и обычному размеру */
  M.estimate = (height, size) => {
    const r = M.sizeTable.find((x) => x.s === size) || M.sizeTable[1];
    const h = +height || 168;
    return { height: h, bust: r.bust, waist: r.waist, hips: r.hips,
      shoulder: Math.round(h * 0.232 * 2) / 2, sleeve: Math.round(h * 0.358 * 2) / 2,
      biceps: Math.round((r.bust * 0.32) * 2) / 2, back: Math.round(h * 0.24 * 2) / 2, leg: Math.round(h * 0.62 * 2) / 2 };
  };
  M.measureLine = (m) => M.measures.filter((x) => m[x.k]).map((x) => `${x.name.toLowerCase()} ${m[x.k]}`).join(', ') + ' (см)';

  /* Контур: правая половина одной линией, левая получается зеркально */
  const HALF = `M214 112 C214 126 215 136 222 142 C238 152 262 156 280 168 C292 176 298 196 301 222 C306 262 313 300 318 336 C323 376 331 420 337 462 C340 474 346 488 347 506 C348 522 342 538 334 540 C328 540 324 530 323 518 C322 500 321 482 320 466 C313 424 303 380 295 340 C288 300 278 262 266 232 C266 252 268 268 264 286 C258 314 242 340 240 372 C240 398 258 432 270 470 C279 502 279 540 274 580 C268 640 258 690 254 730 C253 760 257 790 252 830 C249 855 245 872 244 890 C244 902 240 908 228 908 C218 908 215 900 216 888 C220 850 224 800 221 740 C219 690 213 620 205 566 L200 548`;
  const FILL = `M200 112 L${HALF.slice(1)} Z`;
  const arc = (cx, cy, rx, ry) => ({ front: `M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`, back: `M${cx + rx} ${cy} A${rx} ${ry} 0 0 0 ${cx - rx} ${cy}` });
  const LINES = {
    height: { d: 'M52 20 L52 908', ends: [[52, 20], [52, 908]], label: [40, 468, 'end'], ticks: ['M42 20H62', 'M42 908H62'], guides: ['M62 20H176', 'M62 908H206'] },
    bust: { ...arc(200, 272, 68, 12), label: [358, 277, 'start'] },
    waist: { ...arc(200, 372, 41, 8), label: [358, 377, 'start'] },
    hips: { ...arc(200, 470, 72, 12), label: [358, 475, 'start'] },
    shoulder: { d: 'M120 170 C150 158 250 158 280 170', ends: [[120, 170], [280, 170]], label: [200, 148, 'middle'] },
    sleeve: { d: 'M284 170 C300 188 306 230 310 262 C316 306 324 340 330 380 C336 412 340 440 344 464', ends: [[284, 170], [344, 464]], label: [356, 320, 'start'] },
    biceps: { ...arc(289, 262, 18, 5), label: [320, 256, 'start'] },
    back: { d: 'M200 138 L200 372', ends: [[200, 138], [200, 372]], label: [212, 250, 'start'] },
    leg: { d: 'M242 372 C246 410 278 470 278 530 C276 600 258 690 250 740 C250 790 244 840 238 888', ends: [[242, 372], [238, 888]], label: [292, 640, 'start'] },
  };

  M.figure = (o = {}) => {
    const lines = Object.entries(LINES).map(([k, l]) => {
      const paths = l.front
        ? `<path class="tape tape-back" pathLength="1" d="${l.back}"/><path class="tape" pathLength="1" d="${l.front}"/>`
        : `${(l.ticks || []).map((t) => `<path class="tape-tick" d="${t}"/>`).join('')}${(l.guides || []).map((t) => `<path class="tape-guide" d="${t}"/>`).join('')}<path class="tape" pathLength="1" d="${l.d}"/>${(l.ends || []).map((e) => `<circle class="tape-end" cx="${e[0]}" cy="${e[1]}" r="3"/>`).join('')}`;
      return `<g class="m-line" data-line="${k}">${paths}<text class="m-val" x="${l.label[0]}" y="${l.label[1]}" text-anchor="${l.label[2]}"></text></g>`;
    }).join('');
    return `<svg class="fig ${o.cls || ''}" viewBox="0 0 400 930" role="img" aria-label="Фигура со схемой снятия мерок" preserveAspectRatio="xMidYMid meet">
      <ellipse class="fig-body" cx="200" cy="66" rx="33" ry="45"/>
      <path class="fig-fill" d="${FILL}"/><path class="fig-fill" transform="translate(400 0) scale(-1 1)" d="${FILL}"/>
      <path class="fig-line" d="${HALF}"/><path class="fig-line" transform="translate(400 0) scale(-1 1)" d="${HALF}"/>
      <rect class="fig-seam" x="176" y="108" width="48" height="10"/>
      ${lines}
    </svg>`;
  };
  M.figureActive = (root, key, val) => {
    M.$$('.m-line', root).forEach((g) => {
      const on = g.dataset.line === key;
      g.classList.toggle('on', on);
    });
    if (key) M.figureValue(root, key, val);
  };
  M.figureValue = (root, key, val) => {
    const g = M.$(`.m-line[data-line="${key}"] .m-val`, root);
    if (g) g.textContent = val ? `${val} см` : '';
  };
  /* Плавный наезд камеры на нужный участок тела */
  M.figureFocus = (svg, box, ms = 700) => {
    const from = svg.viewBox.baseVal;
    const a = [from.x, from.y, from.width, from.height];
    const start = performance.now();
    cancelAnimationFrame(svg._raf);
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = Math.min(1, (now - start) / (M.reduced ? 1 : ms));
      const k = ease(t);
      const v = a.map((x, i) => x + (box[i] - x) * k);
      svg.setAttribute('viewBox', v.join(' '));
      const scale = Math.min(svg.clientWidth / v[2], svg.clientHeight / v[3]) || 1;
      svg.style.setProperty('--sw', 2 / scale);
      if (t < 1) svg._raf = requestAnimationFrame(step);
    };
    svg._raf = requestAnimationFrame(step);
  };
})();
