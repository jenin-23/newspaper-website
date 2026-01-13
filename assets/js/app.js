/* Global helpers (RTL newspaper site) */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ====== اقرأ المزيد / إخفاء التفاصيل ====== */
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

  /* ====== فلتر النظارة الصفراء (Night) ====== */
  const nightBtn = $("#nightToggleBtn");
  const applyTheme = (isNight) => {
    const html = document.documentElement;
    if (isNight) html.setAttribute("data-theme", "night");
    else html.removeAttribute("data-theme");

    if (nightBtn) nightBtn.setAttribute("aria-pressed", String(!!isNight));
    localStorage.setItem("nightMode", isNight ? "1" : "0");
  };

  const savedTheme = localStorage.getItem("nightMode");
  if (savedTheme === "1") applyTheme(true);

  if (nightBtn) {
    nightBtn.addEventListener("click", () => {
      const isNight = document.documentElement.getAttribute("data-theme") === "night";
      applyTheme(!isNight);
    });
  }

  /* ====== Popup: العدد القادم (مرة واحدة) ====== */
  const modal = $("#nextIssueModal");
  const backdrop = $("#nextIssueBackdrop");
  const closeBtn = $("#closeNextIssue");

  const openModal = () => {
    if (!modal) return;
    if (backdrop) backdrop.removeAttribute("hidden");
    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (modal) modal.setAttribute("hidden", "");
    if (backdrop) backdrop.setAttribute("hidden", "");
    document.body.style.overflow = "";
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  document.addEventListener("click", (e) => {
    if (!modal || modal.hasAttribute("hidden")) return;
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  window.addEventListener("load", () => {
    try {
      const seen = localStorage.getItem("nextIssueSeen");
      if (!seen) {
        openModal();
        localStorage.setItem("nextIssueSeen", "1");
      }
    } catch {}
  });

  /* ====== حفظ المقال ====== */
  const SAVED_KEY = "savedArticles_v1";
  const readSaved = () => {
    try {
      return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
    } catch {
      return [];
    }
  };
  const writeSaved = (arr) => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(arr));
    } catch {}
  };
  const isSaved = (id) => readSaved().includes(id);

  const setSaveBtnState = (btn, saved) => {
    if (!btn) return;
    btn.textContent = saved ? "✅ محفوظ" : "📌 احفظ المقال";
    btn.setAttribute("aria-pressed", saved ? "true" : "false");
  };

  const paintSavedBadge = (articleEl, saved) => {
    if (!articleEl) return;
    const header = $(".article-header", articleEl);
    if (!header) return;

    const existing = header.querySelector(".badge.badge-saved");
    if (saved) {
      if (existing) return;
      const span = document.createElement("span");
      span.className = "badge badge-saved";
      span.textContent = "محفوظ";
      header.insertBefore(span, header.firstChild);
    } else {
      if (existing) existing.remove();
    }
  };

  const initSaveButtons = () => {
    $$("[data-save-article]").forEach((btn) => {
      const id = btn.getAttribute("data-article-id") || "";
      if (!id) return;
      setSaveBtnState(btn, isSaved(id));
      const articleEl = btn.closest("article");
      paintSavedBadge(articleEl, isSaved(id));
    });
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-save-article]");
    if (!btn) return;

    const id = btn.getAttribute("data-article-id") || "";
    if (!id) return;

    const saved = readSaved();
    const exists = saved.includes(id);
    const next = exists ? saved.filter((x) => x !== id) : [...saved, id];
    writeSaved(next);

    const nowSaved = next.includes(id);
    setSaveBtnState(btn, nowSaved);
    paintSavedBadge(btn.closest("article"), nowSaved);
  });

  window.addEventListener("load", initSaveButtons);

  /* ====== Quizzes: نتائج متعددة حسب إجاباتك ====== */
  const QUIZ_CONFIG = {
    "silence": {
      ranges: [
        { max: 1, tone: "warn", text: "النتيجة: أنت هادي… بس العالم رح يفسّر هدوءك كمؤامرة." },
        { max: 3, tone: "neutral", text: "النتيجة: طبيعي جداً. يعني: قابل للعيش اجتماعياً." },
        { max: 6, tone: "ok", text: "النتيجة: مبروك! عندك مناعة ضد السوالف الفارغة." },
      ],
    },
    "late-reply": {
      ranges: [
        { max: 1, tone: "warn", text: "أنت ترد بسرعة… هذا سلوك مريب وغير منتشر." },
        { max: 3, tone: "neutral", text: "ترد 'بالمتوسط'… يعني بتتذكر بعد ما يبرد الموضوع." },
        { max: 6, tone: "ok", text: "أنت خبير 'أرد لاحقاً'… و'لاحقاً' عندك مفهوم فلسفي." },
      ],
    },
    "social-battery": {
      ranges: [
        { max: 1, tone: "warn", text: "بطاريتك الاجتماعية 1%… ومع ذلك الناس مصرّة تسألك: 'ليش ساكت؟'." },
        { max: 3, tone: "neutral", text: "بطاريتك تتذبذب… زي الواي فاي وقت ما تكون محتاجه." },
        { max: 6, tone: "ok", text: "أنت اجتماعي محترف… بس أكيد بتندم بعدين." },
      ],
    },
    "life-advice": {
      ranges: [
        { max: 1, tone: "neutral", text: "أنت عملي… بس ما بتعترف إنك متوتر." },
        { max: 3, tone: "neutral", text: "أنت بتوازن بين المنطق والتمثيل… أداء قوي." },
        { max: 6, tone: "ok", text: "أنت تعيش بسلام… أو على الأقل تقنع حالك بهيك." },
      ],
    },
  };

  const scoreQuiz = (quizEl) => {
    const id = quizEl.getAttribute("data-quiz-id");
    const cfg = QUIZ_CONFIG[id];
    if (!cfg) return null;

    const inputs = $$('input[type="radio"]', quizEl);
    const names = Array.from(new Set(inputs.map((i) => i.name).filter(Boolean)));

    let score = 0;
    let answered = 0;
    names.forEach((n) => {
      const checked = quizEl.querySelector(input[name="${CSS.escape(n)}"],checked);
      if (!checked) return;
      answered += 1;
      const v = parseInt(checked.value || "0", 10);
      score += Number.isFinite(v) ? v : 0;
    });

    if (answered === 0) {
      return { tone: "warn", text: "النتيجة: إذا ما جاوبت… أنت أكيد فاهم الحياة." };
    }

    for (const r of cfg.ranges) {
      if (score <= r.max) return { tone: r.tone, text: r.text };
    }
    return cfg.ranges[cfg.ranges.length - 1];
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-quiz-submit]");
    if (!btn) return;

    const quizEl = btn.closest("[data-quiz-id]");
    if (!quizEl) return;

    const outId = btn.getAttribute("data-quiz-output");
    const out = outId ? document.getElementById(outId) : $(".result", quizEl);
    if (!out) return;

    const res = scoreQuiz(quizEl);
    if (!res) return;

    out.textContent = res.text;
    out.dataset.tone = res.tone || "neutral";
    out.removeAttribute("hidden");
    out.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  /* ====== Counter (يبقى كما هو) ====== */
  let counter = 0;
  const counterBtn = $("#counter-btn");
  const counterDisplay = $("#counter-display");
  if (counterBtn && counterDisplay) {
    counterBtn.addEventListener("click", () => {
      counter += 1;
      counterDisplay.textContent = String(counter);
      if (counter === 10) alert("🎖️ وصلت لمستوى الصبر العادي");
      if (counter === 50) alert("🏆 وصلت لمستوى صبر جنين (نسخة مبكرة)");
      if (counter === 100) alert("👑 أنت أسطورة الصبر! حتى أحمد سينزل من البيت لك");
    });
  }

  /* ====== Mini challenge (localStorage) ====== */
  const wish = $("#readerWish");
  if (wish) {
    wish.value = localStorage.getItem("readerWish") || "";
    wish.addEventListener("input", () => localStorage.setItem("readerWish", wish.value));
  }

  /* ====== Alt shortcuts ====== */
  document.addEventListener("keydown", (e) => {
    if (!e.altKey) return;
    const map = { "1": "index.html", "2": "columns.html", "3": "entertainment.html", "4": "special.html" };
    if (!map[e.key]) return;
    e.preventDefault();
    window.location.href = map[e.key];
  });

  /* ====== Konami ====== */
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

  /* ====== Copy phone ====== */
  window.copyPhoneNumber = async (phoneNumber) => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      alert("📞 تم نسخ الرقم: " + phoneNumber);
    } catch {
      alert("تعذر نسخ الرقم. انسخه يدوياً: " + phoneNumber);
    }
  };
})();