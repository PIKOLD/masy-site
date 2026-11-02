/* Вариант 3: настоящая сантиметровая лента. Тянете рукой, она скользит по инерции и встаёт на полсантиметра */
(function () {
  M.tape = (canvas, o) => {
    const ctx = canvas.getContext('2d');
    const css = () => getComputedStyle(canvas);
    let val = o.value, min = o.min, max = o.max;
    let vel = 0, drag = false, lastX = 0, lastT = 0, raf = 0, W = 0, H = 0, dpr = 1;
    const PX = () => (W < 560 ? 15 : 22); // пикселей на сантиметр

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      draw();
    };
    const draw = () => {
      const s = css();
      const paper = s.getPropertyValue('--tape-paper').trim() || '#f7efe0';
      const ink = s.getPropertyValue('--tape-ink').trim() || '#3a2a20';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, W, H);
      const px = PX();
      const center = W / 2;
      const from = Math.floor(val - center / px) - 1;
      const to = Math.ceil(val + center / px) + 1;
      ctx.strokeStyle = ink; ctx.fillStyle = ink;
      ctx.textAlign = 'center';
      ctx.font = `${H < 70 ? 13 : 15}px ${s.getPropertyValue('--tape-font') || 'serif'}`;
      for (let c = from * 2; c <= to * 2; c++) {
        const cm = c / 2;
        const x = center + (cm - val) * px;
        if (x < -20 || x > W + 20) continue;
        const whole = Number.isInteger(cm);
        const five = whole && cm % 5 === 0;
        const ten = whole && cm % 10 === 0;
        const h = ten ? H * 0.46 : five ? H * 0.36 : whole ? H * 0.24 : H * 0.13;
        ctx.globalAlpha = cm < min || cm > max ? 0.18 : 1;
        ctx.lineWidth = ten ? 1.4 : 1;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        if (five) { ctx.fillText(String(cm), x, H - (H < 70 ? 9 : 13)); }
      }
      ctx.globalAlpha = 1;
    };
    const clamp = (v) => Math.max(min, Math.min(max, v));
    const set = (v, silent) => {
      val = clamp(v);
      draw();
      if (!silent && o.onChange) o.onChange(Math.round(val * 2) / 2);
    };
    const settle = () => {
      const target = Math.round(val * 2) / 2;
      const a = val, t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / 220);
        val = a + (target - a) * (1 - Math.pow(1 - k, 3));
        draw();
        if (k < 1) raf = requestAnimationFrame(step); else if (o.onChange) o.onChange(target);
      };
      raf = requestAnimationFrame(step);
    };
    const glide = () => {
      if (Math.abs(vel) < 0.002 || M.reduced) { settle(); return; }
      val = clamp(val + vel * 16);
      vel *= 0.94;
      if (val === min || val === max) vel = 0;
      draw();
      if (o.onChange) o.onChange(Math.round(val * 2) / 2);
      raf = requestAnimationFrame(glide);
    };
    canvas.addEventListener('pointerdown', (e) => {
      cancelAnimationFrame(raf); drag = true; vel = 0; lastX = e.clientX; lastT = performance.now();
      canvas.setPointerCapture(e.pointerId); canvas.classList.add('dragging');
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dv = -dx / PX();
      set(val + dv);
      const dt = Math.max(1, now - lastT);
      vel = Math.max(-0.03, Math.min(0.03, dv / dt)); // без рывка на всю ленту от резкого движения
      lastX = e.clientX; lastT = now;
    });
    const up = () => { if (!drag) return; drag = false; canvas.classList.remove('dragging'); if (performance.now() - lastT > 80) vel = 0; glide(); };
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('wheel', (e) => { e.preventDefault(); cancelAnimationFrame(raf); set(val + (e.deltaX + e.deltaY) / 60); clearTimeout(canvas._w); canvas._w = setTimeout(settle, 120); }, { passive: false });
    canvas.addEventListener('keydown', (e) => {
      const d = { ArrowLeft: -0.5, ArrowDown: -0.5, ArrowRight: 0.5, ArrowUp: 0.5, PageDown: -5, PageUp: 5 }[e.key];
      if (d) { e.preventDefault(); cancelAnimationFrame(raf); set(Math.round((val + d) * 2) / 2); }
    });
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    document.fonts && document.fonts.ready.then(draw);
    resize();
    return {
      to(v, nmin, nmax) {
        cancelAnimationFrame(raf);
        if (nmin !== undefined) { min = nmin; max = nmax; }
        const a = val, b = clamp(v), t0 = performance.now();
        const step = (now) => {
          const k = Math.min(1, (now - t0) / (M.reduced ? 1 : 620));
          val = a + (b - a) * (1 - Math.pow(1 - k, 4));
          draw();
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      destroy() { ro.disconnect(); cancelAnimationFrame(raf); },
    };
  };
})();
