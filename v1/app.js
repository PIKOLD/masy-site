/* Вариант 1 «Ателье»: ближе всего к 12 STOREEZ. На заказ: две сноски и гид-силуэт */
(function () {
  const { $, $$, ic, esc, fmt, look, pic, data: D } = M;

  const header = () => `
    <div class="promo"><div class="promo-track">${Array(8).fill('<span>Собственное производство</span><i></i><span>Пошив по вашим меркам</span><i></i><span>Доставка по всему миру</span><i></i>').join('')}</div></div>
    <header class="head">
      <div class="head-l">
        <button class="ib" data-open="menu" aria-label="Меню">${ic.menu}</button>
        <nav class="head-nav">
          <a href="#/catalog" data-nav>Каталог</a>
          <a href="#/atelier" data-nav>На заказ</a>
          <a href="#/about" data-nav>О бренде</a>
        </nav>
      </div>
      <a class="logo" href="#/" aria-label="MASY, на главную">MASY</a>
      <div class="head-r">
        <button class="ib" data-open="search" aria-label="Поиск">${ic.search}</button>
        <a class="ib" href="#/favorites" aria-label="Избранное">${ic.heart}<sup data-wish-count></sup></a>
        <button class="ib" data-open="cart" aria-label="Корзина">${ic.bag}<sup data-cart-count></sup></button>
      </div>
    </header>`;

  const menu = () => `
    <div class="drawer-veil" data-close></div>
    <aside class="menu-panel">
      <header><a class="logo" href="#/" data-close>MASY</a><button data-close aria-label="Закрыть">${ic.close}</button></header>
      <nav class="menu-main">
        <a href="#/catalog" data-close>Вся одежда</a>
        ${D.cats.map((c) => `<a href="#/catalog?cat=${c[0]}" data-close>${esc(c[1])}</a>`).join('')}
      </nav>
      <nav class="menu-sub">
        <a href="#/atelier" data-close>Пошив на заказ</a>
        <a href="#/about" data-close>О бренде</a>
        <a href="#/delivery" data-close>Доставка и оплата</a>
        <a href="#/contacts" data-close>Шоурум и контакты</a>
      </nav>
      <div class="menu-foot"><a href="tel:${D.brand.phones[0].h}">${D.brand.phones[0].p}</a><a href="${D.brand.telegram}" target="_blank" rel="noopener">Telegram</a></div>
    </aside>`;

  const footer = () => `
    <footer class="foot">
      <div class="foot-quote"><p>Мода переменчива,<br>стиль вечен</p></div>
      <div class="foot-cols">
        <div><h4>Покупателям</h4><a href="#/catalog">Каталог</a><a href="#/atelier">Пошив на заказ</a><a href="#/delivery">Доставка и оплата</a><button data-open="sizes">Таблица размеров</button></div>
        <div><h4>MASY</h4><a href="#/about">О бренде</a><a href="#/contacts">Шоурум</a><a href="${D.brand.uds}" target="_blank" rel="noopener">Бонусы UDS</a></div>
        <div><h4>На связи</h4>${D.brand.phones.map((p) => `<a href="tel:${p.h}">${p.p}, ${p.n}</a>`).join('')}<a href="${D.brand.telegram}" target="_blank" rel="noopener">Telegram</a><a href="${D.brand.vk}" target="_blank" rel="noopener">ВКонтакте</a></div>
        <div><h4>Шоурум</h4><p>${D.brand.address}<br>${D.brand.addressMore}</p><p>${D.brand.hours.map((h) => h.join(' ')).join('<br>')}</p></div>
      </div>
      <div class="foot-end"><span class="foot-mark">MASY</span><span>© ${new Date().getFullYear()} ${D.brand.legal}</span></div>
    </footer>`;

  /* ========= Главная ========= */
  const SLIDES = [
    { a: 'trench_a', b: 'trench_b', eyebrow: 'Новый сезон', title: 'Тренчи и пальто', href: '#/catalog?cat=coats' },
    { a: 'fur_beige', b: 'fur_mocha', eyebrow: 'Зима', title: 'Шубы из экомеха', href: '#/catalog?cat=furs' },
    { a: 'voile', b: 'lace', eyebrow: 'Лето', title: 'Вуаль и кружево', href: '#/catalog?season=summer' },
  ];
  const TILES = [
    ['coats', 'coat_near', 'Пальто и тренчи'],
    ['furs', 'fur_smoke', 'Шубы и бомберы'],
    ['jackets', 'cream_jacket', 'Куртки и жилеты'],
    ['suits', 'jersey', 'Костюмы'],
    ['dresses', 'dress_light', 'Платья'],
  ];

  M.views.home = () => ({
    title: 'MASY — российский бренд женской одежды',
    header: 'overlay',
    html: `
    <section class="hero" id="hero">
      ${SLIDES.map((s, i) => `<a class="hero-slide ${i === 0 ? 'on' : ''}" href="${s.href}" data-slide="${i}">
        <span class="hero-pane"><img ${pic(s.a)} alt="" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></span>
        <span class="hero-pane"><img ${pic(s.b)} alt="" ${i ? 'loading="lazy"' : ''}></span>
        <span class="hero-text"><small>${s.eyebrow}</small><strong>${s.title}</strong></span>
      </a>`).join('')}
      <div class="hero-ui">
        <div class="hero-bars">${SLIDES.map((s, i) => `<button data-go="${i}" aria-label="Слайд ${i + 1}"><i></i></button>`).join('')}</div>
        <span class="hero-more">Смотреть</span>
      </div>
    </section>

    <section class="tiles">
      ${TILES.map((t, i) => `<a class="tile" href="#/catalog?cat=${t[0]}" data-reveal style="transition-delay:${i * 60}ms"><span class="tile-img"><img ${pic(t[1], '(max-width: 760px) 50vw, 20vw')} alt="" loading="lazy"></span><span class="tile-name">${t[2]}</span></a>`).join('')}
    </section>

    <section class="rail-sec">
      <header class="rail-head" data-reveal><h2 class="section-title">Рекомендуем</h2><a class="link" href="#/catalog">Весь каталог ${ic.arrow}</a></header>
      <div class="rail" data-drag>${M.sorted(D.products).slice(0, 10).map((p) => M.card(p, { cls: 'rail-card' })).join('')}</div>
    </section>

    <section class="made">
      <div class="made-photo" data-reveal><img ${pic('jacket_near')} alt="Куртка MASY с высоким воротником" loading="lazy"></div>
      <div class="made-body" data-reveal>
        <small class="eyebrow">На заказ</small>
        <h2 class="made-title">Эта вещь может сесть только на&nbsp;вас</h2>
        <div class="fork">
          <a class="fork-item" href="#/catalog"><span class="fork-n">1</span><span><b>Заказ из наличия</b><small>Выбираете готовую модель и размер. Если нужно, подгоняем её по вашим меркам.</small></span>${ic.arrow}</a>
          <a class="fork-item" href="#/atelier"><span class="fork-n">2</span><span><b>Индивидуальный заказ</b><small>Шьём с нуля по вашим меркам. Гид покажет, как правильно измерить себя за 5 минут.</small></span>${ic.arrow}</a>
        </div>
      </div>
    </section>

    <section class="pair">
      <a class="pair-item" href="#/catalog?season=winter" data-reveal><span><img ${pic('fur_mocha_b', '(max-width: 760px) 50vw, 33vw')} alt="" loading="lazy"></span><div><small>Зима</small><h3>Мягкая зима</h3></div></a>
      <a class="pair-item pair-down" href="#/catalog?season=summer" data-reveal><span><img ${pic('blue', '(max-width: 760px) 50vw, 33vw')} alt="" loading="lazy"></span><div><small>Лето</small><h3>Лёгкие ткани</h3></div></a>
      <a class="pair-item" href="#/product/8733234" data-reveal><span><img ${pic('silk_two', '(max-width: 760px) 100vw, 33vw')} alt="" loading="lazy"></span><div><small>Вечер</small><h3>Плотный шёлк</h3></div></a>
    </section>

    <section class="manifest" data-reveal>
      <p>Одежда, среди которой каждая девушка и&nbsp;женщина находит отклик своего внутреннего&nbsp;«Я».</p>
      <a class="link" href="#/about">О бренде ${ic.arrow}</a>
    </section>

    <section class="visit">
      <div class="visit-body" data-reveal>
        <small class="eyebrow">Шоурум</small>
        <h2>Примерьте в&nbsp;Перми</h2>
        <p>${D.brand.address}<br>${D.brand.addressMore}</p>
        <p class="muted">${D.brand.hours.map((h) => h.join(' ')).join(' · ')}</p>
        <a class="link" href="#/contacts">Как добраться ${ic.arrow}</a>
      </div>
      <div class="visit-img" data-reveal><img ${pic('jacket_full')} alt="Образ MASY" loading="lazy"></div>
    </section>`,
    mount(root) {
      const slides = $$('.hero-slide', root), bars = $$('.hero-bars button', root);
      let i = 0, timer;
      const DUR = 6500;
      const show = (n) => {
        i = (n + slides.length) % slides.length;
        slides.forEach((s, k) => s.classList.toggle('on', k === i));
        bars.forEach((b, k) => { b.classList.remove('run', 'past'); if (k < i) b.classList.add('past'); });
        void bars[i].offsetWidth;
        bars[i].classList.add('run');
        clearTimeout(timer);
        timer = setTimeout(() => show(i + 1), DUR);
      };
      bars.forEach((b, k) => b.addEventListener('click', () => show(k)));
      show(0);
      return () => clearTimeout(timer);
    },
  });

  /* ========= На заказ: две сноски и гид-силуэт ========= */
  M.views.atelier = (q) => {
    const model = q.model ? M.byId(q.model) : null;
    const saved = M.getMeasures();
    return {
      title: 'Пошив на заказ — MASY',
      header: 'overlay',
      html: `
      <section class="at-hero">
        <div class="at-hero-img"><img ${pic('coat_walk')} alt=""></div>
        <div class="at-hero-text">
          <small>На заказ</small>
          <h1>Сошьём по&nbsp;вашим меркам</h1>
          <p>Можно взять модель из наличия и подогнать её или сшить вещь с нуля. Выберите, что вам ближе.</p>
        </div>
      </section>

      <section class="at-fork">
        <article class="at-way" data-reveal>
          <span class="at-way-n">1</span>
          <h2>Заказ из наличия</h2>
          <p>Готовая модель вашего размера. Отправим как есть или подгоним рукав, длину и талию по меркам.</p>
          <ul><li>Выбираете модель и размер</li><li>Уточняем подгонку, если она нужна</li><li>Оплачиваете по QR-коду и получаете</li></ul>
          <a class="btn btn-line" href="#/catalog">Смотреть наличие</a>
        </article>
        <article class="at-way at-way-dark" data-reveal>
          <span class="at-way-n">2</span>
          <h2>Индивидуальный заказ</h2>
          <p>Берём за основу модель бренда или вашу идею и шьём под вашу фигуру: длина, ткань, цвет и детали на ваш выбор.</p>
          <ul><li>Снимаете мерки с нашим гидом</li><li>Согласуем модель, ткань и стоимость</li><li>Шьём и отправляем готовую вещь</li></ul>
          <a class="btn btn-light" href="#guide" id="toGuide">Снять мерки</a>
        </article>
      </section>

      <section class="guide" id="guide">
        <header class="guide-head" data-reveal>
          <h2>Как правильно снять мерки</h2>
          <p>Нужны только сантиметровая лента и зеркало. Встаньте прямо, в тонкой облегающей одежде. Это займёт около 5 минут.</p>
        </header>
        <div class="guide-body" data-reveal>
          <ol class="guide-list" id="gList"></ol>
          <div class="guide-fig" id="gFig">${M.figure()}</div>
          <div class="guide-card" id="gCard"></div>
        </div>
      </section>

      <section class="result" id="result" hidden>
        <div class="result-grid">
          <div class="result-card">
            <small class="eyebrow">Ваша мерочная карта</small>
            <h2 id="rSize"></h2>
            <p class="muted" id="rNote"></p>
            <dl class="result-list" id="rList"></dl>
            <button class="link-sm" id="rEdit">Изменить мерки</button>
          </div>
          <div class="result-form">
            <h3>Осталось отправить заявку</h3>
            ${model ? `<div class="result-model"><img src="${M.img(model)}" alt=""><span><small>Модель</small>${esc(model.name)}, ${esc(model.color)}</span></div>` : ''}
            ${M.requestForm()}
            <p class="form-foot">Перезвоним или напишем, уточним детали и назовём стоимость и срок. Шить начинаем только после вашего согласия.</p>
          </div>
        </div>
      </section>

      <section class="at-faq">
        <h2 class="section-title" data-reveal>Частые вопросы</h2>
        <div class="acc" data-reveal>
          ${M.acc('Можно изменить модель из каталога?', '<p>Да. Длину, рукав, ткань и цвет обсуждаем индивидуально. Пришлите фото или ссылку на вещь, которая вам нравится.</p>')}
          ${M.acc('Что, если я ошибусь в мерках?', '<p>Перед началом работы мы сверяем мерки с вами и задаём уточняющие вопросы. Если вы в Перми, снимем мерки в шоуруме.</p>')}
          ${M.acc('Сколько стоит и сколько ждать?', '<p>Зависит от модели и ткани: точную стоимость и срок назовём после согласования деталей.</p>')}
          ${M.acc('Как оплатить?', `<p>Только по QR-коду на расчётный счёт ${D.brand.legal}. Переводы на карту мы не принимаем.</p>`)}
        </div>
      </section>`,
      mount(root) {
        const list = M.measures;
        const vals = { ...saved };
        let cur = 0;
        const gList = $('#gList', root), gCard = $('#gCard', root), fig = $('#gFig', root);
        const drawList = () => {
          gList.innerHTML = list.map((m, i) => `<li><button class="g-item ${i === cur ? 'on' : ''} ${vals[m.k] ? 'done' : ''}" data-i="${i}"><span class="g-n">${String(i + 1).padStart(2, '0')}</span><span class="g-name">${m.name}</span><span class="g-val">${vals[m.k] ? vals[m.k] + ' см' : ''}</span></button></li>`).join('');
        };
        const drawCard = () => {
          const m = list[cur];
          const v = vals[m.k] || '';
          gCard.innerHTML = `<div class="g-card-in" key="${m.k}">
            <small class="eyebrow">Шаг ${cur + 1} из ${list.length}</small>
            <h3>${m.name}</h3>
            <p>${m.how}</p>
            <p class="g-tip">${m.tip}</p>
            <label class="g-input"><button type="button" class="g-step" data-d="-0.5" aria-label="Меньше">${ic.minus}</button>
              <input id="gVal" type="number" inputmode="decimal" step="0.5" min="${m.min}" max="${m.max}" value="${v}" placeholder="${m.def}" aria-label="${m.name} в сантиметрах"><span>см</span>
              <button type="button" class="g-step" data-d="0.5" aria-label="Больше">${ic.plus}</button></label>
            <p class="g-err" id="gErr" hidden>Проверьте значение: обычно от ${m.min} до ${m.max} см</p>
            <div class="g-nav">
              <button class="link-sm" id="gPrev" ${cur === 0 ? 'hidden' : ''}>Назад</button>
              <button class="btn btn-solid" id="gNext">${cur === list.length - 1 ? 'Готово' : 'Дальше'}</button>
            </div>
            <div class="g-progress"><i style="width:${(Object.keys(vals).filter((k) => vals[k]).length / list.length) * 100}%"></i></div>
          </div>`;
          const input = $('#gVal', gCard);
          const save = () => {
            const n = parseFloat(input.value);
            if (!n) { delete vals[m.k]; M.figureValue(fig, m.k, ''); drawList(); return true; }
            if (n < m.min || n > m.max) { $('#gErr', gCard).hidden = false; return false; }
            vals[m.k] = n; M.figureValue(fig, m.k, n); M.setMeasures(vals); $('#gErr', gCard).hidden = true; drawList();
            return true;
          };
          input.addEventListener('input', () => { const n = parseFloat(input.value); M.figureValue(fig, m.k, n || ''); });
          input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); $('#gNext', gCard).click(); } });
          $$('.g-step', gCard).forEach((b) => b.addEventListener('click', (e) => {
            e.preventDefault();
            const base = parseFloat(input.value) || m.def;
            input.value = Math.min(m.max, Math.max(m.min, base + +b.dataset.d));
            M.figureValue(fig, m.k, input.value);
          }));
          $('#gNext', gCard).addEventListener('click', () => {
            if (!save()) return;
            if (cur < list.length - 1) go(cur + 1); else finish();
          });
          const prev = $('#gPrev', gCard);
          prev && prev.addEventListener('click', () => { save(); go(cur - 1); });
          M.figureActive(fig, m.k, v);
        };
        const go = (i) => { cur = i; drawList(); drawCard(); };
        gList.addEventListener('click', (e) => { const b = e.target.closest('.g-item'); if (b) go(+b.dataset.i); });
        const finish = () => {
          const rec = M.sizeFor(vals);
          const res = $('#result', root);
          res.hidden = false;
          $('#rSize', root).textContent = rec ? `Ближайший размер: ${rec.size}` : 'Мерки сохранены';
          $('#rNote', root).textContent = rec && rec.uneven ? 'Ваши обхваты попадают в разные размеры, поэтому индивидуальный пошив сядет заметно лучше готовой вещи.' : 'Модели из наличия этого размера должны сесть хорошо. Для идеальной посадки сошьём по этим меркам.';
          $('#rList', root).innerHTML = list.filter((m) => vals[m.k]).map((m) => `<div><dt>${m.name}</dt><dd>${vals[m.k]} см</dd></div>`).join('');
          res.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        $('#rEdit', root).addEventListener('click', () => { $('#guide', root).scrollIntoView({ behavior: 'smooth' }); });
        M.bindRequest(root, () => {
          const m = M.getMeasures();
          return `${model ? `Модель: ${model.name}, ${model.color}\n` : ''}Мерки: ${M.measureLine(m)}`;
        });
        $('#toGuide', root).addEventListener('click', (e) => { e.preventDefault(); $('#guide', root).scrollIntoView({ behavior: 'smooth' }); });
        drawList(); drawCard();
        Object.keys(vals).forEach((k) => M.figureValue(fig, k, vals[k]));
        if (q.model) setTimeout(() => $('#guide', root).scrollIntoView({ behavior: 'smooth' }), 500);
      },
    };
  };

  /* ========= О бренде ========= */
  M.views.about = () => ({
    title: 'О бренде — MASY',
    header: 'overlay',
    html: `
    <section class="ab-hero"><img ${pic('coat_near', '100vw')} alt=""><div><small>О бренде</small><h1>Быть собой</h1></div></section>
    <section class="ab-text" data-reveal>
      <p class="ab-lead">Секрет женского обаяния в том, чтобы полюбить себя, заботиться о себе и жить в гармонии с собой. Остаётся только правильно транслировать себя миру.</p>
      <p>MASY — российский бренд с собственным производством женской одежды в Перми. Мы создаём стильные, удобные и качественные вещи, среди которых каждая девушка и женщина может найти отклик своего внутреннего «Я».</p>
      <p>Для вашего удобства возможен и индивидуальный пошив, и коррекция изделия из наличия по вашим меркам.</p>
    </section>
    <section class="ab-duo">
      <div data-reveal><img ${pic('coat_side')} alt="" loading="lazy"></div>
      <div data-reveal><img ${pic('cap')} alt="" loading="lazy"></div>
    </section>
    <section class="ab-facts">
      <div data-reveal><h3>Своё производство</h3><p>Отшиваем коллекции сами и контролируем каждую вещь.</p></div>
      <div data-reveal><h3>Индивидуальный подход</h3><p>Подгоняем модели и шьём по параметрам клиента.</p></div>
      <div data-reveal><h3>Руководители бренда</h3><p>Ольга Сутягина и Анастасия Тюмисова.</p></div>
    </section>`,
  });

  M.start({ header, footer, menu });
})();
