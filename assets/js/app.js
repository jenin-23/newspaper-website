/* Global helpers (RTL newspaper site) */
(function () {
  "use strict";

  // اقرأ المزيد / إخفاء التفاصيل
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

  // نتائج الاختبارات
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

  // عدّاد الصبر
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

  // حفظ مربع الكتابة
  const wish = document.getElementById("readerWish");
  if (wish) {
    wish.value = localStorage.getItem("readerWish") || "";
    wish.addEventListener("input", () => localStorage.setItem("readerWish", wish.value));
  }

  // Alt + 1-4 للتنقل
  document.addEventListener("keydown", (e) => {
    if (!e.altKey) return;
    const map = { "1": "index.html", "2": "columns.html", "3": "entertainment.html", "4": "special.html" };
    if (!map[e.key]) return;
    e.preventDefault();
    window.location.href = map[e.key];
  });

  // Konami easter egg
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

  // نسخ رقم الهاتف
  window.copyPhoneNumber = async (phoneNumber) => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      alert("📞 تم نسخ الرقم: " + phoneNumber);
    } catch {
      alert("تعذر نسخ الرقم. انسخه يدوياً: " + phoneNumber);
    }
  };
})();
