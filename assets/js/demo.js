/* Только для показа клиентке: переключатель вариантов. Перед запуском сайта достаточно убрать подключение этого файла */
(function () {
  const here = document.documentElement.dataset.variant;
  const box = document.createElement('div');
  box.className = 'demo-switch';
  box.innerHTML = `<a class="demo-all" href="../index.html" title="Все варианты">Вариант</a>${['v1', 'v2', 'v3'].map((v, i) => `<a class="${v === here ? 'on' : ''}" data-v="${v}" href="../${v}/index.html">${i + 1}</a>`).join('')}`;
  box.addEventListener('click', (e) => {
    const a = e.target.closest('[data-v]');
    if (!a) return;
    e.preventDefault();
    location.href = `../${a.dataset.v}/index.html${location.hash}`;
  });
  const st = document.createElement('style');
  st.textContent = `.demo-switch{position:fixed;right:12px;bottom:12px;z-index:90;display:flex;align-items:center;gap:1px;background:rgba(30,24,20,.86);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#fff;font:400 11.5px/1 Arial,sans-serif;border-radius:100px;padding:3px;opacity:.72;transition:opacity .25s}
  .demo-switch:hover{opacity:1}.demo-switch a{display:grid;place-items:center;min-width:24px;height:24px;border-radius:100px}.demo-switch .demo-all{padding:0 8px 0 10px;opacity:.75}.demo-switch .on{background:#fff;color:#1e1814}
  html[data-variant=v3] body[data-page=home] .demo-switch{bottom:76px}body.pp-mode .demo-switch{bottom:104px;right:auto;left:12px}@media(max-width:760px){.demo-switch .demo-all{display:none}body.pp-mode .demo-switch{display:none}}`;
  document.head.append(st);
  document.body.append(box);
})();
