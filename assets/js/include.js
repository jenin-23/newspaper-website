(() => {
  const issueNo = "001";
  const issueDate = "السبت ٣٠ يناير ٢٠٢٦";
  const location = "عمّان - الأردن";
  const tagline = "\"كل ما لم يحدث نقدّمه لكم بالتفاصيل... مهم لك\"";

  const header = `
  <header class="masthead" role="banner">
    <div class="masthead-top">
      <div class="meta">
        <span class="meta-item">العدد رقم: <strong>${issueNo}</strong></span>
        <span class="sep">|</span>
        <span class="meta-item date">${issueDate}</span>
        <span class="sep">|</span>
        <span class="meta-item">السعر: <strong>طولة البال</strong></span>
      </div>
    </div>
    <div class="masthead-main">
      <h1 class="brand">جريدة الهرج والمرج</h1>
      <p class="tagline">${tagline}</p>
    </div>
    <div class="masthead-bottom">
      <span class="loc">${location}</span>
      <p class="notice">⚠️ تنويه مهم: هذا العدد يحتوي على وقائع قد تشبه الواقع. أي تشابه ليس من مسؤوليتنا.</p>
    </div>
  </header>`;

  // ملاحظة: ما ضفنا "اتصل بنا" لأزرار الأعلى (حسب طلبك).
  // فقط ضفنا Toggle النظارة الصفراء + بقينا على الأربع روابط الأساسية.
  const nav = (active) => `
  <nav class="nav" aria-label="تنقل رئيسي">
    <a class="nav-link ${active==='index'?'active':''}" href="index.html">الأخبار الرئيسية</a>
    <a class="nav-link ${active==='columns'?'active':''}" href="columns.html">أعمدة الجريدة</a>
    <a class="nav-link ${active==='entertainment'?'active':''}" href="entertainment.html">فاصل ترفيهي</a>
    <a class="nav-link ${active==='special'?'active':''}" href="special.html">محتوى خاص</a>

    <button class="pill-btn" type="button" id="night-toggle" title="فلتر النظارة الصفراء">
      🟡 قارئ ليلي
    </button>
  </nav>`;

  const footer = `
  <footer class="footer" role="contentinfo">
    <div class="footer-inner">
      <div>
        <h4>جريدة الهرج والمرج</h4>
        <p class="muted">${tagline}</p>
        <p class="muted">العدد رقم: <strong>${issueNo}</strong> — ${issueDate}</p>

        <div class="footer-links" aria-label="روابط إضافية">
          <a href="archive.html">أرشيف الأعداد</a>
          <a href="about.html">من نحن؟</a>
        </div>
      </div>

      <div>
        <h4>معلومات الاتصال</h4>
        <p class="muted">${location}</p>
        <p class="muted">هاتف الجريدة / الإعلانات: <strong dir="ltr">+9621432787</strong></p>
        <p class="muted">للطوارئ: “احكي لبسْبوس”</p>
      </div>

      <div>
        <h4>ملاحظة تحريرية</h4>
        <p class="muted">جميع المواد المنشورة هي محض إشاعات (حسب سياسة الجريدة).</p>
        <p class="muted">الحق في التناقض محفوظ.</p>
      </div>
    </div>

    <div class="footer-cta">
      <a class="nav-link" href="contact.html" style="text-decoration:none">اتصل بنا (آخر الصفحة… مش فوق)</a>
    </div>

    <div class="footer-bottom">
      <p>© 2026 جريدة الهرج والمرج. جميع الحقوق محفوظة.</p>
    </div>
  </footer>

  <!-- Modal: العدد القادم (مرة واحدة) -->
  <div class="modal-backdrop" id="next-issue-modal" role="dialog" aria-modal="true" aria-labelledby="next-issue-title" aria-hidden="true">
    <div class="modal">
      <h3 id="next-issue-title">🔔 تذكير بسيط من هيئة التحرير</h3>
      <p>العدد القادم قادم… بس مش أكيد إمتى. (إحنا بنشتغل على توقيت “دقيقة أحمد”).</p>
      <p class="muted">إذا شفت الرسالة هاي: معناته أنت قارئ وفيّ… أو لسا فاتح الصفحة بالغلط.</p>
      <div class="modal-actions">
        <button class="btn btn-soft" type="button" id="next-issue-close">تمام… فهمت</button>
        <a class="btn" href="archive.html" style="text-decoration:none; text-align:center;">شوف الأرشيف</a>
      </div>
    </div>
  </div>
  `;

  const headerMount = document.getElementById("site-header");
  const navMount = document.getElementById("site-nav");
  const footerMount = document.getElementById("site-footer");

  if (headerMount) headerMount.innerHTML = header;
  if (navMount) navMount.innerHTML = nav(navMount.dataset.active || "index");
  if (footerMount) footerMount.innerHTML = footer;
})();
