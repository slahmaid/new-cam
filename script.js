/* =========================================
   PRUMYSL STORE - MAIN JAVASCRIPT
   Handles Global Logic, Product Data, Google Sheets Integration
   ========================================= */

// --- 1. CONFIGURATION ---

// !!! PASTE YOUR GOOGLE DEPLOYMENT URL HERE !!!
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwsfRaKYBNK0W4vUdIgDT7Vzn2_PTZbUXWnGJL_t_opu8oHCcSxTrA_A_HkiiumxyI/exec"; 

// --- 2. PRELOADER LOGIC ---
(function() {
    const fadeOutPreloader = () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => { preloader.style.display = 'none'; }, 600);
        }
    };
    window.addEventListener('load', () => { setTimeout(fadeOutPreloader, 500); });
    setTimeout(fadeOutPreloader, 5000); // Failsafe
})();

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 3. GLOBAL INITIALIZATION ---
    initScrollProgress();
    initMobileMenu();
    updateCopyrightYear();

    // --- 4. PAGE SPECIFIC LOGIC ---
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
   BACKEND INTEGRATION FUNCTIONS
   ========================================= */

async function postDataToSheet(data) {
    if(GOOGLE_SCRIPT_URL.includes("XXXXXXXX")) {
        console.warn("Google Script URL not set!");
        return false;
    }
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", // Essential for Google Script
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return true;
    } catch (error) {
        console.error("Error submitting form", error);
        return false;
    }
}

/* =========================================
   GLOBAL UI FUNCTIONS
   ========================================= */

function initScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    if(!bar) return;
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
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
   PRODUCT PAGE LOGIC & DATABASE
   ========================================= */

const PRODUCTS_DB = {
    1: { 
        title: "Prumysl Omni-Guard 360°", 
        price: "1200 DH", 
        oldPrice: "1500 DH", 
        desc: "كاميرا شمسية 4G ثلاثية العدسات PTZ، بدقة 15 ميغابكسيل.", 
        fullDesc: `
            <div class="desc-grid">
                <div class="desc-text">
                    <h3>3 عدسات = 3 شاشات حية</h3>
                    <p>هذه الكاميرا تأتي بعدستين ثابتتين لمراقبة الزوايا المهمة وعدسة ثالثة متحركة (PTZ) تتبع الحركة 360 درجة.</p>
                </div>
                <div class="desc-img-box"><img src="img/Prumysl Omni-Guard 360°/Prumysl Omni-Guard 360°-desc-1.jpeg" class="desc-img"></div>
            </div>`,
        images: ["img/Prumysl Omni-Guard 360°.jpg", "img/Prumysl Omni-Guard 360°/Prumysl Omni-Guard 360°-main.jpg"], 
        specs: { "الدقة": "15 MP", "البطارية": "8000 mAh", "الاتصال": "4G / LTE" } 
    },
    2: { 
        title: "Prumysl Vision 6K Pro", 
        price: "1100 DH", 
        oldPrice: "1350 DH", 
        desc: "كاميرا شمسية ثلاثية العدسات 4G، دقة 6K وزووم رقمي 10X.", 
        fullDesc: `
            <div class="desc-grid">
                <div class="desc-text"><h3>دقة 6K: التفاصيل تصنع الفرق</h3><p>صورة كريستالية تمكنك من قراءة لوحات السيارات.</p></div>
                <div class="desc-img-box"><img src="img/Prumysl Vision 6K Pro/Prumysl Vision 6K Pro-desc-1.jpeg" class="desc-img"></div>
            </div>`,
        images: ["img/Prumysl Vision 6K Pro.jpg", "img/Prumysl Vision 6K Pro/Prumysl Vision 6K Pro-main.jpg"], 
        specs: { "الدقة": "6K Ultra HD", "الزووم": "10X Hybrid", "البطارية": "8000 mAh" } 
    },
    3: { 
        title: "Prumysl Euro-Shield", 
        price: "899 DH", 
        oldPrice: "1100 DH", 
        desc: "نسخة أوروبية متطورة، لوحين للطاقة وبطارية مدمجة.", 
        fullDesc: `
             <div class="desc-grid">
                <div class="desc-text"><h3>أناقة التصميم الأوروبي</h3><p>تصميم مدمج (All-in-One) حيث البطاريات والألواح الشمسية مدمجة.</p></div>
                <div class="desc-img-box"><img src="img/Prumysl Euro-Shield/Prumysl Euro-Shield-desc-1.jpeg" class="desc-img"></div>
            </div>`,
        images: ["img/Prumysl Euro-Shield.jpg", "img/Prumysl Euro-Shield/Prumysl Euro-Shield-main.jpg"], 
        specs: { "التصميم": "Compact Euro", "الطاقة": "Dual Panel", "البطارية": "Built-in" } 
    },
    4: { 
        title: "Prumysl Duo 18W", 
        price: "699 DH", 
        oldPrice: "850 DH", 
        desc: "كاميرا ثنائية العدسة، 15 ميغابكسيل، لوحين 18W.", 
        fullDesc: `
            <div class="desc-grid">
                <div class="desc-text"><h3>طاقة جبارة: ألواح 18W</h3><p>الخيار الأفضل للمناطق قليلة الشمس.</p></div>
                <div class="desc-img-box"><img src="img/Prumysl Duo 18W/Prumysl Duo 18W-desc-1.jpg" class="desc-img"></div>
            </div>`,
        images: ["img/Prumysl Duo 18W.jpg", "img/Prumysl Duo 18W/Prumysl Duo 18W-main.jpg"], 
        specs: { "الطاقة": "18W Split", "النوع": "Dual Lens", "الدقة": "15 MP" } 
    },
    5: { 
        title: "Prumysl Falcon 36X", 
        price: "2800 DH", 
        oldPrice: "3400 DH", 
        desc: "الوحش الصناعي: 24 ميغابكسل، زووم بصري 36X.", 
        fullDesc: `
            <div class="desc-grid">
                <div class="desc-text"><h3>زووم بصري 36X</h3><p>زووم بصري بعدسات متحركة (Optical Zoom) مثل الكاميرات الاحترافية.</p></div>
                <div class="desc-img-box"><img src="img/Prumysl Falcon 36X/Prumysl Falcon 36X-desc-1.jpeg" class="desc-img"></div>
            </div>`,
        images: ["img/Prumysl Falcon 36X.jpg", "img/Prumysl Falcon 36X/Prumysl Falcon 36X-main.jpg"], 
        specs: { "الزووم": "36X Optical", "البطارية": "12000 mAh", "الهيكل": "Metal Alloy" } 
    }
};

function initProductPage() {
    const params = new URLSearchParams(window.location.search);
    let pid = params.get('id') || 1;
    let p = PRODUCTS_DB[pid];

    if(!p) return;

    // Render Basic Info
    document.title = p.title + " | Prumysl Store";
    document.getElementById('p-title').innerText = p.title;
    document.getElementById('bread-title').innerText = p.title;
    document.getElementById('p-desc').innerText = p.desc;
    document.getElementById('full-desc-text').innerHTML = p.fullDesc;
    document.getElementById('view-counter').innerText = Math.floor(Math.random() * (25 - 8 + 1) + 8);

    // WhatsApp Help Links
    const waHelpLink = `https://wa.me/212600000000?text=${encodeURIComponent("السلام عليكم، عندي استفسار بخصوص: " + p.title)}`;
    document.getElementById('wa-help-btn').href = waHelpLink;
    document.getElementById('wa-btn-mobile').href = waHelpLink;

    // Handle Offers vs Standard
    const offersDiv = document.getElementById('offers-container');
    if(p.offers) {
        offersDiv.style.display = 'grid';
        p.offers.forEach((offer, i) => {
            offersDiv.innerHTML += `
                <div class="offer-option ${i===0?'selected':''}" onclick="selectOffer(this, '${offer.price}', '${offer.oldPrice}', '${offer.img}', '${offer.title}')">
                    <span style="font-size:0.9rem">${offer.title}</span>
                    <span class="offer-price-tag">${offer.price}</span>
                </div>`;
            if(i===0) {
                updateDisplay(offer.price, offer.oldPrice, offer.img);
                document.getElementById('selected-variant').value = offer.title;
            }
        });
    } else {
        updateDisplay(p.price, p.oldPrice, p.images[0]);
        document.getElementById('selected-variant').value = "Standard";
    }

    // Populate Specs
    const specsBody = document.getElementById('specs-body');
    for(const [k,v] of Object.entries(p.specs)) {
        specsBody.innerHTML += `<tr><th>${k}</th><td>${v}</td></tr>`;
    }

    // Populate Related
    const relatedGrid = document.getElementById('related-grid');
    let c = 0;
    for(const [k, rp] of Object.entries(PRODUCTS_DB)) {
        if(k != pid && c < 4) {
            let img = rp.offers ? rp.offers[0].img : rp.images[0];
            relatedGrid.innerHTML += `
                <div class="r-card">
                    <a href="product.html?id=${k}">
                        <div class="r-img-wrap"><img src="${img}" alt="${rp.title}" loading="lazy"></div>
                        <div class="r-info">
                            <div class="r-title">${rp.title}</div>
                            <div class="r-price">${rp.price}</div>
                        </div>
                    </a>
                </div>`;
            c++;
        }
    }

    // Thumbnails
    const thumbsContainer = document.getElementById('thumbs-container');
    if(p.images && p.images.length > 0 && !p.offers) {
        p.images.forEach((img, idx) => {
            thumbsContainer.innerHTML += 
                `<img src="${img}" class="thumb ${idx===0?'active':''}" onclick="changeImg(this, '${img}')">`;
        });
    }

    // Init Effects
    initZoomEffect();
    initCountdown();
}

// --- Product Page Helpers ---
window.updateDisplay = function(price, old, img) {
    document.getElementById('p-price').innerText = price;
    document.getElementById('m-price').innerText = price;
    document.getElementById('p-old-price').innerText = old;
    document.getElementById('main-img').src = img;
};

window.selectOffer = function(el, price, old, img, title) {
    document.querySelectorAll('.offer-option').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    updateDisplay(price, old, img);
    document.getElementById('selected-variant').value = title;
};

window.changeImg = function(el, src) {
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    const mainImg = document.getElementById('main-img');
    mainImg.style.opacity = 0;
    setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = 1;
    }, 200);
};

// --- UPDATED FORM HANDLER: ORDER ---
window.sendToWhatsApp = async function(e) {
    e.preventDefault();
    
    const btn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = btn.innerHTML;
    
    // UI Loading
    btn.innerHTML = `<span>جاري التسجيل...</span>`;
    btn.disabled = true;

    // Collect Data
    const name = document.getElementById('order-name').value;
    const city = document.getElementById('order-city').value;
    const phone = document.getElementById('order-phone').value;
    const variant = document.getElementById('selected-variant').value;
    const product = document.getElementById('p-title').innerText;
    const price = document.getElementById('p-price').innerText;

    // Send to Google Sheet
    const payload = { type: "order", name, city, phone, variant, product, price };
    await postDataToSheet(payload);

    // Prepare WhatsApp Message
    const msg = `*New Order:*\n📦 Product: ${product}\n💰 Price: ${price}\n🎨 Variant: ${variant}\n👤 Name: ${name}\n📍 City: ${city}\n📞 Phone: ${phone}`;
    
    // UI Success & Redirect
    btn.innerHTML = `<span>✔ تم بنجاح</span>`;
    setTimeout(() => {
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
        window.open(`https://wa.me/212600000000?text=${encodeURIComponent(msg)}`, '_blank');
        // Optional: Clear Inputs
        document.getElementById('order-name').value = "";
        document.getElementById('order-phone').value = "";
    }, 1000);
};

/* =========================================
   CONTACT PAGE LOGIC
   ========================================= */

function initContactPage() {
    // --- UPDATED FORM HANDLER: CONTACT ---
    window.sendWhatsAppContact = async function(e) {
        e.preventDefault();

        const btn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerHTML;
        
        btn.innerHTML = "جاري الإرسال...";
        btn.disabled = true;

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const topic = document.getElementById('topic').value;
        const msgText = document.getElementById('msg').value;

        // Send to Google Sheet
        const payload = { type: "contact", name, phone, topic, message: msgText };
        await postDataToSheet(payload);

        const fullMsg = `*استفسار جديد:*\n👤 الاسم: ${name}\n📞 الهاتف: ${phone}\n📌 الموضوع: ${topic}\n📝 الرسالة: ${msgText}`;

        btn.innerHTML = "✔ تم الإرسال";
        setTimeout(() => {
            btn.innerHTML = originalBtnText;
            btn.disabled = false;
            window.open(`https://wa.me/212600000000?text=${encodeURIComponent(fullMsg)}`, '_blank');
        }, 1000);
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
        const x = (e.clientX - left) / width * 100;
        const y = (e.clientY - top) / height * 100;
        img.style.transformOrigin = `${x}% ${y}%`;
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
    
    let time = 4 * 60 * 60; // 4 Hours
    setInterval(() => {
        let h = Math.floor(time / 3600);
        let m = Math.floor((time % 3600) / 60);
        let s = Math.floor(time % 60);
        
        el.innerText = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        time--;
        if(time < 0) time = 14400; 
    }, 1000);
}
