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

// وظيفة لعرض نتيجة اختبار
function showQuizResult(quizNumber) {
    const quizResult = document.getElementById(`quiz-result-${quizNumber}`);
    if (!quizResult) return;
    
    const answers = {
        1: document.querySelector(`input[name="quiz1-q1"]:checked`),
        2: document.querySelector(`input[name="quiz1-q2"]:checked`),
        3: document.querySelector(`input[name="quiz1-q3"]:checked`)
    };
    
    const answered = Object.values(answers).filter(answer => answer !== null).length;
    
    if (answered === 0) {
        quizResult.textContent = "النتيجة: إذا أكملت الاختبار، أنت غير جاهز لمعرفة النتيجة.";
        quizResult.style.color = "#b00020";
    } else if (answered === 3) {
        quizResult.textContent = "مبروك! أنت قارئ ناضج جداً (أو مجرد متهكم محترف).";
        quizResult.style.color = "#4caf50";
    } else {
        quizResult.textContent = "أنت شخص عادي، وهذا ليس مدحاً ولا ذماً.";
        quizResult.style.color = "#666";
    }
    
    quizResult.classList.remove('hidden');
}

// وظيفة لعرض نتيجة دراسة
function showStudyResult() {
    const selected = document.querySelector('input[name="study"]:checked');
    const resultElement = document.getElementById('study-result');
    
    if (!selected || !resultElement) return;
    
    const answer = selected.nextSibling.textContent.trim();
    
    if (answer === "التسعة") {
        resultElement.textContent = "مبروك! أنت ضمن الـ90٪ الذين يعتقدون أنهم استثناء. (هذا ليس مدحاً)";
        resultElement.style.color = "#b00020";
    } else if (answer === "العاشر") {
        resultElement.textContent = "تهانينا! أنت تعترف بأنك مخطئ. وهذا بحد ذاته قد يجعلك أذكى من المعدل.";
        resultElement.style.color = "#4caf50";
    }
    
    resultElement.classList.remove('hidden');
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
    
    // إضافة تأثير عند تمرير الماوس على العناصر التفاعلية
    const interactiveElements = document.querySelectorAll('.ad-box, .column-box, .game-box, .special-box');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
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
    
    // اختصار لوحة المفاتيح للتنقل بين الصفحات
    document.addEventListener('keydown', function(e) {
        // Alt + 1-4 للقفز بين الصفحات
        if (e.altKey && e.key >= '1' && e.key <= '4') {
            e.preventDefault();
            const pages = ['index.html', 'columns.html', 'entertainment.html', 'special.html'];
            const pageIndex = parseInt(e.key) - 1;
            if (pages[pageIndex]) {
                window.location.href = pages[pageIndex];
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

// Easter egg: Secret message
let konamiCode = [];
const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    if (konamiCode.length > secretCode.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === secretCode.join(',')) {
        alert('🎉 مبروك! لقد وجدت الرسالة السرية: "هذا العدد أُنجز بنية صادقة... تقريباً."');
        konamiCode = [];
    }
});

// وظيفة لنسخ رقم الهاتف
function copyPhoneNumber(phoneNumber) {
    navigator.clipboard.writeText(phoneNumber).then(() => {
        alert('📞 تم نسخ الرقم: ' + phoneNumber);
    });
}