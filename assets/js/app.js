/* Global helpers (RTL newspaper site) */
(function () {
  "use strict";

  const LS = {
    night: "hm_night_glasses",
    nextIssueSeen: "hm_next_issue_seen_v1",
    savedArticles: "hm_saved_articles_v1",
    contactMessages: "hm_contact_msgs_v1",
  };

  const safeJSON = {
    parse(str, fallback) {
      try { return JSON.parse(str); } catch { return fallback; }
    },
    stringify(obj, fallback = "[]") {
      try { return JSON.stringify(obj); } catch { return fallback; }
    }
  };

  // =========================
  // 1) اقرأ المزيد (كما عندك)
  // =========================
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-toggle]");
    if (!btn) return;

    const id = btn.getAttribute("data-toggle");
    const panel = document.getElementById(id);
    if (!panel) return;

    const isHidden = panel.hasAttribute("hidden");
    if (isHidden) {
      panel.removeAttribute("hidden");
      btn.textContent = "إخفاء التفاصيل";
      btn.classList.add("is-open");
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      panel.setAttribute("hidden", "");
      btn.textContent = "اقرأ المزيد";
      btn.classList.remove("is-open");
    }
  });

  // =========================
  // 2) Quiz (كما عندك)
  // =========================
  const quizLogic = (quizNumber) => {
    const out = document.getElementById(`quiz-result-${quizNumber}`);
    if (!out) return;

    const keys = quizNumber === 1
      ? ["quiz1-q1", "quiz1-q2", "quiz1-q3"]
      : ["quiz2-q1", "quiz2-q2", "quiz2-q3"];

    const answered = keys
      .map((k) => document.querySelector(`input[name="${k}"]:checked`))
      .filter(Boolean).length;

    out.removeAttribute("hidden");
    if (answered === 0) {
      out.textContent = "النتيجة: إذا أكملت الاختبار، أنت غير جاهز لمعرفة النتيجة.";
      out.dataset.tone = "warn";
    } else if (answered === 3) {
      out.textContent = "مبروك! أنت قارئ ناضج جداً (أو مجرد متهكم محترف).";
      out.dataset.tone = "ok";
    } else {
      out.textContent = "أنت شخص عادي، وهذا ليس مدحاً ولا ذماً.";
      out.dataset.tone = "neutral";
    }
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-quiz-result]");
    if (!btn) return;
    quizLogic(parseInt(btn.getAttribute("data-quiz-result"), 10));
  });

  // =========================
  // 3) Counter (كما عندك)
  // =========================
  let counter = 0;
  const counterBtn = document.getElementById("counter-btn");
  const counterDisplay = document.getElementById("counter-display");
  if (counterBtn && counterDisplay) {
    counterBtn.addEventListener("click", () => {
      counter += 1;
      counterDisplay.textContent = String(counter);
      if (counter === 10) alert("🎖️ وصلت لمستوى الصبر العادي");
      if (counter === 50) alert("🏆 وصلت لمستوى صبر جنين (نسخة مبكرة)");
      if (counter === 100) alert("👑 أنت أسطورة الصبر! حتى أحمد سينزل من البيت لك");
    });
  }

  // =========================
  // 4) Reader wish (كما عندك)
  // =========================
  const wish = document.getElementById("readerWish");
  if (wish) {
    wish.value = localStorage.getItem("readerWish") || "";
    wish.addEventListener("input", () => localStorage.setItem("readerWish", wish.value));
  }

  // =========================
  // 5) Alt navigation (كما عندك)
  // =========================
  document.addEventListener("keydown", (e) => {
    if (!e.altKey) return;
    const map = { "1": "index.html", "2": "columns.html", "3": "entertainment.html", "4": "special.html" };
    if (!map[e.key]) return;
    e.preventDefault();
    window.location.href = map[e.key];
  });

  // =========================
  // 6) Konami (كما عندك)
  // =========================
  const secret = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let buffer = [];
  document.addEventListener("keydown", (e) => {
    buffer.push(e.key);
    if (buffer.length > secret.length) buffer.shift();
    if (buffer.join(",") === secret.join(",")) {
      alert('🎉 مبروك! لقد وجدت الرسالة السرية: "هذا العدد أُنجز بنية صادقة... تقريباً."');
      buffer = [];
    }
  });

  // =========================
  // 7) Copy phone (كما عندك)
  // =========================
  window.copyPhoneNumber = async (phoneNumber) => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      alert("📞 تم نسخ الرقم: " + phoneNumber);
    } catch {
      alert("تعذر نسخ الرقم. انسخه يدوياً: " + phoneNumber);
    }
  };

  // =========================================================
  // ✅ (9) قارئ ليلي / فلتر النظارة الصفراء
  // =========================================================
  function applyNight(isOn) {
    document.body.classList.toggle("night-glasses", Boolean(isOn));
  }

  // restore
  const nightSaved = localStorage.getItem(LS.night);
  if (nightSaved === "1") applyNight(true);

  // toggle button exists in nav (injected)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#night-toggle");
    if (!btn) return;
    const nowOn = !document.body.classList.contains("night-glasses");
    applyNight(nowOn);
    localStorage.setItem(LS.night, nowOn ? "1" : "0");
    btn.textContent = nowOn ? "🟡 قارئ نهاري" : "🟡 قارئ ليلي";
  });

  // set initial toggle label
  window.addEventListener("load", () => {
    const btn = document.getElementById("night-toggle");
    if (!btn) return;
    const on = document.body.classList.contains("night-glasses");
    btn.textContent = on ? "🟡 قارئ نهاري" : "🟡 قارئ ليلي";
  });

  // =========================================================
  // ✅ (12) Popup “العدد القادم” مرة واحدة
  // =========================================================
  function openNextIssueModal() {
    const modal = document.getElementById("next-issue-modal");
    const closeBtn = document.getElementById("next-issue-close");
    if (!modal || !closeBtn) return;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    const close = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      localStorage.setItem(LS.nextIssueSeen, "1");
    };

    closeBtn.addEventListener("click", close, { once: true });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    }, { once: true });

    document.addEventListener("keydown", function esc(e) {
      if (e.key !== "Escape") return;
      close();
      document.removeEventListener("keydown", esc);
    });
  }

  window.addEventListener("load", () => {
    const seen = localStorage.getItem(LS.nextIssueSeen);
    if (seen === "1") return;
    // لا نزعج المستخدم فوراً… نعطيه ثانية
    setTimeout(openNextIssueModal, 900);
  });

  // =========================================================
  // ✅ (11) حفظ المقال + Badge
  // =========================================================
  function getSaved() {
    return safeJSON.parse(localStorage.getItem(LS.savedArticles) || "[]", []);
  }
  function setSaved(list) {
    localStorage.setItem(LS.savedArticles, safeJSON.stringify(list));
  }
  function isSaved(id) {
    return getSaved().some((x) => x && x.id === id);
  }

  function markArticleUI(articleEl, saved) {
    if (!articleEl) return;
    const chip = articleEl.querySelector("[data-saved-chip]");
    const btn = articleEl.querySelector("[data-save-article]");
    if (chip) chip.hidden = !saved;
    if (btn) btn.textContent = saved ? "✅ محفوظ" : "📌 احفظ المقال";
  }

  // initialize saved badges on load
  window.addEventListener("load", () => {
    document.querySelectorAll("[data-article]").forEach((articleEl) => {
      const id = articleEl.getAttribute("data-article");
      if (!id) return;
      markArticleUI(articleEl, isSaved(id));
    });
  });

  // click save
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-save-article]");
    if (!btn) return;

    const articleId = btn.getAttribute("data-save-article");
    const articleEl = btn.closest("[data-article]");
    const title = btn.getAttribute("data-title") || (articleEl?.querySelector("h2")?.textContent || "مقال بدون عنوان");

    if (!articleId || !articleEl) return;

    const list = getSaved();
    const already = list.some((x) => x && x.id === articleId);

    if (already) {
      // toggle off (اختياري) — خليها إزالة
      const next = list.filter((x) => x && x.id !== articleId);
      setSaved(next);
      markArticleUI(articleEl, false);
      return;
    }

    list.push({
      id: articleId,
      title: title.trim(),
      href: `${window.location.pathname.split("/").pop() || "index.html"}#${articleId}`,
      savedAt: new Date().toISOString()
    });
    setSaved(list);
    markArticleUI(articleEl, true);
  });

  // =========================================================
  // ✅ صفحة اتصل بنا: حفظ رسالة محلياً
  // =========================================================
  window.addEventListener("load", () => {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const out = document.getElementById("contact-result");
    const nameEl = document.getElementById("contact-name");
    const topicEl = document.getElementById("contact-topic");
    const msgEl = document.getElementById("contact-message");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = (nameEl?.value || "").trim();
      const topic = (topicEl?.value || "").trim();
      const msg = (msgEl?.value || "").trim();

      if (!msg) {
        if (out) {
          out.hidden = false;
          out.dataset.tone = "warn";
          out.textContent = "الرسالة فاضية… زي وعود 'دقيقة وبرد'. اكتب سطرين على الأقل.";
        }
        return;
      }

      const list = safeJSON.parse(localStorage.getItem(LS.contactMessages) || "[]", []);
      list.push({
        name: name || "قارئ مجهول",
        topic: topic || "بدون عنوان رسمي",
        message: msg,
        at: new Date().toISOString()
      });
      localStorage.setItem(LS.contactMessages, safeJSON.stringify(list));

      if (out) {
        out.hidden = false;
        out.dataset.tone = "ok";
        out.textContent = "✅ تم استلام الرسالة (محلياً)… يعني وصلت للهيئة، بس الهيئة ممكن تكون نايمة.";
      }

      form.reset();
    });
  });

  // =========================================================
  // ✅ (Spin Wheel) عجلة الحظ
  // =========================================================
  function setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cssW = rect.width || 520;
    const cssH = rect.height || 520;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: cssW, h: cssH };
  }

  function drawWheel(canvas, items, angle) {
    const { ctx, w, h } = setupCanvas(canvas);
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2 - 16;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    // outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,.04)";
    ctx.fill();

    const slice = (Math.PI * 2) / items.length;

    for (let i = 0; i < items.length; i++) {
      const a0 = angle + i * slice;
      const a1 = a0 + slice;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, a0, a1);
      ctx.closePath();

      // alternating colors (بسيطة)
      ctx.fillStyle = i % 2 === 0 ? "rgba(164,0,30,.14)" : "rgba(41,74,155,.12)";
      ctx.fill();

      // text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a0 + slice / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(0,0,0,.82)";
      ctx.font = "700 14px system-ui, -apple-system, Segoe UI, Arial";
      ctx.fillText(items[i], r - 18, 0);
      ctx.restore();
    }

    // pointer
    ctx.beginPath();
    ctx.moveTo(cx, cy - r - 8);
    ctx.lineTo(cx - 10, cy - r + 14);
    ctx.lineTo(cx + 10, cy - r + 14);
    ctx.closePath();
    ctx.fillStyle = "rgba(164,0,30,.9)";
    ctx.fill();
  }

  function pickWheelIndex(items, angle) {
    const slice = (Math.PI * 2) / items.length;
    // pointer at -90deg
    const pointer = -Math.PI / 2;
    let a = (pointer - angle) % (Math.PI * 2);
    if (a < 0) a += Math.PI * 2;
    return Math.floor(a / slice) % items.length;
  }

  window.addEventListener("load", () => {
    const canvas = document.getElementById("wheel-canvas");
    const spinBtn = document.getElementById("wheel-spin");
    const out = document.getElementById("wheel-output");
    if (!canvas || !spinBtn || !out) return;

    const items = [
      "نام… وبعدين قرر",
      "رد بكلمة واحدة وبس",
      "أجّل كل شيء لِـ“بكرا”",
      "اطلع مع الشباب (حتى لو ما في شباب)",
      "افتح ريلز… وادعي",
      "اعمل إنجاز صغير واعتبره فتح مبين"
    ];

    let angle = 0;
    let spinning = false;

    // initial draw
    canvas.style.height = "420px";
    drawWheel(canvas, items, angle);

    spinBtn.addEventListener("click", () => {
      if (spinning) return;
      spinning = true;
      out.textContent = "…العجلة بتفكر (زي أحمد قبل ما يرد)";
      out.dataset.tone = "neutral";

      const extra = (Math.random() * Math.PI * 2);
      const turns = 6 + Math.random() * 4;
      const target = angle + turns * Math.PI * 2 + extra;

      const start = performance.now();
      const dur = 2200;

      const tick = (t) => {
        const p = Math.min(1, (t - start) / dur);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        angle = angle + (target - angle) * 0.18;
        drawWheel(canvas, items, angle);

        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          angle = target;
          drawWheel(canvas, items, angle);

          const idx = pickWheelIndex(items, angle);
          out.textContent = `🎯 النتيجة: ${items[idx]}`;
          out.dataset.tone = "ok";
          spinning = false;
        }
      };
      requestAnimationFrame(tick);
    });
  });

})();
