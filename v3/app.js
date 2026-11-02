/* Вариант 3 «Лента»: тёплый беж и мокко, дидонная антиква, арки. На заказ: паспорт мерок и сантиметровая лента */
(function () {
  const { $, $$, ic, esc, fmt, look, pic, data: D } = M;

  const header = () => `
    <header class="head">
      <button class="head-link head-m" data-open="menu" aria-label="Меню">Меню</button>
      <nav class="head-nav">
        <a href="#/catalog" data-nav>Каталог</a>
        <a href="#/atelier" data-nav>Паспорт мерок</a>
        <a href="#/about" data-nav>О бренде</a>
      </nav>
      <a class="logo" href="#/" aria-label="MASY, на главную">MASY</a>
      <div class="head-r">
        <span class="head-pass" id="headPass" hidden></span>
        <button class="ib" data-open="search" aria-label="Поиск">${ic.search}</button>
        <a class="ib" href="#/favorites" aria-label="Избранное">${ic.heart}<sup data-wish-count></sup></a>
        <button class="ib" data-open="cart" aria-label="Корзина">${ic.bag}<sup data-cart-count></sup></button>
      </div>
    </header>`;

  const menu = () => `
    <div class="menu-sheet">
      <header><span class="logo">MASY</span><button data-close aria-label="Закрыть">${ic.close}</button></header>
      <nav class="menu-big">
        ${D.cats.map((c) => `<a href="#/catalog?cat=${c[0]}" data-close>${esc(c[1])}</a>`).join('')}
      </nav>
      <nav class="menu-small">
        <a href="#/atelier" data-close>Паспорт мерок</a><a href="#/about" data-close>О бренде</a><a href="#/delivery" data-close>Доставка и оплата</a><a href="#/contacts" data-close>Шоурум</a>
      </nav>
    </div>`;

  const footer = () => `
    <footer class="foot">
      <div class="foot-top">
        <p class="foot-line">Мода переменчива, стиль вечен</p>
        <a class="pill pill-light" href="#/catalog">В каталог</a>
      </div>
      <div class="foot-cols">
        <div><h4>Покупателям</h4><a href="#/catalog">Каталог</a><a href="#/atelier">Паспорт мерок</a><a href="#/delivery">Доставка и оплата</a><button data-open="sizes">Таблица размеров</button></div>
        <div><h4>Шоурум</h4><p>${D.brand.address}<br>${D.brand.addressMore}</p><p>${D.brand.hours.map((h) => h.join(' ')).join('<br>')}</p></div>
        <div><h4>На связи</h4>${D.brand.phones.map((p) => `<a href="tel:${p.h}">${p.p}</a>`).join('')}<a href="${D.brand.telegram}" target="_blank" rel="noopener">Telegram</a><a href="${D.brand.vk}" target="_blank" rel="noopener">ВКонтакте</a></div>
      </div>
      <div class="foot-end"><span>© ${new Date().getFullYear()} ${D.brand.legal}</span><span>Российский бренд женской одежды</span></div>
    </footer>`;

  const SEASONS = [
    ['autumn', 'coat_steps', 'Осень', 'Шерсть, тренчи, плащевые куртки'],
    ['winter', 'fur_beige_b', 'Зима', 'Экомех и тёплые куртки'],
    ['summer', 'lace_b', 'Лето', 'Вуаль, кружево и шёлк'],
    ['newyear', 'silk', 'Вечер', 'Платья из плотного шёлка'],
  ];

  /* ========= Главная ========= */
  M.views.home = () => ({
    title: 'MASY — российский бренд женской одежды',
    header: 'hero',
    html: `
    <section class="open" id="open">
      <div class="open-sticky">
        <h1 class="open-mark" id="openMark">MASY</h1>
        <img class="open-side l" ${pic('trench_a', '(max-width: 760px) 40vw, 16vw')} alt="" id="sideL">
        <div class="open-frame" id="openFrame"><img ${pic('fur_beige', '100vw')} alt="" fetchpriority="high"></div>
        <img class="open-side r" ${pic('coat_near', '(max-width: 760px) 40vw, 16vw')} alt="" id="sideR">
        <div class="open-foot" id="openFoot"><span>Собственное производство<br>женской одежды, Пермь</span><a class="pill" href="#/catalog">Смотреть каталог</a></div>
        <div class="open-title" id="openTitle"><small>Зима</small><p>Мягкая, как&nbsp;объятие</p><a class="pill pill-light" href="#/catalog?cat=furs">Шубы из экомеха</a></div>
      </div>
    </section>

    <section class="hz" id="hz">
      <div class="hz-sticky">
        <div class="hz-track" id="hzTrack">
          <div class="hz-intro"><h2>Четыре настроения года</h2><p>Коллекции, которые мы шьём сами.</p></div>
          ${SEASONS.map((s) => `<a class="hz-card" href="#/catalog?season=${s[0]}"><span class="arch"><img ${pic(s[1], '(max-width: 760px) 62vw, 26vw')} alt="" loading="lazy"></span><strong>${s[2]}</strong><small>${s[3]}</small></a>`).join('')}
        </div>
      </div>
    </section>

    <section class="loved">
      <header data-reveal><h2>Любимое</h2><a class="link" href="#/catalog">Весь каталог ${ic.arrow}</a></header>
      <div class="loved-grid">${M.sorted(D.products).slice(0, 7).map((p, i) => M.card(p, { big: i === 0 || i === 4, cls: i === 0 || i === 4 ? 'card-big' : '' })).join('')}</div>
    </section>

    <section class="pass-sec">
      <div class="pass-sec-l" data-reveal>
        <small>Паспорт мерок</small>
        <h2>Измерьте себя один раз. Дальше каждая вещь сама скажет, какой размер ваш</h2>
        <p>Пять минут с сантиметровой лентой. Мы покажем, где её держать, сохраним мерки и подскажем размер на любой модели. А захотите, сошьём точно по ним.</p>
        <a class="pill pill-light" href="#/atelier">Получить паспорт</a>
      </div>
      <div class="pass-sec-r" data-reveal>
        <div class="demo-card">
          <header><span>Паспорт мерок</span><b>MASY</b></header>
          <dl><div><dt>Рост</dt><dd>168</dd></div><div><dt>Грудь</dt><dd>90</dd></div><div><dt>Талия</dt><dd>72</dd></div><div><dt>Бёдра</dt><dd>98</dd></div></dl>
          <footer><span>Ваш размер</span><strong>M</strong></footer>
        </div>
        <canvas class="demo-tape" id="demoTape" aria-hidden="true"></canvas>
      </div>
    </section>

    <section class="doors">
      <a class="door" href="#/catalog" data-reveal><span class="arch"><img ${pic('jersey', '(max-width: 760px) 50vw, 36vw')} alt="" loading="lazy"></span><h3>Заказ из наличия</h3><p>Готовая модель вашего размера. Если нужно, подгоним по меркам.</p></a>
      <a class="door" href="#/atelier" data-reveal><span class="arch"><img ${pic('coat_walk', '(max-width: 760px) 50vw, 36vw')} alt="" loading="lazy"></span><h3>Индивидуальный заказ</h3><p>Сошьём с нуля по вашему паспорту мерок.</p></a>
    </section>`,
    mount(root) {
      const frame = $('#openFrame', root), mark = $('#openMark', root), foot = $('#openFoot', root), title = $('#openTitle', root), sideL = $('#sideL', root), sideR = $('#sideR', root), open = $('#open', root);
      const track = $('#hzTrack', root), hz = $('#hz', root);
      const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
      const small = () => innerWidth < 760;
      const onScroll = () => {
        const vh = innerHeight, y = window.scrollY;
        const span = open.offsetHeight - vh;
        const k = clamp(y / span);
        const e = 1 - Math.pow(1 - k, 2);
        // Кадр раскрывается на весь экран, имя бренда уезжает в шапку
        frame.style.setProperty('--w', `${(small() ? 62 : 26) + (100 - (small() ? 62 : 26)) * e}vw`);
        frame.style.setProperty('--h', `${(small() ? 62 : 72) + (100 - (small() ? 62 : 72)) * e}vh`);
        frame.style.setProperty('--r', `${(1 - e) * 50}%`);
        frame.style.setProperty('--y', `${(small() ? 8 : 9) * (1 - e)}vh`);
        const m = clamp(k / 0.35);
        mark.style.opacity = 1 - m;
        mark.style.transform = `translate(-50%, ${-m * 80}px)`;
        document.body.classList.toggle('hero-gone', k > 0.32);
        sideL.style.transform = `translate(${-e * 50}vw, ${e * 8}vh)`;
        sideR.style.transform = `translate(${e * 50}vw, ${e * 8}vh)`;
        sideL.style.opacity = sideR.style.opacity = 1 - clamp(k / 0.5);
        foot.style.opacity = 1 - clamp(k / 0.25);
        title.style.opacity = clamp((k - 0.62) / 0.3);
        title.style.pointerEvents = k > 0.7 ? 'auto' : 'none';
        // Горизонтальная лента коллекций
        if (!small()) {
          const r = hz.getBoundingClientRect();
          const total = hz.offsetHeight - vh;
          const h = clamp(-r.top / total);
          track.style.transform = `translate3d(${-h * Math.max(0, track.scrollWidth - innerWidth)}px, 0, 0)`;
        } else { track.style.transform = ''; }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      onScroll();
      const setH = () => {
        if (small()) { hz.style.height = ''; return; }
        hz.style.height = `${track.scrollWidth - innerWidth + innerHeight}px`;
        onScroll();
      };
      setTimeout(setH, 60);
      window.addEventListener('resize', setH);

      // Лента на витрине паспорта покачивается сама
      const tp = M.tape($('#demoTape', root), { value: 72, min: 40, max: 130 });
      let t = 0;
      const seq = [90, 72, 98, 168 > 130 ? 120 : 110];
      const iv = setInterval(() => { t = (t + 1) % seq.length; tp.to(seq[t]); }, 2200);
      return () => {
        clearInterval(iv); tp.destroy();
        window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); window.removeEventListener('resize', setH);
        document.body.classList.remove('hero-gone');
      };
    },
  });

  /* ========= Паспорт мерок ========= */
  M.views.atelier = (q) => {
    const model = q.model ? M.byId(q.model) : null;
    return {
      title: 'Паспорт мерок — MASY',
      html: `
      <section class="pp-start" id="ppStart">
        <div class="pp-intro">
          <small>На заказ</small>
          <h1>Паспорт мерок</h1>
          <p>Один раз измеряете себя с нашей подсказкой. Мерки сохраняются, и дальше сайт сам показывает ваш размер на каждой вещи и передаёт их мастеру, если вы заказываете пошив.</p>
        </div>
        ${model ? `<div class="pp-model"><img src="${M.img(model)}" alt=""><span><small>Вы выбрали</small>${esc(model.name)}</span></div>` : ''}
        <div class="pp-ways">
          <button class="pp-way" data-start="exact"><span class="pp-way-n">5 минут</span><b>Измерю себя точно</b><small>Лента и зеркало. Подскажем каждое движение. Подходит для индивидуального пошива.</small></button>
          <button class="pp-way" data-start="quick"><span class="pp-way-n">1 минута</span><b>Знаю свой размер</b><small>Укажите рост и обычный размер. Заполним мерки сами, а вы поправите, что отличается.</small></button>
          <a class="pp-way" href="#/catalog"><span class="pp-way-n">Без мерок</span><b>Заказ из наличия</b><small>Выбрать готовую модель и размер в каталоге.</small></a>
        </div>
        <form class="pp-quick" id="ppQuick" hidden>
          <label class="pp-q-h">Рост<span><input id="qHeight" type="number" inputmode="numeric" min="145" max="195" value="168" aria-label="Рост в сантиметрах"> см</span></label>
          <div class="pp-q-s" role="radiogroup" aria-label="Обычный размер">${M.sizeTable.map((r) => `<button type="button" class="pp-size ${r.s === 'S' ? 'on' : ''}" data-s="${r.s}">${r.s}<small>${r.ru}</small></button>`).join('')}</div>
          <button class="pill" type="submit">Заполнить паспорт</button>
        </form>
      </section>

      <section class="pp-step" id="ppStep" hidden>
        <div class="pp-fig" id="ppFig">${M.figure({ cls: 'pp-svg' })}</div>
        <div class="pp-panel">
          <div class="pp-prog" id="ppProg"></div>
          <div class="pp-text" id="ppText"></div>
          <div class="pp-value"><input id="ppVal" type="number" inputmode="decimal" step="0.5" aria-label="Значение в сантиметрах"><span>см</span></div>
          <div class="pp-nav"><button class="pp-back" id="ppBack">Назад</button><button class="pill" id="ppNext">Дальше</button></div>
        </div>
        <div class="pp-tape">
          <i class="pp-needle"></i>
          <canvas id="ppTape" tabindex="0" role="slider" aria-label="Сантиметровая лента"></canvas>
          <span class="pp-tape-hint" id="ppHint">← Потяните ленту →</span>
        </div>
      </section>

      <section class="pp-done" id="ppDone" hidden>
        <div class="pp-card" id="ppCard"></div>
        <div class="pp-after">
          <h2 id="ppDoneT"></h2>
          <p id="ppDoneP"></p>
          <div class="pp-tabs">
            <article class="pp-tab">
              <h3>Заказ из наличия</h3>
              <p>На каждой модели теперь отмечен ваш размер.</p>
              <a class="pill pill-line" href="#/catalog">Смотреть каталог</a>
            </article>
            <article class="pp-tab">
              <h3>Индивидуальный заказ</h3>
              <p>Отправьте паспорт мастеру и опишите вещь, которую хотите.</p>
              ${M.requestForm({ cta: 'Передать паспорт мастеру' })}
            </article>
          </div>
          <button class="link-sm" id="ppEdit">Изменить мерки</button>
        </div>
      </section>`,
      mount(root) {
        const start = $('#ppStart', root), stepEl = $('#ppStep', root), doneEl = $('#ppDone', root), quick = $('#ppQuick', root);
        const fig = $('#ppFig', root), svg = $('svg', fig);
        const list = M.measures;
        const vals = { ...M.getMeasures() };
        let i = 0, tape = null, size = 'S';
        const input = $('#ppVal', root);

        const save = () => { const n = parseFloat(input.value); if (n) { vals[list[i].k] = n; M.setMeasures(vals); } };
        const showStep = (n) => {
          i = n;
          const m = list[i];
          const v = vals[m.k] || m.def;
          input.min = m.min; input.max = m.max; input.value = v;
          $('#ppText', root).innerHTML = `<div class="pp-t-in"><small>${i + 1} из ${list.length}</small><h2>${m.name}</h2><p>${m.how}</p><p class="pp-tip">${m.tip}</p></div>`;
          $('#ppProg', root).innerHTML = list.map((x, k) => `<button class="${k === i ? 'on' : ''} ${vals[x.k] ? 'done' : ''}" data-k="${k}" aria-label="${x.name}"></button>`).join('');
          $('#ppBack', root).style.visibility = i ? 'visible' : 'hidden';
          $('#ppNext', root).textContent = i === list.length - 1 ? 'Готово' : 'Дальше';
          M.figureActive(fig, m.k, v);
          M.figureFocus(svg, m.focus);
          $('#ppTape', root).setAttribute('aria-valuemin', m.min);
          $('#ppTape', root).setAttribute('aria-valuemax', m.max);
          $('#ppTape', root).setAttribute('aria-valuenow', v);
          if (tape) tape.to(v, m.min, m.max);
        };
        const openSteps = (at = 0) => {
          start.hidden = true; doneEl.hidden = true; stepEl.hidden = false;
          document.body.classList.add('pp-mode');
          window.scrollTo(0, 0);
          if (!tape) {
            tape = M.tape($('#ppTape', root), {
              value: vals[list[at].k] || list[at].def, min: list[at].min, max: list[at].max,
              onChange(v) {
                input.value = v;
                M.figureValue(fig, list[i].k, v);
                $('#ppTape', root).setAttribute('aria-valuenow', v);
                $('#ppHint', root).classList.add('off');
              },
            });
          }
          showStep(at);
        };
        const finish = () => {
          save();
          const rec = M.sizeFor(vals);
          stepEl.hidden = true; doneEl.hidden = false;
          document.body.classList.remove('pp-mode');
          $('#ppCard', root).innerHTML = `
            <header><span>Паспорт мерок</span><b>MASY</b></header>
            <dl>${list.filter((m) => vals[m.k]).map((m) => `<div><dt>${m.name}</dt><dd>${vals[m.k]}</dd></div>`).join('')}</dl>
            <footer><span>Ваш размер</span><strong>${rec ? rec.size : '—'}</strong></footer>`;
          $('#ppDoneT', root).textContent = 'Паспорт готов';
          $('#ppDoneP', root).textContent = rec && rec.uneven ? `Ваши обхваты попадают в разные размеры, поэтому готовую вещь лучше брать размера ${rec.size} и подогнать по талии. Индивидуальный пошив сядет заметно точнее.` : `Готовые модели размера ${rec ? rec.size : ''} должны сесть хорошо. Паспорт сохранён в этом браузере.`;
          drawHeadPass();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        $$('[data-start]', root).forEach((b) => b.addEventListener('click', () => {
          if (b.dataset.start === 'exact') { openSteps(0); return; }
          quick.hidden = !quick.hidden;
          $$('.pp-way', root).forEach((x) => x.classList.toggle('on', x === b && !quick.hidden));
          if (!quick.hidden) quick.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }));
        $$('.pp-size', root).forEach((b) => b.addEventListener('click', () => {
          size = b.dataset.s;
          $$('.pp-size', root).forEach((x) => x.classList.toggle('on', x === b));
        }));
        quick.addEventListener('submit', (e) => {
          e.preventDefault();
          Object.assign(vals, M.estimate(+$('#qHeight', root).value, size));
          M.setMeasures(vals);
          finish();
          start.hidden = true;
        });
        $('#ppNext', root).addEventListener('click', () => { save(); if (i < list.length - 1) showStep(i + 1); else finish(); });
        $('#ppBack', root).addEventListener('click', () => { save(); if (i) showStep(i - 1); });
        $('#ppProg', root).addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) { save(); showStep(+b.dataset.k); } });
        input.addEventListener('input', () => { const n = parseFloat(input.value); if (n && tape) { tape.to(n); M.figureValue(fig, list[i].k, n); } });
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); $('#ppNext', root).click(); } });
        $('#ppEdit', root).addEventListener('click', () => openSteps(0));
        M.bindRequest(root, () => `${model ? `Модель: ${model.name}, ${model.color}\n` : ''}Паспорт мерок: ${M.measureLine(M.getMeasures())}`);
        if (Object.keys(vals).length >= 3 && !q.model) { /* паспорт уже есть: сразу показываем */ finish(); start.hidden = true; }
        return () => { if (tape) tape.destroy(); document.body.classList.remove('pp-mode'); };
      },
    };
  };

  /* ========= О бренде ========= */
  M.views.about = () => ({
    title: 'О бренде — MASY',
    html: `
    <section class="ab">
      <div class="ab-top" data-reveal>
        <small>О бренде</small>
        <h1>Секрет женского обаяния в&nbsp;том, чтобы быть собой</h1>
      </div>
      <div class="ab-grid">
        <span class="arch ab-a" data-reveal><img ${pic('trench_b', '(max-width: 760px) 50vw, 33vw')} alt=""></span>
        <div class="ab-tx" data-reveal>
          <p>Полюбить себя, заботиться о себе и жить в полной гармонии с собой. Когда это есть, остаётся лишь правильно транслировать себя миру.</p>
          <p>Именно этим мы и занимаемся: создаём одежду, среди которой каждая девушка и женщина сможет найти отклик своего внутреннего «Я».</p>
          <p>MASY — российский бренд с собственным производством в Перми. Возможен и индивидуальный пошив, и коррекция изделия из наличия по вашим меркам.</p>
          <p class="ab-sign">Ольга Сутягина и Анастасия Тюмисова,<br>руководители бренда</p>
        </div>
        <span class="arch ab-b" data-reveal><img ${pic('bomber', '(max-width: 760px) 50vw, 33vw')} alt="" loading="lazy"></span>
      </div>
    </section>`,
  });

  /* Отметка размера в шапке и на карточках: паспорт виден на всём сайте */
  const drawHeadPass = () => {
    const rec = M.recommend();
    const el = $('#headPass');
    if (!el) return;
    el.hidden = !(rec && rec.size);
    if (rec && rec.size) el.innerHTML = `<a href="#/atelier">Ваш размер: ${rec.size}</a>`;
  };

  M.start({
    header, footer, menu,
    afterShell: drawHeadPass,
    catalogCard(p, i) {
      const rec = M.recommend();
      const tag = rec && rec.size && (p.sizes.includes(rec.size) || p.sizes.includes('one size') || (p.sizes[0] === 'S/M' && /S|M/.test(rec.size))) ? 'fit' : '';
      const big = (i % 9 === 0 || i % 9 === 5);
      return M.card(p, { cls: `${big ? 'card-big' : ''} ${tag}`, big });
    },
  });
})();
