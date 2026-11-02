/* MASY: общее ядро всех трёх вариантов (роутер, корзина, каталог, карточка, оформление заказа) */
(function () {
  const D = window.MASY_DATA;
  const M = (window.M = { data: D, variant: document.documentElement.dataset.variant || 'v1', views: {} });
  const $ = (M.$ = (s, r = document) => r.querySelector(s));
  const $$ = (M.$$ = (s, r = document) => [...r.querySelectorAll(s)]);
  const esc = (M.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])));
  const fmt = (M.fmt = (n) => n.toLocaleString('ru-RU').replace(/\s/g, ' ') + ' ₽');
  M.byId = (id) => D.products.find((p) => p.id === +id);
  M.img = (p, i = 0, size = 't') => `../assets/img/${size}/${p.imgs[Math.min(i, p.imgs.length - 1)]}`;
  M.look = (name) => `../assets/img/l/${name}.webp`;
  /* Браузер сам выбирает файл под ширину и плотность экрана */
  M.pic = (name, sizes = '(max-width: 760px) 100vw, 50vw') => `src="../assets/img/l/${name}.webp" srcset="../assets/img/lm/${name}.webp 1100w, ../assets/img/l/${name}.webp 2400w" sizes="${sizes}"`;
  M.shot = (p, i, sizes) => `src="${M.img(p, i, 't')}" srcset="${M.img(p, i, 't')} 800w, ${M.img(p, i, 'p')} 1500w" sizes="${sizes}"`;
  M.catName = (k) => (D.cats.find((c) => c[0] === k) || [k, k])[1];
  M.seasonName = (k) => (D.seasons.find((c) => c[0] === k) || [k, k])[1];
  M.minPrice = (p) => (p.parts.length ? Math.min(...p.parts.map((x) => x.p)) : p.price);
  M.priceLabel = (p) => (p.parts.length ? 'от ' + fmt(M.minPrice(p)) : fmt(p.price));

  const TONES = {
    light: ['Молочный', 'Белый', 'Бежевый', 'Песочный', 'Лимонный', 'Серебро', 'Молочный горох'],
    coffee: ['Латте', 'Кофейный', 'Шоколад', 'Горький шоколад', 'Дымка', 'Рысь'],
    dark: ['Чёрный', 'Графит', 'Гусиная лапка', 'Чёрный / молочный'],
    color: ['Бургунди', 'Голубой', 'Олива', 'Красный'],
  };
  M.toneNames = { light: 'Светлые', coffee: 'Кофейные', dark: 'Чёрные и графит', color: 'Цветные' };
  M.toneOf = (p) => Object.keys(TONES).find((t) => TONES[t].includes(p.color)) || 'color';

  /* Иконки: единая тонкая линия */
  const ic = (d, extra = '') => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
  M.ic = {
    search: ic('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 20.5 20.5"/>'),
    heart: ic('<path d="M12 20.2s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.5c0 5.5-7.5 10.1-7.5 10.1Z"/>'),
    bag: ic('<path d="M5.5 8h13l1 12.5h-15L5.500 8Z"/><path d="M9 10.500V6.800a3 3 0 0 1 6 0v3.700"/>'),
    menu: ic('<path d="M3.500 8.500h17M3.500 15.500h17"/>'),
    close: ic('<path d="M5.500 5.500l13 13M18.500 5.500l-13 13"/>'),
    arrow: ic('<path d="M3.500 12h17M15 6.500l5.500 5.500-5.500 5.500"/>'),
    back: ic('<path d="M20.500 12h-17M9 6.500 3.500 12 9 17.500"/>'),
    plus: ic('<path d="M12 5v14M5 12h14"/>'),
    minus: ic('<path d="M5 12h14"/>'),
    check: ic('<path d="m5 12.500 4.500 4.500L19 7.500"/>'),
    chevron: ic('<path d="m6.500 9.500 5.500 5.500 5.500-5.500"/>'),
    pin: ic('<path d="M12 21s7-6.100 7-11.500A7 7 0 0 0 5 9.500C5 14.900 12 21 12 21Z"/><circle cx="12" cy="9.500" r="2.500"/>'),
    grid: ic('<path d="M4 4h6.500v6.500H4zM13.500 4H20v6.500h-6.500zM4 13.500h6.500V20H4zM13.500 13.500H20V20h-6.500z"/>'),
  };

  /* Хранилище: приватный режим браузера не должен ломать сайт */
  const key = (k) => `masy.${M.variant}.${k}`;
  const ls = {
    get(k, def) { try { const v = localStorage.getItem(key(k)); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set(k, v) { try { localStorage.setItem(key(k), JSON.stringify(v)); } catch (e) {} },
  };
  M.ls = ls;
  let cart = ls.get('cart', []);
  let wish = ls.get('wish', []);
  const emit = () => {
    ls.set('cart', cart); ls.set('wish', wish);
    $$('[data-cart-count]').forEach((e) => { const n = cart.reduce((s, i) => s + i.qty, 0); e.textContent = n; e.classList.toggle('on', n > 0); });
    $$('[data-wish-count]').forEach((e) => { e.textContent = wish.length; e.classList.toggle('on', wish.length > 0); });
    $$('[data-wish]').forEach((b) => b.classList.toggle('on', wish.includes(+b.dataset.wish)));
  };
  M.sync = emit;
  M.cart = {
    items: () => cart,
    total: () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    add(item) {
      const same = cart.find((i) => i.id === item.id && i.size === item.size && i.part === item.part && i.custom === item.custom);
      if (same) same.qty += 1; else cart.push({ qty: 1, ...item });
      emit(); M.renderCart();
    },
    qty(i, d) { cart[i].qty += d; if (cart[i].qty < 1) cart.splice(i, 1); emit(); M.renderCart(); },
    clear() { cart = []; emit(); M.renderCart(); },
  };
  M.wish = {
    items: () => wish,
    toggle(id) { wish = wish.includes(id) ? wish.filter((x) => x !== id) : [...wish, id]; emit(); },
  };

  /* Мерки живут отдельно: их используют карточка товара, корзина и заявка */
  M.getMeasures = () => ls.get('measures', {});
  M.setMeasures = (m) => { ls.set('measures', m); };

  /* Кнопки «Написать»: заявка уходит сообщением, сервер для демо не нужен */
  M.sendLinks = (text) => {
    const t = encodeURIComponent(text);
    return `<a class="btn btn-solid" target="_blank" rel="noopener" href="https://t.me/${D.brand.telegramManager}?text=${t}">Отправить в Telegram</a>
      <a class="btn btn-line" target="_blank" rel="noopener" href="https://wa.me/${D.brand.whatsapp}?text=${t}">Отправить в WhatsApp</a>`;
  };

  /* Карточка товара */
  M.dots = (p) => {
    const twins = D.products.filter((x) => x.name === p.name);
    if (twins.length < 2) return '';
    return `<span class="card-dots">${twins.slice(0, 5).map((x) => `<i style="background:${x.hex}" title="${esc(x.color)}"></i>`).join('')}</span>`;
  };
  M.card = (p, o = {}) => `
    <article class="card ${o.cls || ''}" data-reveal>
      <div class="card-media">
        <a href="#/product/${p.id}" aria-label="${esc(p.name)}">
          <img class="a" ${M.shot(p, 0, o.big ? '(max-width: 760px) 100vw, 50vw' : '(max-width: 760px) 50vw, 26vw')} alt="${esc(p.name)}, ${esc(p.color)}" loading="lazy">
          ${p.imgs[1] ? `<img class="b" ${M.shot(p, 1, o.big ? '(max-width: 760px) 100vw, 50vw' : '(max-width: 760px) 50vw, 26vw')} alt="" loading="lazy">` : ''}
        </a>
        <button class="card-wish" data-wish="${p.id}" aria-label="В избранное">${M.ic.heart}</button>
      </div>
      <a class="card-info" href="#/product/${p.id}">
        <span class="card-name">${esc(p.name)}</span>
        <span class="card-meta"><span class="card-price">${M.priceLabel(p)}${p.old && !p.parts.length ? ` <s>${fmt(p.old)}</s>` : ''}</span>${M.dots(p)}</span>
      </a>
    </article>`;

  /* Подбор размера по меркам */
  M.recommend = () => (M.sizeFor ? M.sizeFor(M.getMeasures()) : null);

  /* ========= Каталог ========= */
  M.featuredIds = [7928492, 8420947, 7591412, 7766254, 14221809, 7919769, 7920248, 14221576, 8526582, 8733234, 7590248, 14221766, 8384262, 7919909, 14221644, 8731374];
  const rank = (p) => { const i = M.featuredIds.indexOf(p.id); return i < 0 ? 100 + D.products.indexOf(p) : i; };
  M.sorted = (list) => [...list].sort((a, b) => rank(a) - rank(b));

  const dropdown = (name, label, opts, val) => `
    <div class="dd" data-dd="${name}">
      <button class="dd-btn" type="button"><span>${esc(val ? (opts.find((o) => o[0] === val) || [0, label])[1] : label)}</span>${M.ic.chevron}</button>
      <div class="dd-list">${[['', label === 'Сортировка' ? 'Сначала рекомендуем' : 'Все'], ...opts].map((o) => `<button type="button" data-val="${o[0]}" class="${o[0] === (val || '') ? 'on' : ''}">${esc(o[1])}</button>`).join('')}</div>
    </div>`;

  M.views.catalog = (q) => {
    const st = { cat: q.cat || '', season: q.season || '', tone: q.tone || '', sort: q.sort || '', size: q.size || '' };
    const title = st.cat ? M.catName(st.cat) : st.season ? M.seasonName(st.season) : 'Вся одежда';
    return {
      title: `${title} — MASY`,
      html: `
      <section class="catalog">
        <header class="cat-head">
          <nav class="crumbs"><a href="#/">Главная</a><span>/</span><span>Каталог</span></nav>
          <div class="cat-title-row"><h1 class="cat-title">${esc(title)}</h1><span class="cat-count" id="catCount"></span></div>
        </header>
        <div class="filters">
          <div class="f-cats">
            <a class="chip ${!st.cat ? 'on' : ''}" href="#/catalog">Всё</a>
            ${D.cats.map((c) => `<a class="chip ${st.cat === c[0] ? 'on' : ''}" href="#/catalog?cat=${c[0]}">${esc(c[1])}</a>`).join('')}
          </div>
          <div class="f-more">
            ${dropdown('season', 'Сезон', D.seasons, st.season)}
            ${dropdown('tone', 'Оттенок', Object.entries(M.toneNames), st.tone)}
            ${dropdown('sort', 'Сортировка', [['asc', 'Сначала доступнее'], ['desc', 'Сначала дороже']], st.sort)}
            ${M.opts.catalogTools ? M.opts.catalogTools() : ''}
          </div>
        </div>
        <div class="grid" id="catGrid"></div>
        <div class="cat-note" data-reveal>
          <p>Не нашли подходящий размер или длину?</p>
          <a class="link" href="#/atelier">Сошьём по вашим меркам ${M.ic.arrow}</a>
        </div>
      </section>`,
      mount(root) {
        const draw = () => {
          let list = D.products.filter((p) => (!st.cat || p.cat === st.cat) && (!st.season || p.season === st.season) && (!st.tone || M.toneOf(p) === st.tone));
          list = st.sort === 'asc' ? [...list].sort((a, b) => M.minPrice(a) - M.minPrice(b)) : st.sort === 'desc' ? [...list].sort((a, b) => M.minPrice(b) - M.minPrice(a)) : M.sorted(list);
          $('#catCount', root).textContent = M.plural(list.length, 'модель', 'модели', 'моделей');
          $('#catGrid', root).innerHTML = list.length ? list.map((p, i) => (M.opts.catalogCard ? M.opts.catalogCard(p, i) : M.card(p))).join('') : `<p class="empty">По этим фильтрам ничего не нашлось. <a class="link" href="#/catalog">Сбросить</a></p>`;
          M.sync(); M.enhance($('#catGrid', root));
        };
        draw();
        $$('[data-dd]', root).forEach((dd) => {
          dd.querySelector('.dd-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            $$('.dd.open').forEach((x) => x !== dd && x.classList.remove('open'));
            dd.classList.toggle('open');
          });
          $$('.dd-list button', dd).forEach((b) => b.addEventListener('click', () => {
            st[dd.dataset.dd] = b.dataset.val;
            dd.classList.remove('open');
            $$('.dd-list button', dd).forEach((x) => x.classList.toggle('on', x === b));
            dd.querySelector('.dd-btn span').textContent = b.dataset.val ? b.textContent : ({ season: 'Сезон', tone: 'Оттенок', sort: 'Сортировка' }[dd.dataset.dd]);
            dd.classList.toggle('has', !!b.dataset.val);
            draw();
          }));
        });
        if (M.opts.catalogMount) M.opts.catalogMount(root);
      },
    };
  };

  M.plural = (n, a, b, c) => {
    const d = n % 100, e = n % 10;
    return `${n} ${d > 10 && d < 20 ? c : e === 1 ? a : e > 1 && e < 5 ? b : c}`;
  };

  /* ========= Карточка товара ========= */
  M.views.product = (q, id) => {
    const p = M.byId(id);
    if (!p) return M.views.notfound();
    const same = D.products.filter((x) => x.name === p.name && x.id !== p.id);
    const rel = M.sorted(D.products.filter((x) => x.id !== p.id && x.cat === p.cat && x.name !== p.name)).slice(0, 4);
    const rec = M.recommend();
    const hasM = rec && rec.size;
    return {
      title: `${p.name} — MASY`,
      html: `
      <section class="pdp">
        <div class="pdp-gallery" id="pdpGallery">
          ${p.imgs.map((im, i) => `<button class="pdp-shot" data-shot="${i}" aria-label="Увеличить фото ${i + 1}"><img ${M.shot(p, i, '(max-width: 760px) 86vw, 55vw')} alt="${esc(p.name)}, фото ${i + 1}" ${i > 1 ? 'loading="lazy"' : ''}></button>`).join('')}
        </div>
        <div class="pdp-side">
          <div class="pdp-info"><div class="pdp-a">
            <nav class="crumbs"><a href="#/catalog">Каталог</a><span>/</span><a href="#/catalog?cat=${p.cat}">${esc(M.catName(p.cat))}</a></nav>
            <h1 class="pdp-title">${esc(p.name)}</h1>
            <div class="pdp-price" id="pdpPrice">${p.parts.length ? fmt(p.parts[0].p) : fmt(p.price)}${!p.parts.length && p.old ? ` <s>${fmt(p.old)}</s>` : ''}</div>

            <div class="pdp-color">
              <span class="pdp-label">Цвет: <b>${esc(p.color)}</b></span>
              <div class="swatches">
                <a class="swatch on" style="--c:${p.hex}" href="#/product/${p.id}" title="${esc(p.color)}"></a>
                ${same.map((x) => `<a class="swatch" style="--c:${x.hex}" href="#/product/${x.id}" title="${esc(x.color)}"></a>`).join('')}
              </div>
            </div>

            ${p.parts.length ? `<div class="pdp-parts"><span class="pdp-label">Изделие</span>
              ${p.parts.map((x, i) => `<label class="part"><input type="radio" name="part" value="${i}" ${i === 0 ? 'checked' : ''}><span>${esc(x.n)}</span><em>${fmt(x.p)}</em></label>`).join('')}
            </div>` : ''}

            </div><div class="pdp-b">
            <div class="mode" role="tablist" aria-label="Как заказать">
              <button class="mode-tab on" data-mode="stock" role="tab">Из наличия</button>
              <button class="mode-tab" data-mode="custom" role="tab">По вашим меркам</button>
              <i class="mode-ink"></i>
            </div>

            <div class="mode-pane" data-pane="stock">
              <div class="pdp-sizes">
                <div class="pdp-label-row"><span class="pdp-label">Размер</span><button class="link-sm" data-open="sizes">Таблица размеров</button></div>
                <div class="sizes">${p.sizes.map((s, i) => `<button class="size ${p.sizes.length === 1 ? 'on' : ''}" data-size="${esc(s)}">${esc(s)}${hasM && rec.size === s ? '<sup>ваш</sup>' : ''}</button>`).join('')}</div>
                ${hasM ? `<p class="pdp-hint">По вашим меркам ближе всего размер ${rec.size}</p>` : ''}
              </div>
              <div class="pdp-actions">
                <button class="btn btn-solid btn-wide" id="addStock">В корзину</button>
                <button class="btn-icon" data-wish="${p.id}" aria-label="В избранное">${M.ic.heart}</button>
              </div>
              <p class="pdp-note">Можно подогнать вещь из наличия по вашим меркам: напишите об этом в комментарии к заказу.</p>
            </div>

            <div class="mode-pane" data-pane="custom" hidden>
              <p class="pdp-custom-text">Сошьём эту модель под вашу фигуру. Можно изменить длину, ткань и детали: всё обсудим до начала работы.</p>
              ${hasM ? `<div class="pdp-mine"><span>Мерки уже сохранены</span><a class="link-sm" href="#/atelier">Изменить</a></div>
                <div class="pdp-actions"><button class="btn btn-solid btn-wide" id="addCustom">В корзину с моими мерками</button><button class="btn-icon" data-wish="${p.id}" aria-label="В избранное">${M.ic.heart}</button></div>`
              : `<div class="pdp-actions"><a class="btn btn-solid btn-wide" href="#/atelier?model=${p.id}">Снять мерки за 5 минут</a><button class="btn-icon" data-wish="${p.id}" aria-label="В избранное">${M.ic.heart}</button></div>`}
            </div>

            <div class="acc">
              ${M.acc('О модели', `<p>${esc(p.desc)}</p>`, true)}
              ${M.acc('Детали', `<ul class="facts">${p.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>`)}
              ${M.acc('Доставка и оплата', `<p>Отправляем СДЭК, Почтой России, через Яндекс Маркет и Ozon, доставляем по всему миру. Примерить и забрать можно в шоуруме в Перми.</p><p>Оплата только по QR-коду на расчётный счёт ${D.brand.legal}. Переводы на карту мы не принимаем.</p>`)}
            </div>
          </div></div>
        </div>
      </section>
      ${rel.length ? `<section class="related"><h2 class="section-title" data-reveal>С этим смотрят</h2><div class="grid grid-rel">${rel.map((x) => M.card(x)).join('')}</div></section>` : ''}`,
      mount(root) {
        let size = p.sizes.length === 1 ? p.sizes[0] : null;
        const part = () => { const c = $('input[name=part]:checked', root); return c ? p.parts[+c.value] : null; };
        $$('input[name=part]', root).forEach((r) => r.addEventListener('change', () => { $('#pdpPrice', root).textContent = fmt(part().p); }));
        $$('.size', root).forEach((b) => b.addEventListener('click', () => {
          size = b.dataset.size;
          $$('.size', root).forEach((x) => x.classList.toggle('on', x === b));
          $('.pdp-sizes', root).classList.remove('need');
        }));
        const add = (custom) => {
          const pt = part();
          M.cart.add({ id: p.id, name: pt ? pt.n : p.name, price: pt ? pt.p : p.price, part: pt ? pt.n : '', size: custom ? 'По меркам' : size, custom: !!custom, color: p.color });
          M.toast('Добавлено в корзину', 'cart');
        };
        const stock = $('#addStock', root);
        stock && stock.addEventListener('click', () => {
          if (!size) { $('.pdp-sizes', root).classList.add('need'); M.toast('Выберите размер'); return; }
          add(false);
        });
        const cus = $('#addCustom', root);
        cus && cus.addEventListener('click', () => add(true));
        const ink = $('.mode-ink', root);
        const place = (t) => { ink.style.width = t.offsetWidth + 'px'; ink.style.transform = `translateX(${t.offsetLeft}px)`; };
        const on = $('.mode-tab.on', root);
        requestAnimationFrame(() => place(on));
        $$('.mode-tab', root).forEach((t) => t.addEventListener('click', () => {
          $$('.mode-tab', root).forEach((x) => x.classList.toggle('on', x === t));
          place(t);
          $$('.mode-pane', root).forEach((x) => { x.hidden = x.dataset.pane !== t.dataset.mode; if (!x.hidden) { x.classList.remove('show'); void x.offsetWidth; x.classList.add('show'); } });
        }));
        $$('.pdp-shot', root).forEach((s) => s.addEventListener('click', () => M.lightbox(p, +s.dataset.shot)));
        if (M.opts.productMount) M.opts.productMount(root, p);
      },
    };
  };

  M.acc = (title, body, open) => `<details class="acc-item" ${open ? 'open' : ''}><summary>${esc(title)}<span class="acc-sign"></span></summary><div class="acc-body">${body}</div></details>`;

  M.lightbox = (p, start) => {
    let i = start;
    const el = document.createElement('div');
    el.className = 'lightbox';
    const draw = () => { el.querySelector('img').src = M.img(p, i, 'p'); el.querySelector('.lb-count').textContent = `${i + 1} / ${p.imgs.length}`; };
    el.innerHTML = `<button class="lb-close" aria-label="Закрыть">${M.ic.close}</button><button class="lb-prev" aria-label="Назад">${M.ic.back}</button><img alt="${esc(p.name)}"><button class="lb-next" aria-label="Вперёд">${M.ic.arrow}</button><span class="lb-count"></span>`;
    document.body.append(el);
    draw();
    requestAnimationFrame(() => el.classList.add('open'));
    const close = () => { el.classList.remove('open'); setTimeout(() => el.remove(), 300); document.removeEventListener('keydown', key); };
    const go = (d) => { i = (i + d + p.imgs.length) % p.imgs.length; draw(); };
    const key = (e) => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    document.addEventListener('keydown', key);
    el.querySelector('.lb-close').onclick = close;
    el.querySelector('.lb-prev').onclick = () => go(-1);
    el.querySelector('.lb-next').onclick = () => go(1);
    el.addEventListener('click', (e) => { if (e.target === el) close(); });
  };

  /* ========= Избранное, 404 ========= */
  M.views.favorites = () => {
    const list = wish.map(M.byId).filter(Boolean);
    return {
      title: 'Избранное — MASY',
      html: `<section class="page page-narrow-head"><h1 class="page-title">Избранное</h1>
        ${list.length ? `<div class="grid">${list.map((p) => M.card(p)).join('')}</div>` : `<div class="empty-state"><p>Здесь пока пусто. Сохраняйте модели, к которым хочется вернуться.</p><a class="btn btn-line" href="#/catalog">Открыть каталог</a></div>`}
      </section>`,
    };
  };
  M.views.notfound = () => ({ title: 'Страница не найдена — MASY', html: `<section class="page empty-state"><h1 class="page-title">Такой страницы нет</h1><a class="btn btn-line" href="#/catalog">В каталог</a></section>` });

  /* ========= Оформление заказа ========= */
  M.views.checkout = () => {
    const items = cart;
    if (!items.length) return { title: 'Оформление — MASY', html: `<section class="page empty-state"><h1 class="page-title">Корзина пуста</h1><a class="btn btn-line" href="#/catalog">В каталог</a></section>` };
    const hasCustom = items.some((i) => i.custom);
    const measures = M.getMeasures();
    return {
      title: 'Оформление заказа — MASY',
      html: `
      <section class="checkout">
        <h1 class="page-title">Оформление заказа</h1>
        <div class="co-grid">
          <form class="co-form" id="coForm" novalidate>
            <fieldset><legend>Контакты</legend>
              <label class="field"><span>Имя</span><input name="name" required autocomplete="name"></label>
              <label class="field"><span>Телефон</span><input name="phone" required inputmode="tel" autocomplete="tel" placeholder="+7"></label>
            </fieldset>
            <fieldset><legend>Получение</legend>
              <div class="opts">
                ${[['Шоурум в Перми', 'БЦ «Бонус», ул. Революции, 20, офис 604'], ['СДЭК', 'До пункта выдачи или курьером'], ['Яндекс Маркет', 'До пункта выдачи'], ['Ozon', 'До пункта выдачи'], ['Почта России', 'В том числе за границу']]
                  .map((o, i) => `<label class="opt"><input type="radio" name="delivery" value="${o[0]}" ${i === 1 ? 'checked' : ''}><span><b>${o[0]}</b><small>${o[1]}</small></span></label>`).join('')}
              </div>
              <label class="field" id="addrField"><span>Город и адрес</span><input name="address" autocomplete="street-address"></label>
            </fieldset>
            <fieldset><legend>Комментарий</legend>
              <label class="field"><span>Пожелания к заказу, подгонка, вопросы</span><textarea name="note" rows="3"></textarea></label>
            </fieldset>
            <div class="co-pay">
              <b>Оплата по QR-коду</b>
              <p>Мы подтвердим заказ и пришлём QR-код на расчётный счёт ${D.brand.legal}. У нас нет менеджеров, которые просят перевод на карту.</p>
            </div>
            <label class="consent"><input type="checkbox" name="consent" required><span>Согласна на обработку персональных данных</span></label>
            <button class="btn btn-solid btn-wide" type="submit">Подтвердить заказ</button>
            <p class="form-err" id="coErr" hidden></p>
          </form>
          <aside class="co-sum">
            <h2>Ваш заказ</h2>
            ${items.map((i) => { const p = M.byId(i.id); return `<div class="co-item"><img src="${M.img(p)}" alt=""><div><b>${esc(i.name)}</b><small>${esc(i.color)} · ${esc(i.size || '')}${i.qty > 1 ? ' · ' + i.qty + ' шт.' : ''}</small></div><span>${fmt(i.price * i.qty)}</span></div>`; }).join('')}
            ${hasCustom ? `<p class="co-custom">Индивидуальный пошив: стоимость и срок подтвердим после согласования деталей.</p>` : ''}
            <div class="co-total"><span>Итого</span><b>${fmt(M.cart.total())}</b></div>
          </aside>
        </div>
      </section>`,
      mount(root) {
        const f = $('#coForm', root);
        const toggleAddr = () => { $('#addrField', root).hidden = f.delivery.value === 'Шоурум в Перми'; };
        $$('input[name=delivery]', f).forEach((r) => r.addEventListener('change', toggleAddr));
        f.addEventListener('submit', (e) => {
          e.preventDefault();
          const err = $('#coErr', root);
          if (!f.name.value.trim() || f.phone.value.replace(/\D/g, '').length < 10) { err.hidden = false; err.textContent = 'Укажите имя и телефон, чтобы мы могли подтвердить заказ.'; return; }
          if (!f.consent.checked) { err.hidden = false; err.textContent = 'Нужно согласие на обработку данных.'; return; }
          const no = 'M' + String(Date.now()).slice(-6);
          const lines = items.map((i) => `• ${i.name}, ${i.color}, ${i.size || ''}: ${i.qty} шт.`).join('\n');
          const mtxt = hasCustom && Object.keys(measures).length ? '\nМерки: ' + M.measureLine(measures) : '';
          const msg = `Здравствуйте! Заказ ${no}\n${lines}\nИтого: ${M.cart.total().toLocaleString('ru-RU')} ₽\nПолучение: ${f.delivery.value}${f.address.value ? ', ' + f.address.value : ''}\nИмя: ${f.name.value}, телефон: ${f.phone.value}${f.note.value ? '\nКомментарий: ' + f.note.value : ''}${mtxt}`;
          $('.co-grid', root).innerHTML = `<div class="done"><h2>Заказ ${no} собран</h2><p>Отправьте его нам одним нажатием: сообщение уже готово. Мы подтвердим наличие и пришлём QR-код для оплаты.</p><div class="done-actions">${M.sendLinks(msg)}</div></div>`;
          M.cart.clear();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      },
    };
  };

  /* ========= Общие текстовые страницы ========= */
  M.views.delivery = () => ({
    title: 'Доставка и оплата — MASY',
    html: `<section class="page info">
      <h1 class="page-title">Доставка и оплата</h1>
      <div class="info-grid">
        <div data-reveal><h2>Доставка</h2><p>Отправляем транспортной компанией СДЭК, через Яндекс Маркет, Ozon и Почтой России. Доставляем по всему миру.</p></div>
        <div data-reveal><h2>Шоурум</h2><p>Примерить и забрать заказ можно в Перми: ${D.brand.address}, ${D.brand.addressMore}.</p><p>${D.brand.hours.map((h) => h.join(' ')).join('<br>')}</p></div>
        <div data-reveal><h2>Оплата</h2><p>Оплата производится только по QR-коду на расчётный счёт ${D.brand.legal}. У нас нет менеджеров, которые просят оплатить переводом на карту: если вам такое написали, это не мы.</p></div>
        <div data-reveal><h2>Индивидуальный пошив</h2><p>Стоимость и срок подтверждаем после согласования модели, ткани и мерок. Работу начинаем только после вашего одобрения.</p></div>
      </div>
    </section>`,
  });
  M.contactsHtml = () => `
    <div class="contact-list">
      ${D.brand.phones.map((p) => `<a href="tel:${p.h}"><small>${p.n}</small>${p.p}</a>`).join('')}
      <a href="${D.brand.telegram}" target="_blank" rel="noopener"><small>Канал с новинками</small>Telegram</a>
      <a href="${D.brand.vk}" target="_blank" rel="noopener"><small>Сообщество</small>ВКонтакте</a>
      <a href="https://wa.me/${D.brand.whatsapp}" target="_blank" rel="noopener"><small>Написать</small>WhatsApp</a>
    </div>`;
  M.views.contacts = () => ({
    title: 'Контакты — MASY',
    html: `<section class="contacts">
      <div class="contacts-media" data-reveal><img ${M.pic('jacket_side')} alt="Образ MASY"></div>
      <div class="contacts-body">
        <h1 class="page-title">Шоурум в&nbsp;Перми</h1>
        <p class="contacts-addr">${D.brand.address}<br>${D.brand.addressMore}</p>
        <p class="contacts-hours">${D.brand.hours.map((h) => `<span>${h[0]}</span><span>${h[1]}</span>`).join('')}</p>
        <a class="link" href="${D.brand.map}" target="_blank" rel="noopener">Построить маршрут ${M.ic.arrow}</a>
        ${M.contactsHtml()}
      </div>
    </section>`,
  });

  /* ========= Корзина, поиск, меню ========= */
  const drawer = document.createElement('div');
  drawer.className = 'drawer';
  drawer.innerHTML = `<div class="drawer-veil" data-close></div><aside class="drawer-panel" role="dialog" aria-label="Корзина"><header><h2>Корзина</h2><button data-close aria-label="Закрыть">${M.ic.close}</button></header><div class="drawer-body" id="cartBody"></div><footer id="cartFoot"></footer></aside>`;

  M.renderCart = () => {
    const body = $('#cartBody', drawer), foot = $('#cartFoot', drawer);
    if (!cart.length) {
      body.innerHTML = `<div class="empty-state"><p>В корзине пока ничего нет</p><a class="btn btn-line" href="#/catalog" data-close>В каталог</a></div>`;
      foot.innerHTML = '';
      return;
    }
    body.innerHTML = cart.map((i, n) => {
      const p = M.byId(i.id);
      return `<div class="ci"><a href="#/product/${p.id}" data-close><img src="${M.img(p)}" alt=""></a><div class="ci-b"><b>${esc(i.name)}</b><small>${esc(i.color)} · ${esc(i.size || '')}</small>
        <div class="ci-row"><div class="qty"><button data-qty="${n}" data-d="-1" aria-label="Меньше">${M.ic.minus}</button><span>${i.qty}</span><button data-qty="${n}" data-d="1" aria-label="Больше">${M.ic.plus}</button></div><span>${fmt(i.price * i.qty)}</span></div></div></div>`;
    }).join('');
    foot.innerHTML = `<div class="co-total"><span>Итого</span><b>${fmt(M.cart.total())}</b></div><a class="btn btn-solid btn-wide" href="#/checkout" data-close>Оформить заказ</a>`;
  };
  M.openCart = () => { M.renderCart(); drawer.classList.add('open'); document.documentElement.classList.add('lock'); };
  const closeOverlays = () => {
    drawer.classList.remove('open');
    search.classList.remove('open');
    menu.classList.remove('open');
    document.documentElement.classList.remove('lock');
    $$('.modal').forEach((m) => { m.classList.remove('open'); setTimeout(() => m.remove(), 300); });
  };
  M.closeOverlays = closeOverlays;

  const search = document.createElement('div');
  search.className = 'search';
  search.innerHTML = `<div class="search-box"><div class="search-row">${M.ic.search}<input id="q" placeholder="Что вы ищете?" autocomplete="off" aria-label="Поиск"><button data-close aria-label="Закрыть">${M.ic.close}</button></div>
    <div class="search-hints">${['Пальто', 'Тренч', 'Шуба', 'Бомбер', 'Шёлк', 'Шерсть'].map((h) => `<button data-hint="${h}">${h}</button>`).join('')}</div><div class="search-res" id="qRes"></div></div><div class="drawer-veil" data-close></div>`;

  const runSearch = (v) => {
    const q = v.trim().toLowerCase().replace(/ё/g, 'е');
    const res = $('#qRes', search);
    if (q.length < 2) { res.innerHTML = ''; return; }
    const list = D.products.filter((p) => (p.name + ' ' + p.color + ' ' + p.desc + ' ' + M.catName(p.cat)).toLowerCase().replace(/ё/g, 'е').includes(q)).slice(0, 6);
    res.innerHTML = list.length ? list.map((p) => `<a href="#/product/${p.id}" data-close class="sr"><img src="${M.img(p)}" alt=""><span>${esc(p.name)}<small>${esc(p.color)} · ${M.priceLabel(p)}</small></span></a>`).join('') : `<p class="muted">Ничего не нашлось. Попробуйте другое слово.</p>`;
  };

  const menu = document.createElement('div');
  menu.className = 'menu';

  M.modal = (title, html) => {
    const m = document.createElement('div');
    m.className = 'modal';
    m.innerHTML = `<div class="drawer-veil" data-close></div><div class="modal-box" role="dialog" aria-label="${esc(title)}"><header><h2>${esc(title)}</h2><button data-close aria-label="Закрыть">${M.ic.close}</button></header><div class="modal-body">${html}</div></div>`;
    document.body.append(m);
    requestAnimationFrame(() => m.classList.add('open'));
    document.documentElement.classList.add('lock');
    return m;
  };
  M.openSizes = () => M.modal('Таблица размеров', M.sizeTableHtml ? M.sizeTableHtml() : '');

  let toastT;
  const toast = document.createElement('button');
  toast.className = 'toast';
  M.toast = (text, action) => {
    toast.textContent = text;
    toast.dataset.action = action || '';
    toast.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('show'), 2400);
  };

  /* ========= Анимации появления ========= */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }) : null;
  M.enhance = (root) => {
    $$('[data-reveal]', root).forEach((el) => { if (io) io.observe(el); else el.classList.add('in'); });
    $$('img', root).forEach((img) => {
      if (img.complete && img.naturalWidth) { img.classList.add('loaded'); return; }
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
    });
    $$('[data-drag]', root).forEach(M.dragScroll);
  };
  M.dragScroll = (el) => {
    if (el._drag) return; el._drag = true;
    let down = false, sx = 0, sl = 0, moved = false;
    el.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = el.scrollLeft; });
    window.addEventListener('pointermove', (e) => { if (!down) return; const d = e.clientX - sx; if (Math.abs(d) > 4) { moved = true; el.classList.add('dragging'); } el.scrollLeft = sl - d; });
    window.addEventListener('pointerup', () => { down = false; setTimeout(() => el.classList.remove('dragging'), 0); });
    el.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    el.addEventListener('dragstart', (e) => e.preventDefault());
  };
  M.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========= Роутер ========= */
  let cleanup = null;
  const parse = () => {
    const raw = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = raw.split('?');
    return { path, q: Object.fromEntries(new URLSearchParams(qs || '')) };
  };
  const route = (path) => {
    let m;
    if (path === '/' || path === '') return ['home', []];
    if (path === '/catalog') return ['catalog', []];
    if ((m = path.match(/^\/product\/(\d+)$/))) return ['product', [m[1]]];
    const name = path.replace(/^\//, '');
    return M.views[name] ? [name, []] : ['notfound', []];
  };
  let first = true;
  M.render = () => {
    const app = $('#app');
    const { path, q } = parse();
    const [name, args] = route(path);
    const paint = () => {
      if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
      const v = M.views[name](q, ...args);
      document.title = v.title || 'MASY — российский бренд женской одежды';
      app.innerHTML = v.html;
      document.body.dataset.page = name;
      document.body.dataset.header = v.header || 'solid';
      window.scrollTo(0, 0);
      if (v.mount) cleanup = v.mount(app, q) || null;
      M.enhance(app);
      M.sync();
      $$('[data-nav]').forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + path));
      updateHeader();
      requestAnimationFrame(() => app.classList.remove('leaving'));
    };
    if (first || M.reduced) { first = false; paint(); return; }
    app.classList.add('leaving');
    setTimeout(paint, 260);
  };

  let lastY = 0;
  const updateHeader = () => {
    const y = window.scrollY;
    document.body.classList.toggle('scrolled', y > 40);
    document.body.classList.toggle('hide-head', y > 500 && y > lastY + 2);
    if (y < lastY - 2 || y < 500) document.body.classList.remove('hide-head');
    lastY = y;
  };

  /* ========= Запуск ========= */
  M.start = (opts) => {
    M.opts = opts;
    Object.assign(M.views, opts.views || {});
    document.body.insertAdjacentHTML('afterbegin', opts.header());
    const app = document.createElement('main');
    app.id = 'app';
    $('#appSlot') ? $('#appSlot').replaceWith(app) : document.body.append(app);
    document.body.insertAdjacentHTML('beforeend', opts.footer());
    menu.innerHTML = opts.menu ? opts.menu() : '';
    document.body.append(drawer, search, menu, toast);
    if (opts.afterShell) opts.afterShell();

    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-open],[data-close],[data-wish],[data-qty],[data-hint],.toast,.dd-btn');
      if (!e.target.closest('.dd')) $$('.dd.open').forEach((x) => x.classList.remove('open'));
      if (!t) return;
      if (t.matches('[data-wish]')) { e.preventDefault(); M.wish.toggle(+t.dataset.wish); M.toast(wish.includes(+t.dataset.wish) ? 'Добавлено в избранное' : 'Убрано из избранного'); return; }
      if (t.matches('[data-qty]')) { M.cart.qty(+t.dataset.qty, +t.dataset.d); return; }
      if (t.matches('[data-hint]')) { const i = $('#q', search); i.value = t.dataset.hint; runSearch(i.value); return; }
      if (t.matches('.toast')) { if (t.dataset.action === 'cart') M.openCart(); t.classList.remove('show'); return; }
      if (t.matches('[data-close]')) { if (t.tagName !== 'A') e.preventDefault(); closeOverlays(); return; }
      if (t.matches('[data-open]')) {
        const w = t.dataset.open;
        if (w === 'cart') M.openCart();
        if (w === 'search') { search.classList.add('open'); document.documentElement.classList.add('lock'); setTimeout(() => $('#q', search).focus(), 120); }
        if (w === 'menu') { menu.classList.add('open'); document.documentElement.classList.add('lock'); }
        if (w === 'sizes') M.openSizes();
      }
    });
    $('#q', search).addEventListener('input', (e) => runSearch(e.target.value));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOverlays(); });
    window.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('hashchange', () => { closeOverlays(); M.render(); });
    M.renderCart();
    M.render();
    M.sync();
  };

  /* Общая форма заявки на пошив: используется всеми тремя разделами «На заказ» */
  M.requestForm = (o = {}) => `
    <form class="req-form" id="reqForm" novalidate>
      <label class="field"><span>Имя</span><input name="name" autocomplete="name" required></label>
      <label class="field"><span>Телефон</span><input name="phone" inputmode="tel" autocomplete="tel" placeholder="+7" required></label>
      ${o.noWish ? '' : `<label class="field"><span>Пожелания: длина, ткань, цвет, ссылка на фото</span><textarea name="note" rows="2"></textarea></label>`}
      <label class="consent"><input type="checkbox" name="consent" required><span>Согласна на обработку персональных данных</span></label>
      <button class="btn btn-solid btn-wide" type="submit">${o.cta || 'Отправить заявку'}</button>
      <p class="form-err" hidden></p>
    </form>`;
  M.bindRequest = (root, buildText, onDone) => {
    const f = $('#reqForm', root);
    if (!f) return;
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const err = f.querySelector('.form-err');
      if (!f.name.value.trim() || f.phone.value.replace(/\D/g, '').length < 10) { err.hidden = false; err.textContent = 'Укажите имя и телефон, чтобы мы могли связаться с вами.'; return; }
      if (!f.consent.checked) { err.hidden = false; err.textContent = 'Нужно согласие на обработку данных.'; return; }
      const no = 'A' + String(Date.now()).slice(-6);
      const msg = `Здравствуйте! Заявка на пошив ${no}\n${buildText()}\nИмя: ${f.name.value}, телефон: ${f.phone.value}${f.note && f.note.value ? '\nПожелания: ' + f.note.value : ''}`;
      const box = document.createElement('div');
      box.className = 'done';
      box.innerHTML = `<h3>Заявка ${no} готова</h3><p>Отправьте её нам: текст и мерки уже в сообщении. Ответим в часы работы шоурума.</p><div class="done-actions">${M.sendLinks(msg)}</div>`;
      f.replaceWith(box);
      if (onDone) onDone(no);
    });
  };
})();
