// Main section navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
        
        // Update navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.onclick && btn.onclick.toString().includes(sectionId)) {
                btn.classList.add('active');
            }
        });
        
        // Scroll to top of section
        window.scrollTo({
            top: selectedSection.offsetTop - 100,
            behavior: 'smooth'
        });
    }
}

// Quiz functionality
function showQuizResult() {
    const resultElement = document.getElementById('quiz-result');
    const answers = [
        document.querySelector('input[name="q1"]:checked'),
        document.querySelector('input[name="q2"]:checked'),
        document.querySelector('input[name="q3"]:checked')
    ];
    
    const answered = answers.filter(answer => answer !== null).length;
    
    if (answered === 0) {
        resultElement.textContent = "النتيجة: إذا أكملت الاختبار، أنت غير جاهز لمعرفة النتيجة.";
        resultElement.style.color = "#b00020";
    } else if (answered === 3) {
        const q1Answer = document.querySelector('input[name="q1"]:checked').nextSibling.textContent.trim();
        const q2Answer = document.querySelector('input[name="q2"]:checked').nextSibling.textContent.trim();
        const q3Answer = document.querySelector('input[name="q3"]:checked').nextSibling.textContent.trim();
        
        if (q1Answer === "تعرف أنه كاذب وتكمل سكرول" && 
            q2Answer === "تفهم القصة كاملة دون سماعها" && 
            q3Answer === "تعيد تقييم مفهوم العدالة الكونية") {
            resultElement.textContent = "مبروك! أنت قارئ ناضج جداً (أو مجرد متهكم محترف).";
            resultElement.style.color = "#4caf50";
        } else {
            resultElement.textContent = "أنت شخص عادي، وهذا ليس مدحاً ولا ذماً.";
            resultElement.style.color = "#666";
        }
    } else {
        resultElement.textContent = "النتيجة: إذا أكملت الاختبار، أنت غير جاهز لمعرفة النتيجة.";
        resultElement.style.color = "#b00020";
    }
}

// Study quiz functionality
document.querySelectorAll('input[name="study"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const result = this.nextSibling.textContent.trim();
        if (result === "التسعة") {
            alert("مبروك! أنت ضمن الـ90٪ الذين يعتقدون أنهم استثناء. (هذا ليس مدحاً)");
        } else if (result === "العاشر") {
            alert("تهانينا! أنت تعترف بأنك مخطئ. وهذا بحد ذاته قد يجعلك أذكى من المعدل.");
        }
    });
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Show first section by default
    showSection('front-page');
    
    // Add click handlers to all navigation buttons
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
    
    // Handle writing space in reader challenge
    const writingSpace = document.querySelector('.writing-space textarea');
    if (writingSpace) {
        writingSpace.addEventListener('focus', function() {
            if (this.value === '') {
                this.placeholder = "اكتب تمنيتك هنا... ثم انساها";
            }
        });
        
        writingSpace.addEventListener('blur', function() {
            if (this.value === '') {
                this.placeholder = "اكتب هنا...";
            }
        });
    }
    
    // Add print functionality
    const printButtons = document.querySelectorAll('.print-btn');
    printButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.print();
        });
    });
    
    // Share functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: 'جريدة الهرج والمرج',
                    text: '"كل ما لم يحدث نقدّمه لكم بالتفاصيل... مهم لك"',
                    url: window.location.href
                });
            } else {
                alert('شارك الرابط: ' + window.location.href);
            }
        });
    });
    
    // Save for later functionality
    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const articleTitle = this.closest('.article-actions').previousElementSibling.querySelector('h4').textContent;
            localStorage.setItem('savedArticle', articleTitle);
            alert('تم حفظ المقال للقراءة لاحقاً: ' + articleTitle);
        });
    });
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    const activeSection = document.querySelector('.content-section.active');
    if (!activeSection) return;
    
    const sectionOrder = ['front-page', 'investigations', 'relationships', 'entertainment', 'columns', 'ads', 'more-content', 'batman', 'final', 'games', 'editorial'];
    const currentIndex = sectionOrder.indexOf(activeSection.id);
    
    if (e.key === 'ArrowRight' && currentIndex < sectionOrder.length - 1) {
        e.preventDefault();
        showSection(sectionOrder[currentIndex + 1]);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        showSection(sectionOrder[currentIndex - 1]);
    } else if (e.key === 'Home') {
        e.preventDefault();
        showSection('front-page');
    } else if (e.key === 'End') {
        e.preventDefault();
        showSection('editorial');
    }
});

// Add visual feedback for interactive elements
document.querySelectorAll('button, .ad-box, .game-box').forEach(element => {
    element.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    element.addEventListener('mouseup', function() {
        this.style.transform = 'scale(1)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Handle images (placeholder functionality)
document.querySelectorAll('.article-image').forEach(image => {
    image.addEventListener('click', function() {
        const caption = this.querySelector('.image-caption');
        if (caption) {
            caption.style.display = caption.style.display === 'none' ? 'block' : 'none';
        }
    });
});

// Auto-scroll for breaking news
const breakingNews = document.querySelector('.breaking-news');
if (breakingNews) {
    let scrollPosition = 0;
    const scrollSpeed = 1;
    
    function scrollBreakingNews() {
        if (breakingNews.scrollWidth > breakingNews.clientWidth) {
            scrollPosition += scrollSpeed;
            if (scrollPosition >= breakingNews.scrollWidth - breakingNews.clientWidth) {
                scrollPosition = 0;
            }
            breakingNews.scrollLeft = scrollPosition;
        }
    }
    
    setInterval(scrollBreakingNews, 50);
}

// Add newspaper sound effects
function playNewspaperSound() {
    const paperSound = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
    paperSound.volume = 0.3;
    paperSound.play().catch(e => console.log("Sound play failed:", e));
}

// Play sound on section change
const originalShowSection = showSection;
showSection = function(sectionId) {
    playNewspaperSound();
    return originalShowSection(sectionId);
};

// Handle phone number clicks
document.querySelectorAll('.phone-number, .large-phone').forEach(element => {
    element.addEventListener('click', function() {
        const phoneNumber = this.textContent.replace(/\D/g, '');
        if (confirm(`هل تريد الاتصال بالرقم ${phoneNumber}؟`)) {
            window.location.href = `tel:${phoneNumber}`;
        }
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