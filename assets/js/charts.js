(function () {
  "use strict";

  const COLORS = {
    bar: "#a4001e",
    bar2: "#294a9b",
    bg: "#f3f4f6",
    grid: "#e5e7eb",
    text: "#111827",
    muted: "#6b7280",
    border: "#e5e7eb",
  };

  function setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cssW = rect.width || 680;
    const cssH = rect.height || 220;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
    return { ctx, w: cssW, h: cssH };
  }

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function drawBars(canvas, labels, values) {
    const { ctx, w, h } = setupCanvas(canvas);
    const padX = 16;
    const padY = 16;
    const labelW = Math.max(140, Math.min(220, Math.round(w * 0.34)));
    const valueW = 54;
    const plotW = w - padX * 2 - labelW - valueW;
    const max = Math.max(...values, 1);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX, padY);
    ctx.lineTo(padX, h - padY);
    ctx.stroke();

    const rows = values.length;
    const rowH = (h - padY * 2) / rows;
    const barH = Math.max(14, Math.min(22, rowH * 0.52));

    ctx.fillStyle = COLORS.text;
    ctx.font = "13px system-ui, -apple-system, Segoe UI, Arial";
    ctx.textBaseline = "middle";

    values.forEach((v, i) => {
      const cy = padY + rowH * i + rowH / 2;
      const x0 = padX + labelW;
      const y0 = cy - barH / 2;

      ctx.fillStyle = COLORS.text;
      ctx.fillText(labels[i], padX, cy);

      ctx.fillStyle = COLORS.bg;
      roundRect(ctx, x0, y0, plotW, barH, 8);
      ctx.fill();

      const bw = Math.max(2, Math.round(plotW * (v / max)));
      ctx.fillStyle = (i % 2 === 0) ? COLORS.bar : COLORS.bar2;
      roundRect(ctx, x0, y0, bw, barH, 8);
      ctx.fill();

      const text = String(v);
      ctx.fillStyle = COLORS.muted;
      const tx = padX + labelW + plotW + 10;
      ctx.fillText(text, tx, cy);
    });
  }

  function drawStack(canvas, labels, values) {
    const { ctx, w, h } = setupCanvas(canvas);
    const pad = 16;
    const total = values.reduce((a, b) => a + b, 0) || 1;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    const barY = Math.round(h * 0.28);
    const barH = 22;
    const barX = pad;
    const barW = w - pad * 2;

    ctx.fillStyle = COLORS.bg;
    roundRect(ctx, barX, barY, barW, barH, 10);
    ctx.fill();

    let x = barX;
    values.forEach((v, i) => {
      const segW = Math.max(1, Math.round(barW * (v / total)));
      ctx.fillStyle = (i % 2 === 0) ? COLORS.bar : COLORS.bar2;
      roundRect(ctx, x, barY, segW, barH, 10);
      ctx.fill();
      x += segW;
    });

    ctx.font = "13px system-ui, -apple-system, Segoe UI, Arial";
    ctx.textBaseline = "middle";
    let ly = barY + barH + 22;

    labels.forEach((label, i) => {
      ctx.fillStyle = (i % 2 === 0) ? COLORS.bar : COLORS.bar2;
      roundRect(ctx, pad, ly - 6, 12, 12, 4);
      ctx.fill();

      ctx.fillStyle = COLORS.text;
      ctx.fillText(`${label}`, pad + 18, ly);

      ctx.fillStyle = COLORS.muted;
      const pct = `${values[i]}%`;
      const tw = ctx.measureText(pct).width;
      ctx.fillText(pct, w - pad - tw, ly);

      ly += 20;
    });
  }

  function mountCharts() {
    document.querySelectorAll(".chart-card").forEach((el) => {
      const title = el.getAttribute("data-title") || "";
      const labels = (el.getAttribute("data-labels") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const values = (el.getAttribute("data-values") || "")
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((v) => !Number.isNaN(v));

      el.innerHTML = `
        <div class="chart-head">
          <h4>${title}</h4>
          <p class="muted">رسم توضيحي مبني على أرقام مذكورة في العدد.</p>
        </div>
      `;

      const canvas = document.createElement("canvas");
      canvas.className = "chart-canvas";
      canvas.style.width = "100%";
      canvas.style.height = labels.length >= 4 ? "220px" : "180px";
      el.appendChild(canvas);

      const kind = el.getAttribute("data-chart");
      if (kind === "stack") drawStack(canvas, labels, values);
      else drawBars(canvas, labels, values);
    });
  }

  window.addEventListener("load", mountCharts);
})();
