/* Вариант 2 «Лекало»: белый и чёрный с латте, крупный гротеск. На заказ: живой конструктор изделия */
(function () {
  const { $, $$, ic, esc, fmt, look, pic, data: D } = M;
  const Cc = M.coat;

  const header = () => `
    <header class="head">
      <a class="logo" href="#/" aria-label="MASY, на главную">MASY</a>
      <nav class="head-nav">
        <a href="#/catalog" data-nav>Каталог</a>
        <a href="#/atelier" data-nav>Конструктор</a>
        <a href="#/about" data-nav>Бренд</a>
        <a href="#/contacts" data-nav>Шоурум</a>
      </nav>
      <div class="head-r">
        <button data-open="search">Поиск</button>
        <a href="#/favorites">Избранное <sup data-wish-count>0</sup></a>
        <button data-open="cart">Корзина <sup data-cart-count>0</sup></button>
        <button class="head-burger" data-open="menu" aria-label="Меню">${ic.menu}</button>
      </div>
    </header>`;

  const menu = () => `
    <div class="menu-full">
      <header><a class="logo" href="#/" data-close>MASY</a><button data-close aria-label="Закрыть">${ic.close}</button></header>
      <nav>
        <a href="#/catalog" data-close>Каталог</a>
        <a href="#/atelier" data-close>Конструктор</a>
        <a href="#/about" data-close>Бренд</a>
        <a href="#/delivery" data-close>Доставка</a>
        <a href="#/contacts" data-close>Шоурум</a>
      </nav>
      <div class="menu-foot"><a href="tel:${D.brand.phones[0].h}">${D.brand.phones[0].p}</a><a href="${D.brand.telegram}" target="_blank" rel="noopener">Telegram</a></div>
    </div>`;

  const footer = () => `
    <footer class="foot">
      <div class="foot-cols">
        <div><h4>Каталог</h4>${D.cats.map((c) => `<a href="#/catalog?cat=${c[0]}">${esc(c[1])}</a>`).join('')}</div>
        <div><h4>Заказ</h4><a href="#/atelier">Конструктор</a><a href="#/delivery">Доставка и оплата</a><button data-open="sizes">Таблица размеров</button><a href="${D.brand.uds}" target="_blank" rel="noopener">Бонусы UDS</a></div>
        <div><h4>Контакты</h4>${D.brand.phones.map((p) => `<a href="tel:${p.h}">${p.p}</a>`).join('')}<a href="${D.brand.telegram}" target="_blank" rel="noopener">Telegram</a><a href="${D.brand.vk}" target="_blank" rel="noopener">ВКонтакте</a></div>
        <div><h4>Шоурум</h4><p>${D.brand.address}<br>${D.brand.addressMore}</p><p>${D.brand.hours.map((h) => h.join(' ')).join('<br>')}</p></div>
      </div>
      <div class="foot-mark" aria-hidden="true">MASY</div>
      <div class="foot-end"><span>© ${new Date().getFullYear()} ${D.brand.legal}</span><span>Российский бренд женской одежды</span></div>
    </footer>`;

  /* ========= Главная ========= */
  const INDEX = [['coats', 'coat_near'], ['furs', 'fur_beige'], ['jackets', 'cream_jacket'], ['suits', 'voile'], ['dresses', 'silk']];

  M.views.home = () => ({
    title: 'MASY — российский бренд женской одежды',
    header: 'overlay',
    html: `
    <section class="tri" id="tri">
      <a class="tri-p" href="#/catalog?cat=furs" data-speed=".05"><img ${pic('fur_mocha', '(max-width: 760px) 50vw, 34vw')} alt="" fetchpriority="high"></a>
      <a class="tri-p" href="#/catalog?cat=coats" data-speed="-.04"><img ${pic('trench_a', '(max-width: 760px) 50vw, 34vw')} alt="" fetchpriority="high"></a>
      <a class="tri-p" href="#/catalog?cat=coats" data-speed=".07"><img ${pic('coat_walk', '(max-width: 760px) 50vw, 34vw')} alt="" fetchpriority="high"></a>
      <h1 class="tri-mark">MASY</h1>
      <div class="tri-foot"><span>Собственное производство<br>Пермь</span><a href="#/catalog">Каталог ${ic.arrow}</a></div>
    </section>

    <section class="new">
      <header class="sec-head" data-reveal><h2>Новое и любимое</h2><a href="#/catalog">Все модели ${ic.arrow}</a></header>
      <div class="grid">${M.sorted(D.products).slice(0, 8).map((p) => M.card(p)).join('')}</div>
    </section>

    <section class="idx" id="idx">
      <ul>
        ${INDEX.map((c, i) => `<li data-reveal><a href="#/catalog?cat=${c[0]}" data-look="${look(c[1])}"><span class="idx-n">${String(i + 1).padStart(2, '0')}</span><span class="idx-t">${esc(M.catName(c[0]))}</span><span class="idx-c">${D.products.filter((p) => p.cat === c[0]).length}</span></a></li>`).join('')}
      </ul>
      <div class="idx-float" id="idxFloat" aria-hidden="true"><img alt=""></div>
    </section>

    <section class="tease">
      <div class="tease-l" data-reveal>
        <small>Индивидуальный заказ</small>
        <h2>Соберите своё пальто. Чертёж меняется вместе с&nbsp;вами</h2>
        <p>Длина, силуэт, воротник, ткань: выбирайте, и лекало перестраивается на глазах. Мерки подскажем, как снять, а сошьём сами.</p>
        <a class="btn btn-solid" href="#/atelier">Открыть конструктор</a>
      </div>
      <div class="tease-r" id="teaseCoat" data-reveal>${M.coatSVG({ cls: 'coat-tease' })}</div>
    </section>

    <section class="ways">
      <a class="way" href="#/catalog" data-reveal><span>A</span><div><h3>Заказ из наличия</h3><p>Готовые модели. Выберите размер, а если нужно, подгоним по вашим меркам.</p></div>${ic.arrow}</a>
      <a class="way" href="#/atelier" data-reveal><span>B</span><div><h3>Индивидуальный заказ</h3><p>Шьём с нуля под вашу фигуру. Начните с конструктора.</p></div>${ic.arrow}</a>
    </section>

    <section class="band"><img ${pic('coat_steps', '100vw')} alt="" loading="lazy"><p data-reveal>Мода переменчива,<br>стиль вечен</p></section>`,
    mount(root) {
      const panes = $$('.tri-p', root);
      const onScroll = () => {
        const y = window.scrollY;
        if (y > innerHeight * 1.2) return;
        panes.forEach((p) => { p.firstElementChild.style.transform = `translateY(${y * +p.dataset.speed}px) scale(1.1)`; });
        $('.tri-mark', root).style.transform = `translate(-50%, ${y * -0.12}px)`;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      const fl = $('#idxFloat', root), im = fl.firstElementChild;
      const idx = $('#idx', root);
      const canHover = matchMedia('(hover: hover)').matches;
      if (canHover) {
        $$('.idx a', root).forEach((a) => a.addEventListener('mouseenter', () => { im.src = a.dataset.look; fl.classList.add('on'); }));
        idx.addEventListener('mouseleave', () => fl.classList.remove('on'));
        idx.addEventListener('mousemove', (e) => {
          const r = idx.getBoundingClientRect();
          fl.style.transform = `translate(${e.clientX - r.left + 26}px, ${e.clientY - r.top - 150}px)`;
        });
      }

      // Чертёж на главной сам примеряет разные варианты
      const svg = $('#teaseCoat svg', root);
      let n = 0;
      const seq = Cc.bases.map((b) => b.set);
      M.coatApply(svg, seq[0], false);
      const t = setInterval(() => { n = (n + 1) % seq.length; M.coatApply(svg, seq[n]); }, 2600);
      return () => { clearInterval(t); window.removeEventListener('scroll', onScroll); };
    },
  });

  /* ========= Конструктор ========= */
  const chips = (name, list, val) => `<div class="opts-row" data-opt="${name}">${list.map((o) => `<button type="button" class="o ${o[0] === val ? 'on' : ''}" data-v="${o[0]}">${esc(o[1])}</button>`).join('')}</div>`;

  /* Шаги мерок: от самостоятельного замера до визита в шоурум */
  const dayChips = () => {
    const out = [];
    const names = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(Date.now() + i * 864e5);
      out.push({ v: `${d.getDate()} ${months[d.getMonth()]}`, w: names[d.getDay()], end: d.getDay() === 0 || d.getDay() === 6 });
    }
    return out;
  };

  M.views.atelier = (q) => {
    const model = q.model ? M.byId(q.model) : null;
    const guess = model ? (model.cat === 'coats' ? (/[Тт]ренч/.test(model.name) ? 'trench' : /Пилот/.test(model.name) ? 'pilot' : 'coat') : model.cat === 'suits' ? 'blazer' : 'coat') : 'coat';
    const st = { base: guess, ...Cc.bases.find((b) => b.k === guess).set, way: 'self', when: '', time: '', place: 'Шоурум в Перми' };
    const vals = M.getMeasures();
    const flat = {};
    const SELF = ['height', 'bust', 'waist', 'hips', 'shoulder', 'sleeve', 'back', 'leg'];
    const FLAT = [
      ['chest', 'Ширина по груди', 'От шва до шва под проймами', 'M155 210 L365 210'],
      ['shoulder', 'Ширина плеч', 'Между плечевыми швами', 'M180 104 L340 104'],
      ['sleeve', 'Длина рукава', 'От плечевого шва до края', 'M340 104 L388 372'],
      ['length', 'Длина изделия', 'От плеча вниз по центру спины', 'M260 70 L260 610'],
    ];
    const baseTiles = Cc.bases.map((b) => `<button type="button" class="base ${b.k === st.base ? 'on' : ''}" data-base="${b.k}"><span class="base-svg" data-preset="${b.k}">${M.coatSVG({ cls: 'coat-mini' })}</span><b>${b.name}</b><small>от ${fmt(b.price)}</small></button>`).join('');
    return {
      title: 'Конструктор — MASY',
      html: `
      <section class="kit">
        <div class="kit-stage" id="stage">
          <div class="stage-top"><span id="stageName">Лекало №1</span><span class="stage-hint">Чертёж обновляется при каждом выборе</span></div>
          <div class="stage-coat" id="stageCoat">${M.coatSVG()}</div>
          <div class="stage-fig" id="stageFig" hidden>${M.figure()}</div>
          <div class="stage-sum"><div><small>Ориентир</small><b id="kitPrice"></b></div><p>По цене похожей готовой модели. Точную стоимость назовём после согласования.</p></div>
        </div>
        <div class="kit-flow">
          <header class="kit-head">
            <small>На заказ</small>
            <h1>Сшейте вещь такой, какой вы её видите</h1>
            <div class="kit-fork">
              <a href="#/catalog">Нужна готовая вещь? <u>Заказ из наличия</u></a>
              ${model ? `<span class="kit-model"><img src="${M.img(model)}" alt="">За основу: ${esc(model.name)}</span>` : ''}
            </div>
          </header>

          <section class="step" data-step="1">
            <h2><span>01</span>Основа</h2>
            <div class="bases">${baseTiles}</div>
          </section>

          <section class="step" data-step="2">
            <h2><span>02</span>Форма</h2>
            <div class="row"><label>Длина</label>${chips('len', Cc.lengths, st.len)}</div>
            <div class="row"><label>Силуэт</label>${chips('fit', Cc.fits, st.fit)}</div>
            <div class="row"><label>Рукав</label>${chips('sleeve', Cc.sleeves, st.sleeve)}</div>
            <div class="row"><label>Воротник</label>${chips('collar', Cc.collars, st.collar)}</div>
            <div class="row"><label>Застёжка</label>${chips('closure', Cc.closures, st.closure)}</div>
            <div class="row"><label>Карманы</label>${chips('pocket', Cc.pockets, st.pocket)}</div>
            <div class="row"><label>Пояс</label><button type="button" class="toggle ${st.belt ? 'on' : ''}" id="beltT" role="switch" aria-checked="${!!st.belt}" aria-label="Пояс"><i></i></button></div>
          </section>

          <section class="step" data-step="3">
            <h2><span>03</span>Ткань и цвет</h2>
            <div class="row"><label>Ткань</label>${chips('material', Cc.materials.map((m) => [m, m]), st.material)}</div>
            <div class="row"><label>Цвет</label><div class="fabs" data-opt="fabric">${Cc.fabrics.map((f) => `<button type="button" class="fab ${f[0] === st.fabric ? 'on' : ''}" data-v="${f[0]}" style="--c:${f[1]}" aria-label="${f[0]}"><i></i><span>${f[0]}</span></button>`).join('')}</div></div>
          </section>

          <section class="step" data-step="4">
            <h2><span>04</span>Мерки</h2>
            <div class="ways-t" role="tablist">
              <button type="button" class="wt on" data-way="self"><b>Измерю себя</b><small>5 минут и сантиметровая лента</small></button>
              <button type="button" class="wt" data-way="flat"><b>По любимой вещи</b><small>Лента и вещь, которая хорошо сидит</small></button>
              <button type="button" class="wt" data-way="master"><b>С мастером</b><small>В шоуруме или по видеосвязи</small></button>
            </div>
            <div class="way-pane" data-pane="self">
              <p class="way-note">Нажмите на поле, и на фигуре слева появится линия замера.</p>
              <div class="m-grid">${SELF.map((k) => { const m = M.measureBy(k); return `<label class="m-f" data-k="${k}"><span>${m.name}</span><input type="number" inputmode="decimal" step="0.5" min="${m.min}" max="${m.max}" placeholder="${m.def}" value="${vals[k] || ''}"><em>см</em></label>`; }).join('')}</div>
              <p class="m-how" id="mHow"></p>
            </div>
            <div class="way-pane" data-pane="flat" hidden>
              <p class="way-note">Положите на стол вещь, которая сидит на вас идеально, расправьте и измерьте. Самый простой способ для верхней одежды.</p>
              <div class="m-grid">${FLAT.map((f) => `<label class="m-f" data-flat="${f[0]}"><span>${f[1]}</span><input type="number" inputmode="decimal" step="0.5" placeholder="см"><em>см</em><small>${f[2]}</small></label>`).join('')}</div>
            </div>
            <div class="way-pane" data-pane="master" hidden>
              <p class="way-note">Снимем мерки сами: приезжайте в шоурум или созвонимся по видеосвязи.</p>
              <div class="opts-row" data-opt="place">${['Шоурум в Перми', 'Видеозвонок'].map((o, i) => `<button type="button" class="o ${i === 0 ? 'on' : ''}" data-v="${o}">${o}</button>`).join('')}</div>
              <div class="days" id="days">${dayChips().map((d) => `<button type="button" class="day" data-v="${d.v}" data-end="${d.end ? 1 : 0}"><small>${d.w}</small>${d.v}</button>`).join('')}</div>
              <div class="times" id="times"></div>
            </div>
          </section>

          <section class="step" data-step="5">
            <h2><span>05</span>Заявка</h2>
            <dl class="spec" id="spec"></dl>
            ${M.requestForm({ cta: 'Отправить лекало мастеру' })}
            <p class="way-note">Шить начинаем только после вашего согласия на стоимость и срок.</p>
          </section>
        </div>
      </section>`,
      mount(root) {
        const svg = $('#stageCoat svg', root);
        const figWrap = $('#stageFig', root), coatWrap = $('#stageCoat', root);
        const update = (animate = true) => {
          M.coatApply(svg, st, animate);
          const b = Cc.bases.find((x) => x.k === st.base);
          $('#kitPrice', root).textContent = `от ${fmt(b.price)}`;
          $('#stageName', root).textContent = `${b.name}: ${Cc.lengths.find((l) => l[0] === st.len)[1].toLowerCase()}, ${st.fabric.toLowerCase()}`;
          const lab = M.coatLabel(st);
          $('#spec', root).innerHTML = Object.entries(lab).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
        };
        const showFig = (on) => { figWrap.hidden = !on; coatWrap.hidden = on; };
        const syncChips = () => {
          $$('[data-opt]', root).forEach((row) => {
            const k = row.dataset.opt;
            $$('[data-v]', row).forEach((b) => b.classList.toggle('on', b.dataset.v === st[k]));
          });
          const t = $('#beltT', root);
          t.classList.toggle('on', !!st.belt);
          t.setAttribute('aria-checked', String(!!st.belt));
        };
        // Мини-чертежи основ
        $$('.base-svg', root).forEach((w) => {
          const b = Cc.bases.find((x) => x.k === w.dataset.preset);
          M.coatApply(w.querySelector('svg'), b.set, false);
        });
        $$('.base', root).forEach((btn) => btn.addEventListener('click', () => {
          const b = Cc.bases.find((x) => x.k === btn.dataset.base);
          st.base = b.k;
          Object.assign(st, b.set);
          $$('.base', root).forEach((x) => x.classList.toggle('on', x === btn));
          syncChips();
          showFig(false);
          update();
        }));
        $$('[data-opt]', root).forEach((row) => row.addEventListener('click', (e) => {
          const b = e.target.closest('[data-v]');
          if (!b) return;
          st[row.dataset.opt] = b.dataset.v;
          if (row.dataset.opt === 'closure' && b.dataset.v === 'wrap') st.belt = true;
          syncChips();
          showFig(false);
          update();
        }));
        $('#beltT', root).addEventListener('click', () => { st.belt = !st.belt; syncChips(); showFig(false); update(); });

        // Способ замера
        $$('.wt', root).forEach((t) => t.addEventListener('click', () => {
          st.way = t.dataset.way;
          $$('.wt', root).forEach((x) => x.classList.toggle('on', x === t));
          $$('.way-pane', root).forEach((p) => { p.hidden = p.dataset.pane !== st.way; });
          showFig(false);
        }));
        // Фокус на поле показывает фигуру с линией замера
        const how = $('#mHow', root);
        $$('.m-f[data-k]', root).forEach((f) => {
          const k = f.dataset.k, m = M.measureBy(k), inp = f.querySelector('input');
          const activate = () => {
            showFig(true);
            M.figureActive(figWrap, k, inp.value);
            how.innerHTML = `<b>${m.name}.</b> ${m.how} <span>${m.tip}</span>`;
            how.classList.add('on');
          };
          inp.addEventListener('focus', activate);
          inp.addEventListener('input', () => {
            M.figureValue(figWrap, k, inp.value);
            const n = parseFloat(inp.value);
            if (n) vals[k] = n; else delete vals[k];
            M.setMeasures(vals);
          });
        });
        $$('.m-f[data-flat] input', root).forEach((i) => i.addEventListener('input', () => { flat[i.closest('.m-f').dataset.flat] = i.value; }));

        // Встреча с мастером: время зависит от часов работы шоурума
        const days = $('#days', root), times = $('#times', root);
        const drawTimes = (weekend) => {
          const slots = weekend ? ['14:00', '15:00', '16:00', '17:00'] : ['15:00', '16:00', '17:00', '18:00', '19:00'];
          times.innerHTML = slots.map((t) => `<button type="button" class="o" data-t="${t}">${t}</button>`).join('');
        };
        days.addEventListener('click', (e) => {
          const b = e.target.closest('.day');
          if (!b) return;
          st.when = b.dataset.v; st.time = '';
          $$('.day', days).forEach((x) => x.classList.toggle('on', x === b));
          drawTimes(b.dataset.end === '1');
        });
        times.addEventListener('click', (e) => {
          const b = e.target.closest('[data-t]');
          if (!b) return;
          st.time = b.dataset.t;
          $$('[data-t]', times).forEach((x) => x.classList.toggle('on', x === b));
        });

        M.bindRequest(root, () => {
          const lab = M.coatLabel(st);
          const spec = Object.entries(lab).map(([k, v]) => `${k}: ${v}`).join('; ');
          const b = Cc.bases.find((x) => x.k === st.base);
          let mes = '';
          if (st.way === 'self') mes = 'Мерки: ' + M.measureLine(vals);
          if (st.way === 'flat') mes = 'Замеры вещи: ' + FLAT.filter((f) => flat[f[0]]).map((f) => `${f[1].toLowerCase()} ${flat[f[0]]} см`).join(', ');
          if (st.way === 'master') mes = `Замер с мастером: ${st.place}${st.when ? ', ' + st.when : ''}${st.time ? ' в ' + st.time : ''}`;
          return `${model ? `Модель из каталога: ${model.name}\n` : ''}${b.name}. ${spec}\n${mes}`;
        });
        syncChips();
        update(false);
      },
    };
  };

  /* ========= Бренд ========= */
  M.views.about = () => ({
    title: 'Бренд — MASY',
    html: `
    <section class="ab">
      <h1 class="ab-big" data-reveal>Быть собой.<br>Всё остальное<br>мы сошьём.</h1>
      <div class="ab-row">
        <div class="ab-img" data-reveal><img ${pic('bomber')} alt=""></div>
        <div class="ab-tx" data-reveal>
          <p>MASY — российский бренд с собственным производством женской одежды в Перми. Мы создаём стильные, удобные и качественные вещи, среди которых каждая девушка и женщина может найти отклик своего внутреннего «Я».</p>
          <p>Секрет женского обаяния в том, чтобы быть собой: полюбить себя и жить в гармонии с собой. Поэтому у нас возможен и индивидуальный пошив, и коррекция изделия из наличия по вашим меркам.</p>
          <dl class="spec"><div><dt>Производство</dt><dd>Собственное</dd></div><div><dt>Шоурум</dt><dd>Пермь, ул. Революции, 20</dd></div><div><dt>Доставка</dt><dd>По всему миру</dd></div><div><dt>Руководители</dt><dd>Ольга Сутягина, Анастасия Тюмисова</dd></div></dl>
          <a class="btn btn-solid" href="#/atelier">Собрать своё изделие</a>
        </div>
      </div>
    </section>`,
  });

  M.start({ header, footer, menu });
})();
