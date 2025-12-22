(function () {
  "use strict";

  function drawBars(canvas, labels, values) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const pad = 18;
    const max = Math.max(...values, 1);
    const row = (h - pad * 2) / values.length;
    const barH = row * 0.62;
    const gap = row * 0.38;

    ctx.clearRect(0, 0, w, h);

    ctx.globalAlpha = 0.22;
    ctx.fillRect(pad, pad, 1, h - pad * 2);
    ctx.globalAlpha = 1;

    ctx.font = "14px system-ui";
    ctx.textBaseline = "middle";

    values.forEach((v, i) => {
      const y = pad + i * (barH + gap) + barH / 2;
      const barW = Math.round((w - pad * 2) * (v / max));

      ctx.globalAlpha = 0.16;
      ctx.fillRect(pad, y - barH / 2, w - pad * 2, barH);
      ctx.globalAlpha = 0.9;
      ctx.fillRect(pad, y - barH / 2, barW, barH);
      ctx.globalAlpha = 1;

      ctx.fillText(labels[i], pad + 6, y);
      const valueText = String(v);
      const tw = ctx.measureText(valueText).width;
      ctx.fillText(valueText, w - pad - tw, y);
    });
  }

  function drawStack(canvas, labels, values) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const pad = 18;
    const total = values.reduce((a,b)=>a+b,0) || 1;

    ctx.clearRect(0, 0, w, h);
    ctx.font = "14px system-ui";

    const barY = Math.round(h * 0.38);
    const barH = 22;

    ctx.globalAlpha = 0.16;
    ctx.fillRect(pad, barY, w - pad * 2, barH);
    ctx.globalAlpha = 1;

    let x = pad;
    values.forEach((v) => {
      const segW = Math.round((w - pad * 2) * (v / total));
      ctx.globalAlpha = 0.9;
      ctx.fillRect(x, barY, segW, barH);
      x += segW;
    });
    ctx.globalAlpha = 1;

    let ly = barY + barH + 28;
    labels.forEach((label, i) => {
      ctx.fillText(`${label} — ${values[i]}%`, pad, ly);
      ly += 20;
    });
  }

  function mountCharts() {
    document.querySelectorAll(".chart-card").forEach((el) => {
      const title = el.getAttribute("data-title") || "";
      const labels = (el.getAttribute("data-labels") || "").split(",").map(s => s.trim()).filter(Boolean);
      const values = (el.getAttribute("data-values") || "").split(",").map(s => parseFloat(s.trim())).filter(v => !Number.isNaN(v));

      el.innerHTML = `
        <div class="chart-head">
          <h4>${title}</h4>
          <p class="muted">رسم توضيحي مبني على أرقام مذكورة في العدد.</p>
        </div>
      `;

      const canvas = document.createElement("canvas");
      canvas.width = 680;
      canvas.height = labels.length >= 4 ? 220 : 170;
      canvas.className = "chart-canvas";
      el.appendChild(canvas);

      const kind = el.getAttribute("data-chart");
      if (kind === "stack") drawStack(canvas, labels, values);
      else drawBars(canvas, labels, values);
    });
  }

  window.addEventListener("load", mountCharts);
})();
