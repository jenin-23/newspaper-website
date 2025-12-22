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
    
    let answered = 0;
    const inputs = document.querySelectorAll(`input[name^="quiz${quizNumber}-"]`);
    
    inputs.forEach(input => {
        if (input.checked) answered++;
    });
    
    if (answered === 0) {
        quizResult.textContent = "النتيجة: إذا أكملت الاختبار، أنت غير جاهز لمعرفة النتيجة.";
        quizResult.style.color = "#b00020";
    } else if (answered >= 2) {
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
    
    const answer = selected.value;
    
    if (answer === "nine") {
        resultElement.textContent = "مبروك! أنت ضمن الـ90٪ الذين يعتقدون أنهم استثناء. (هذا ليس مدحاً)";
        resultElement.style.color = "#b00020";
    } else if (answer === "ten") {
        resultElement.textContent = "تهانينا! أنت تعترف بأنك مخطئ. وهذا بحد ذاته قد يجعلك أذكى من المعدل.";
        resultElement.style.color = "#4caf50";
    }
    
    resultElement.classList.remove('hidden');
}

// عداد لاختبار الصبر
let counter = 0;
function incrementCounter() {
    counter++;
    const display = document.getElementById('counter-display');
    if (display) {
        display.textContent = counter;
        
        if (counter === 10) {
            alert('🎖️ وصلت لمستوى الصبر العادي');
        } else if (counter === 50) {
            alert('🏆 وصلت لمستوى صبر جنين (نسخة مبكرة)');
        } else if (counter === 100) {
            alert('👑 أنت أسطورة الصبر! حتى أحمد سينزل من البيت لك');
        }
    }
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // جعل جميع أزرار "اقرأ المزيد" تفاعلية
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    readMoreButtons.forEach(button => {
        const originalText = button.textContent;
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            const target = document.getElementById(targetId);
            
            if (target.classList.contains('hidden')) {
                this.textContent = '▲ إخفاء التفاصيل';
                this.style.backgroundColor = '#666';
            } else {
                this.textContent = originalText;
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
        const arabicDate = now.toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const timeElements = document.querySelectorAll('.date');
        timeElements.forEach(element => {
            element.textContent = arabicDate;
        });
    }
    
    // تحديث التاريخ عند التحميل
    updateDateTime();
    
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
    }).catch(err => {
        console.error('خطأ في النسخ:', err);
    });
}