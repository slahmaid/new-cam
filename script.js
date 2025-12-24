/* =========================================
   PRUMYSL STORE - MAIN JAVASCRIPT
   ========================================= */

// --- CONFIGURATION ---
const CONFIG = {
    // Your Google Apps Script Web App URL
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxwGoXoOoO7SNar7WE72szQk5ecRCIasyvjdMn0lBU9V1CccC2-yqDhBRoNJmZVBQQ/exec',
    
    // Your JSONBin Master Key
    JSONBIN_API_KEY: '$2a$10$W7Y1w05rI7FhqCSUCB/tRuDJYO2fRlTwgv2s3je3OlExS3oOz9UzG',
    
    // Your JSONBin Bin ID
    JSONBIN_BIN_ID: '694bdf4ad0ea881f403db4d1'
};

// --- 1. PRELOADER LOGIC ---
(function() {
    const fadeOutPreloader = () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => { preloader.style.display = 'none'; }, 600);
        }
    };
    window.addEventListener('load', () => setTimeout(fadeOutPreloader, 500));
    setTimeout(fadeOutPreloader, 5000);
})();

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initMobileMenu();
    updateCopyrightYear();

    if (document.querySelector('.hero')) {
        initScrollReveal();
        initHolographicCards();
        initFaqToggle();
    }

    if (document.querySelector('.product-container')) {
        document.body.classList.add('product-page-body');
        initProductPage();
    }

    if (document.querySelector('.contact-form-box')) {
        initContactPage();
    }
});

/* =========================================
   GLOBAL FUNCTIONS
   ========================================= */

function initScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    if(!bar) return;
    window.addEventListener('scroll', () => {
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = ((document.body.scrollTop || document.documentElement.scrollTop) / height) * 100;
        bar.style.width = scrolled + "%";
    });
}

function initMobileMenu() {
    window.toggleMenu = function() {
        const menu = document.getElementById('mobileMenu');
        if(menu) menu.classList.toggle('active');
    };
}

function updateCopyrightYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

/* =========================================
   HOME PAGE LOGIC
   ========================================= */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if (entry.isIntersecting) entry.target.classList.add('active'); 
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initHolographicCards() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });
}

function initFaqToggle() {
    window.toggleFaqNew = function(button) {
        const item = button.parentElement;
        const answer = item.querySelector('.faq-answer');
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => { 
            i.classList.remove('active'); 
            i.querySelector('.faq-answer').style.maxHeight = null; 
        });
        if (!isActive) { 
            item.classList.add('active'); 
            answer.style.maxHeight = answer.scrollHeight + "px"; 
        }
    };
}

/* =========================================
   PRODUCT PAGE LOGIC & DATA HANDLING
   ========================================= */

const PRODUCTS_DB = {
    1: { 
        title: "Prumysl Omni-Guard 360°", price: "1200 DH", oldPrice: "1500 DH", 
        desc: "كاميرا شمسية 4G ثلاثية العدسات PTZ، بدقة 15 ميغابكسيل، 3 شاشات حية ومراقبة 360°.", 
        fullDesc: `<div class="desc-grid"><div class="desc-text"><h3>3 عدسات = 3 شاشات حية</h3><p>لا توجد نقاط عمياء نهائياً.</p></div><div class="desc-img-box"><img src="img/Prumysl Omni-Guard 360°/Prumysl Omni-Guard 360°-desc-1.jpeg" class="desc-img"></div></div>`,
        images: ["img/Prumysl Omni-Guard 360°.jpg", "img/Prumysl Omni-Guard 360°/Prumysl Omni-Guard 360°-main.jpg"], 
        specs: { "الدقة": "15 MP", "البطارية": "8000 mAh", "الاتصال": "4G / LTE" } 
    },
    2: { 
        title: "Prumysl Vision 6K Pro", price: "1100 DH", oldPrice: "1350 DH", 
        desc: "كاميرا شمسية ثلاثية العدسات 4G، دقة 6K وزووم رقمي 10X. رؤية فائقة الوضوح.",
        fullDesc: "تفاصيل 6K وزووم هجين 10X.",
        images: ["img/Prumysl Vision 6K Pro.jpg"], 
        specs: { "الدقة": "6K Ultra HD", "الزووم": "10X Hybrid" } 
    },
    3: { title: "Prumysl Euro-Shield", price: "899 DH", oldPrice: "1100 DH", desc: "نسخة أوروبية متطورة.", fullDesc: "...", images: ["img/Prumysl Euro-Shield.jpg"], specs: {} },
    4: { title: "Prumysl Duo 18W", price: "699 DH", oldPrice: "850 DH", desc: "كاميرا ثنائية العدسة.", fullDesc: "...", images: ["img/Prumysl Duo 18W.jpg"], specs: {} },
    5: { title: "Prumysl Falcon 36X", price: "2800 DH", oldPrice: "3400 DH", desc: "الوحش الصناعي.", fullDesc: "...", images: ["img/Prumysl Falcon 36X.jpg"], specs: {} }
};

function initProductPage() {
    const params = new URLSearchParams(window.location.search);
    let pid = params.get('id') || 1;
    let p = PRODUCTS_DB[pid];
    if(!p) p = PRODUCTS_DB[1]; // Fallback

    document.title = p.title + " | Prumysl Store";
    document.getElementById('p-title').innerText = p.title;
    document.getElementById('bread-title').innerText = p.title;
    document.getElementById('p-desc').innerText = p.desc;
    document.getElementById('full-desc-text').innerHTML = p.fullDesc;
    document.getElementById('view-counter').innerText = Math.floor(Math.random() * (25 - 8 + 1) + 8);

    const waHelpLink = `https://wa.me/212600000000?text=${encodeURIComponent("استفسار: " + p.title)}`;
    document.getElementById('wa-help-btn').href = waHelpLink;
    document.getElementById('wa-btn-mobile').href = waHelpLink;

    updateDisplay(p.price, p.oldPrice, p.images[0]);
    document.getElementById('selected-variant').value = "Standard";

    const specsBody = document.getElementById('specs-body');
    for(const [k,v] of Object.entries(p.specs)) {
        specsBody.innerHTML += `<tr><th>${k}</th><td>${v}</td></tr>`;
    }

    const relatedGrid = document.getElementById('related-grid');
    let c = 0;
    for(const [k, rp] of Object.entries(PRODUCTS_DB)) {
        if(k != pid && c < 4) {
            relatedGrid.innerHTML += `<div class="r-card"><a href="product.html?id=${k}"><div class="r-img-wrap"><img src="${rp.images[0]}" loading="lazy"></div><div class="r-info"><div class="r-title">${rp.title}</div><div class="r-price">${rp.price}</div></div></a></div>`;
            c++;
        }
    }

    const thumbsContainer = document.getElementById('thumbs-container');
    p.images.forEach((img, idx) => {
        thumbsContainer.innerHTML += `<img src="${img}" class="thumb ${idx===0?'active':''}" onclick="changeImg(this, '${img}')">`;
    });

    initZoomEffect();
    initCountdown();
}

window.updateDisplay = function(price, old, img) {
    document.getElementById('p-price').innerText = price;
    document.getElementById('m-price').innerText = price;
    document.getElementById('p-old-price').innerText = old;
    document.getElementById('main-img').src = img;
};

window.changeImg = function(el, src) {
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    const mainImg = document.getElementById('main-img');
    mainImg.style.opacity = 0;
    setTimeout(() => { mainImg.src = src; mainImg.style.opacity = 1; }, 200);
};

// --- SUBMIT ORDER FUNCTION ---
window.submitOrder = async function(e) {
    e.preventDefault();

    // 1. Get Data
    const formData = {
        name: document.getElementById('order-name').value,
        city: document.getElementById('order-city').value,
        phone: document.getElementById('order-phone').value,
        variant: document.getElementById('selected-variant').value,
        product: document.getElementById('p-title').innerText,
        date: new Date().toISOString()
    };

    // 2. UI Loading State
    const btn = document.getElementById('submit-btn-el');
    const btnText = document.getElementById('btn-text');
    const loader = document.getElementById('btn-loader');
    
    btn.disabled = true;
    btn.style.opacity = "0.7";
    btnText.innerText = "جاري المعالجة...";
    loader.style.display = "inline-block";

    try {
        // 3. Send to Google Sheets (PRIMARY)
        const googleRequest = fetch(CONFIG.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        // 4. Send to JSONBin (BACKUP)
        // We create a NEW bin/record for each order to avoid race conditions.
        const jsonBinRequest = fetch('https://api.jsonbin.io/v3/b', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': CONFIG.JSONBIN_API_KEY,
                'X-Bin-Name': `Order-${formData.phone}` 
            },
            body: JSON.stringify(formData)
        });

        // Wait for both requests
        await Promise.all([googleRequest, jsonBinRequest]);

        // 5. Redirect on Success
        setTimeout(() => {
            window.location.href = `thankyou.html?product=${encodeURIComponent(formData.product)}`;
        }, 1000);

    } catch (error) {
        console.error("Order Error:", error);
        // Even if an error is caught in JS (network), Google Script 'no-cors' might still have worked.
        // We alert the user but provide the WhatsApp backup option visually on screen if they are stuck.
        alert("حدث خطأ بسيط في الاتصال. سيتم توجيهك للواتساب لإتمام الطلب.");
        window.sendToWhatsApp(e); // Fallback to WhatsApp method
        
        btn.disabled = false;
        btn.style.opacity = "1";
        btnText.innerText = "أكد الطلب الآن";
        loader.style.display = "none";
    }
};

// Fallback WhatsApp Function
window.sendToWhatsApp = function(e) {
    e.preventDefault();
    const name = document.getElementById('order-name').value;
    const city = document.getElementById('order-city').value;
    const phone = document.getElementById('order-phone').value;
    const variant = document.getElementById('selected-variant').value;
    const product = document.getElementById('p-title').innerText;
    
    const msg = `*New Order (Fallback):*\n📦 Product: ${product}\n🎨 Variant: ${variant}\n👤 Name: ${name}\n📍 City: ${city}\n📞 Phone: ${phone}`;
    window.open(`https://wa.me/212600000000?text=${encodeURIComponent(msg)}`, '_blank');
};

/* =========================================
   CONTACT PAGE LOGIC
   ========================================= */
function initContactPage() {
    window.sendWhatsAppContact = function(e) {
        e.preventDefault();
        const data = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            topic: document.getElementById('topic').value,
            msg: document.getElementById('msg').value
        };
        const fullMsg = `*استفسار جديد:*\n👤 الاسم: ${data.name}\n📞 الهاتف: ${data.phone}\n📌 الموضوع: ${data.topic}\n📝 الرسالة: ${data.msg}`;
        window.open(`https://wa.me/212600000000?text=${encodeURIComponent(fullMsg)}`, '_blank');
    };
}

/* =========================================
   HELPER UTILITIES
   ========================================= */
function initZoomEffect() {
    const container = document.getElementById('zoom-container');
    const img = document.getElementById('main-img');
    if(!container || !img) return;
    container.addEventListener('mousemove', function(e) {
        if(window.innerWidth < 900) return;
        const { left, top, width, height } = container.getBoundingClientRect();
        img.style.transformOrigin = `${(e.clientX - left) / width * 100}% ${(e.clientY - top) / height * 100}%`;
        img.style.transform = 'scale(2)'; 
    });
    container.addEventListener('mouseleave', function() {
        img.style.transform = 'scale(1)';
        img.style.transformOrigin = 'center center';
    });
}

function initCountdown() {
    const el = document.getElementById('countdown');
    if(!el) return;
    let time = 4 * 60 * 60; 
    setInterval(() => {
        let h = Math.floor(time / 3600), m = Math.floor((time % 3600) / 60), s = Math.floor(time % 60);
        el.innerText = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        time = time < 0 ? 4 * 60 * 60 : time - 1;
    }, 1000);
}
