// وظيفة لعرض/إخفاء المقالات الكاملة
function toggleArticle(articleId) {
    const article = document.getElementById(articleId);
    const button = event.target;
    
    if (article.classList.contains('hidden')) {
        article.classList.remove('hidden');
        button.textContent = '▲ إخفاء التفاصيل';
        button.style.backgroundColor = '#666';
        
        // تمرير سلس للقسم
        article.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        article.classList.add('hidden');
        button.textContent = '▶︎ اقرأ المزيد';
        button.style.backgroundColor = '';
    }
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // جعل جميع أزرار "اقرأ المزيد" تفاعلية
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            // تحديث النص في جميع الأزرار
            if (this.textContent.includes('إخفاء')) {
                this.textContent = '▶︎ اقرأ المزيد';
                this.style.backgroundColor = '';
            }
        });
    });
    
    // تفاعل مع صندوق الكتابة
    const textarea = document.querySelector('.writing-space textarea');
    if (textarea) {
        textarea.addEventListener('focus', function() {
            this.style.borderColor = '#2196f3';
            this.style.boxShadow = '0 0 0 3px rgba(33, 150, 243, 0.2)';
        });
        
        textarea.addEventListener('blur', function() {
            this.style.borderColor = '#e0e0e0';
            this.style.boxShadow = 'none';
        });
        
        // حفظ المكتوب في localStorage
        textarea.addEventListener('input', function() {
            localStorage.setItem('readerWish', this.value);
        });
        
        // استعادة المكتوب إن وجد
        const savedWish = localStorage.getItem('readerWish');
        if (savedWish) {
            textarea.value = savedWish;
        }
    }
    
    // إضافة تأثير عند تمرير الماوس على الإعلانات
    const adBoxes = document.querySelectorAll('.ad-box');
    adBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // إضافة تأثير النقر على المقالات
    const articles = document.querySelectorAll('.newspaper-article');
    articles.forEach(article => {
        article.addEventListener('click', function(e) {
            if (!e.target.closest('.read-more-btn') && !e.target.closest('.ad-box')) {
                this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
                setTimeout(() => {
                    this.style.boxShadow = 'var(--newspaper-shadow)';
                }, 300);
            }
        });
    });
    
    // تحديث الوقت في الترويسة
    function updateDateTime() {
        const now = new Date();
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const timeElement = document.querySelector('.date');
        if (timeElement) {
            const arabicDate = now.toLocaleDateString('ar-EG', dateOptions);
            timeElement.textContent = arabicDate;
        }
    }
    
    // تحديث الوقت كل دقيقة
    updateDateTime();
    setInterval(updateDateTime, 60000);
    
    // إضافة رسالة ترحيب في الكونسول
    console.log('%c📰 جريدة الهرج والمرج 📰', 'color: #b00020; font-size: 18px; font-weight: bold;');
    console.log('%c"كل ما لم يحدث نقدّمه لكم بالتفاصيل... مهم لك"', 'color: #666; font-style: italic;');
    
    // اختصار لوحة المفاتيح للتنقل
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + 1-4 للقفز للمقالات
        if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '4') {
            e.preventDefault();
            const articleId = 'article' + e.key;
            const article = document.getElementById(articleId);
            if (article) {
                article.scrollIntoView({ behavior: 'smooth' });
                
                // إبراز المقال
                article.style.backgroundColor = '#fff9e6';
                setTimeout(() => {
                    article.style.backgroundColor = '';
                }, 2000);
            }
        }
        
        // مسافة لإظهار/إخفاء المقال الحالي تحت المؤشر
        if (e.code === 'Space' && !e.target.matches('textarea, input')) {
            e.preventDefault();
            const activeArticle = document.elementFromPoint(
                window.innerWidth / 2, 
                window.innerHeight / 2
            )?.closest('.newspaper-article');
            
            if (activeArticle) {
                const articleId = activeArticle.id + '-full';
                const button = activeArticle.querySelector('.read-more-btn');
                if (button) button.click();
            }
        }
    });
    
    // تأثير تحميل الصفحة
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
        
        // إظهار إشعار ترحيبي
        setTimeout(() => {
            console.log('%c✨ تم تحميل جريدة الهرج والمرج بنجاح!', 'color: #4caf50; font-size: 14px;');
        }, 500);
    });
});

// وظيفة لمشاركة المقال
function shareArticle(articleNumber) {
    const articleTitles = {
        1: "طالب طب بيطري في عامه الثالث ينجو من سنة أولى... للمرة الثانية",
        2: "العلاقة العابرة للقارات: كيف صمدت جنين في ألمانيا",
        3: "إشاعة: مواطن يخضع لجلسات كهرباء في مستشفى الرشيد",
        4: "أحمد... الرجل الذي يظن نفسه باتمان"
    };
    
    const title = articleTitles[articleNumber] || 'جريدة الهرج والمرج';
    const url = window.location.href + '#article' + articleNumber;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: 'اقرأ هذا المقال المميز في جريدة الهرج والمرج',
            url: url
        });
    } else {
        // نسخ الرابط
        navigator.clipboard.writeText(url).then(() => {
            alert('✅ تم نسخ رابط المقال: ' + title);
        });
    }
}

// وظيفة لحفظ المقال
function saveArticle(articleNumber) {
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    if (!savedArticles.includes(articleNumber)) {
        savedArticles.push(articleNumber);
        localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
        alert('📌 تم حفظ المقال للقراءة لاحقاً');
    } else {
        alert('ℹ️ المقال محفوظ مسبقاً');
    }
}

// وظيفة للتحقق من المقالات المحفوظة
function showSavedArticles() {
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    if (savedArticles.length > 0) {
        console.log('📚 المقالات المحفوظة:', savedArticles);
    }
}

// استدعاء عند التحميل
showSavedArticles();