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

      <div class="theme-toggle" aria-label="إعدادات العرض">
        <button type="button" id="nightToggleBtn" aria-pressed="false" title="فلتر النظارة الصفراء">🟡 فلتر النظارة</button>
      </div>

      <p class="notice">⚠️ تنويه مهم: هذا العدد يحتوي على وقائع قد تشبه الواقع. أي تشابه ليس من مسؤوليتنا.</p>
    </div>
  </header>`;

  const nav = (active) => `
  <nav class="nav" aria-label="تنقل رئيسي">
    <a class="nav-link ${active==='index'?'active':''}" href="index.html">الأخبار الرئيسية</a>
    <a class="nav-link ${active==='columns'?'active':''}" href="columns.html">أعمدة الجريدة</a>
    <a class="nav-link ${active==='entertainment'?'active':''}" href="entertainment.html">فاصل ترفيهي</a>
    <a class="nav-link ${active==='special'?'active':''}" href="special.html">محتوى خاص</a>
  </nav>`;

  const footer = `
  <footer class="footer" role="contentinfo">
    <div class="footer-inner">
      <div>
        <h4>جريدة الهرج والمرج</h4>
        <p class="muted">${tagline}</p>
        <p class="muted">العدد رقم: <strong>${issueNo}</strong> — ${issueDate}</p>
      </div>

      <div>
        <h4>روابط</h4>
        <p class="muted"><a href="archive.html">أرشيف الأعداد</a> • <a href="about.html">من نحن؟</a></p>
        <p class="muted"><a href="contact.html">اتصل بنا</a> • <a href="special.html">محتوى خاص</a></p>
      </div>

      <div>
        <h4>ملاحظة تحريرية</h4>
        <p class="muted">جميع المواد المنشورة هي محض إشاعات (حسب سياسة الجريدة).</p>
        <div style="margin-top:10px">
          <a class="nav-link" href="contact.html" style="display:inline-block">اتصل بنا</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2026 جريدة الهرج والمرج. جميع الحقوق محفوظة.</p>
    </div>
  </footer>

  <div class="modal-backdrop" id="nextIssueBackdrop" hidden></div>
  <div class="modal" id="nextIssueModal" hidden role="dialog" aria-modal="true" aria-labelledby="nextIssueTitle">
    <div class="modal-inner">
      <h3 id="nextIssueTitle">العدد القادم</h3>
      <p class="muted">مصادر تؤكد أن العدد القادم سيصدر فور انتهاء: النوم، التأجيل، والـ “بس دقيقة”.</p>
      <button class="btn btn-soft" type="button" id="closeNextIssue">تمام</button>
      <p class="small-note">* تظهر هذه الرسالة مرة واحدة فقط احتراماً لطاقتكم.</p>
    </div>
  </div>`;

  const headerMount = document.getElementById("site-header");
  const navMount = document.getElementById("site-nav");
  const footerMount = document.getElementById("site-footer");

  if (headerMount) headerMount.innerHTML = header;
  if (navMount) navMount.innerHTML = nav(navMount.dataset.active || "index");
  if (footerMount) footerMount.innerHTML = footer;
})();