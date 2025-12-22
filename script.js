/* =========================================
   PRUMYSL STORE - MAIN JAVASCRIPT
   Handles Global Logic, Product Data, and Page Specifics
   ========================================= */

// --- 1. PRELOADER LOGIC (Runs immediately) ---
(function() {
    const fadeOutPreloader = () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            // Remove element after CSS transition (0.6s)
            setTimeout(() => { preloader.style.display = 'none'; }, 600);
        }
    };

    // Wait for full page load (images, scripts, styles)
    window.addEventListener('load', () => {
        // Ensure branding is visible for at least 500ms for smoothness
        setTimeout(fadeOutPreloader, 500);
    });

    // Failsafe: Force remove preloader if load takes too long (5s)
    setTimeout(fadeOutPreloader, 5000);
})();


document.addEventListener('DOMContentLoaded', () => {
    
    // --- 2. GLOBAL INITIALIZATION ---
    initScrollProgress();
    initMobileMenu();
    updateCopyrightYear();

    // --- 3. PAGE SPECIFIC LOGIC ---
    
    // Check if we are on the Home Page (look for hero section)
    if (document.querySelector('.hero')) {
        initScrollReveal();
        initHolographicCards();
        initFaqToggle();
    }

    // Check if we are on the Product Page (look for product container)
    if (document.querySelector('.product-container')) {
        document.body.classList.add('product-page-body'); // For CSS padding adjustment
        initProductPage();
    }

    // Check if we are on the Contact Page (look for contact form)
    if (document.querySelector('.contact-form-box')) {
        initContactPage();
    }
    
    // About page shares global logic mostly.
});

/* =========================================
   GLOBAL FUNCTIONS
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
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if (entry.isIntersecting) entry.target.classList.add('active'); 
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initHolographicCards() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

function initFaqToggle() {
    // Expose to window for onclick in HTML
    window.toggleFaqNew = function(button) {
        const item = button.parentElement;
        const answer = item.querySelector('.faq-answer');
        const isActive = item.classList.contains('active');
        
        // Close others
        document.querySelectorAll('.faq-item').forEach(i => { 
            i.classList.remove('active'); 
            i.querySelector('.faq-answer').style.maxHeight = null; 
        });

        // Open clicked if it wasn't active
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
        desc: "كاميرا شمسية 4G ثلاثية العدسات PTZ، بدقة 15 ميغابكسيل، 3 شاشات حية ومراقبة 360°.", 
        fullDesc: `
            <div class="desc-grid">
                <div class="desc-text">
                    <h3>3 عدسات = 3 شاشات حية</h3>
                    <p>لماذا تشتري 3 كاميرات بينما يمكنك امتلاك Omni-Guard؟</p>
                    <p>هذه الكاميرا تأتي بعدستين ثابتتين لمراقبة الزوايا المهمة وعدسة ثالثة متحركة (PTZ) تتبع الحركة 360 درجة.</p>
                    <div class="highlight-box"><strong style="color:var(--primary)">🎯 النتيجة:</strong> لا توجد نقاط عمياء نهائياً.</div>
                </div>
                <div class="desc-img-box"><img src="img/Prumysl Omni-Guard 360°.jpg" alt="3 Screen App View" class="desc-img"></div>
            </div>
            <div class="desc-grid">
                <div class="desc-img-box"><img src="img/Prumysl Omni-Guard 360°/Prumysl Omni-Guard 360°-main.jpg" alt="AI Human Tracking" class="desc-img"></div>
                <div class="desc-text">
                    <h3>ذكاء اصطناعي يتتبع المتسللين</h3>
                    <p>بمجرد دخول شخص غريب، تقوم الكاميرا بالدوران تلقائياً لتتبعه وترسل لك تنبيهاً فورياً.</p>
                </div>
            </div>
        `,
        images: [
            "img/Prumysl Omni-Guard 360°.jpg", 
            "img/Prumysl Omni-Guard 360°/Prumysl Omni-Guard 360°-main.jpg",
            "img/Prumysl Omni-Guard 360°/Prumysl Omni-Guard 360°-thumb-2.jpg"
        ], 
        specs: { "الدقة": "15 MP (3x5MP)", "البطارية": "8000 mAh Industrial", "الاتصال": "4G / LTE", "اللوح الشمسي": "16W High Efficiency", "الرؤية الليلية": "Color + IR (30m)" } 
    },
    2: { 
        title: "Prumysl Vision 6K Pro", 
        price: "1100 DH", 
        oldPrice: "1350 DH", 
        desc: "كاميرا شمسية ثلاثية العدسات 4G، دقة 6K وزووم رقمي 10X. رؤية فائقة الوضوح.", 
        fullDesc: `
            <div class="desc-grid">
                <div class="desc-text"><h3>دقة 6K: التفاصيل تصنع الفرق</h3><p>كاميرا Vision 6K Pro تعطيك صورة كريستالية تمكنك من قراءة لوحات السيارات.</p></div>
                <div class="desc-img-box"><img src="img/Prumysl Vision 6K Pro/Prumysl Vision 6K Pro-main.jpg" class="desc-img"></div>
            </div>
            <div class="desc-grid">
                <div class="desc-img-box"><img src="img/Prumysl Vision 6K Pro/Prumysl Vision 6K Pro-thumb-1.jpg" class="desc-img"></div>
                <div class="desc-text"><h3>زووم هجين 10X</h3><p>قرب الصورة 10 مرات دون أن تفقد المشهد العام.</p><div class="highlight-box"><strong style="color:var(--primary)">🛡️ ردع فوري:</strong> صافرات إنذار وأضواء كاشفة.</div></div>
            </div>
        `,
        images: [
            "img/Prumysl Vision 6K Pro.jpg", 
            "img/Prumysl Vision 6K Pro/Prumysl Vision 6K Pro-thumb-1.jpg", 
            "img/Prumysl Vision 6K Pro/Prumysl Vision 6K Pro-thumb-2.jpg",
            "img/Prumysl Vision 6K Pro/Prumysl Vision 6K Pro-main.jpg"
        ], 
        specs: { "الدقة": "6K Ultra HD", "الزووم": "10X Hybrid Zoom", "البطارية": "8000 mAh", "العدسات": "Triple Lens System", "التخزين": "SD Card / Cloud" } 
    },
    3: { 
        title: "Prumysl Euro-Shield", 
        price: "899 DH", 
        oldPrice: "1100 DH", 
        desc: "نسخة أوروبية متطورة، لوحين للطاقة وبطارية مدمجة. تصميم أنيق للفلل.", 
        fullDesc: `
             <div class="desc-grid">
                <div class="desc-text"><h3>أناقة التصميم الأوروبي</h3><p>تصميم مدمج (All-in-One) حيث البطاريات والألواح الشمسية مدمجة بشكل انسيابي.</p></div>
                <div class="desc-img-box"><img src="img/Prumysl Euro-Shield/Prumysl Euro-Shield-thumb-1.jpg" class="desc-img"></div>
            </div>
            <div class="desc-grid">
                <div class="desc-img-box"><img src="img/Prumysl Euro-Shield/Prumysl Euro-Shield-thumb-2.jpg" class="desc-img"></div>
                <div class="desc-text"><h3>تقنية اللوح المزدوج</h3><p>لوحين شمسيين لشحن أسرع بـ 50%.</p><div class="highlight-box"><strong style="color:var(--primary)">⚡ شتاء آمن:</strong> تعمل بكفاءة في الأيام الغائمة.</div></div>
            </div>
        `,
        images: [
            "img/Prumysl Euro-Shield.jpg", 
            "img/Prumysl Euro-Shield/Prumysl Euro-Shield-main.jpg", 
            "img/Prumysl Euro-Shield/Prumysl Euro-Shield-thumb-1.jpg", 
            "img/Prumysl Euro-Shield/Prumysl Euro-Shield-thumb-2.jpg"
        ], 
        specs: { "التصميم": "Compact Euro Design", "الطاقة": "Dual Panel Tech", "البطارية": "Built-in Long Life", "الاتصال": "4G / LTE", "مقاومة الماء": "IP66" } 
    },
    4: { 
        title: "Prumysl Duo 18W", 
        price: "699 DH", 
        oldPrice: "850 DH", 
        desc: "كاميرا ثنائية العدسة منخفضة الاستهلاك، 15 ميغابكسيل، لوحين 18W، متوفرة بنسخة WiFi أو 4G.", 
        fullDesc: `
            <div class="desc-grid">
                <div class="desc-text"><h3>طاقة جبارة: ألواح 18W</h3><p>تأتي Duo بلوح ضخم بقوة 18 واط، مما يجعلها الخيار الأفضل للمناطق قليلة الشمس.</p></div>
                <div class="desc-img-box"><img src="img/Prumysl Duo 18W/Prumysl Duo 18W-main.jpg" class="desc-img"></div>
            </div>
            <div class="desc-grid">
                <div class="desc-img-box"><img src="img/Prumysl Duo 18W/Prumysl Duo 18W-thumb-2.jpg" class="desc-img"></div>
                <div class="desc-text"><h3>تركيب منفصل</h3><p>تأتي مع كابل تمديد لوضع اللوح في الشمس والكاميرا في الظل.</p></div>
            </div>
        `,
        images: [
            "img/Prumysl Duo 18W.jpg", 
            "img/Prumysl Duo 18W/Prumysl Duo 18W-thumb-1.jpg", 
            "img/Prumysl Duo 18W/Prumysl Duo 18W-thumb-2.jpg",
            "img/Prumysl Duo 18W/Prumysl Duo 18W-main.jpg"
        ], 
        specs: { "الطاقة": "18W Split Panel", "النوع": "Dual Lens PTZ", "الدقة": "15 MP", "البطارية": "8000 mAh", "المستشعر": "PIR Motion" } 
    },
    5: { 
        title: "Prumysl Falcon 36X", 
        price: "2800 DH", 
        oldPrice: "3400 DH", 
        desc: "الوحش الصناعي: 24 ميغابكسل، زووم بصري 36X وبطارية 12000mAh.", 
        fullDesc: `
            <div class="desc-grid">
                <div class="desc-text"><h3>زووم بصري 36X (حقيقي)</h3><p>زووم بصري بعدسات متحركة (Optical Zoom) مثل الكاميرات الاحترافية.</p><div class="highlight-box"><strong style="color:var(--primary)">🔭 المدى:</strong> تغطية تصل إلى 1 كيلومتر.</div></div>
                <div class="desc-img-box"><img src="img/Prumysl Falcon 36X/Prumysl Falcon 36X-thumb-1.jpg" class="desc-img"></div>
            </div>
            <div class="desc-grid">
                <div class="desc-img-box"><img src="img/Prumysl Falcon 36X/Prumysl Falcon 36X-thumb-2.jpg" class="desc-img"></div>
                <div class="desc-text"><h3>دبابة مدرعة (Full Metal)</h3><p>جسم معدني كامل مصمم لتحمل حرارة الصحراء والصدمات.</p></div>
            </div>
        `,
        images: [
            "img/Prumysl Falcon 36X.jpg", 
            "img/Prumysl Falcon 36X/Prumysl Falcon 36X-main.jpg", 
            "img/Prumysl Falcon 36X/Prumysl Falcon 36X-thumb-1.jpg", 
            "img/Prumysl Falcon 36X/Prumysl Falcon 36X-thumb-2.jpg"
        ], 
        specs: { "الزووم": "36X Optical", "البطارية": "12000 mAh", "الهيكل": "Full Metal Alloy", "الدقة": "24 MP", "المدى": "Up to 1KM" } 
    },
    'batteries': { 
        title: "بطاريات Prumysl Li-Ion القابلة للشحن (USB-C)", 
        price: "149 DH", 
        oldPrice: "199 DH", 
        desc: "بطاريات ليثيوم 21700 مع منفذ شحن مباشر USB-C. سعة حقيقية 5100mWh.", 
        fullDesc: `
            <div class="desc-grid">
                <div class="desc-text"><h3>شحن مباشر وسهل (USB-C)</h3><p>منفذ Type-C مدمج في البطارية نفسها. اشحنها بكابل هاتفك.</p></div>
                <div class="desc-img-box"><img src="img/Feature-1.jpg" class="desc-img"></div>
            </div>
            <div class="desc-grid">
                <div class="desc-img-box"><img src="img/Feature-2.jpg" class="desc-img"></div>
                <div class="desc-text"><h3>سعة حقيقية 5100mWh</h3><div class="highlight-box"><strong style="color:var(--primary)">💰 توفير هائل:</strong> بطارية واحدة = 1200 بطارية عادية.</div></div>
            </div>
        `,
        images: [
            "img/Rechargeable-batteries.png", 
            "img/OFFER-1.jpg", 
            "img/OFFER-2.jpg"
        ], 
        specs: { "النوع": "Li-Ion 21700", "الطاقة": "5100 mWh", "الفولت": "1.5V Constant", "منفذ الشحن": "USB-C Built-in", "العمر": "1200+ Cycles" },
        offers: [
            { title: "باك التجربة (2 حبات)", price: "149 DH", oldPrice: "199 DH", img: "img/OFFER-1.jpg" }, 
            { title: "باك التوفير (4 حبات + كابل)", price: "249 DH", oldPrice: "398 DH", img: "img/OFFER-2.jpg" }
        ] 
    }
};

function initProductPage() {
    const params = new URLSearchParams(window.location.search);
    let pid = params.get('id') || 1;
    let p = PRODUCTS_DB[pid];

    if(!p) return; // Handle invalid ID

    // 1. Render Basic Info
    document.title = p.title + " | Prumysl Store";
    document.getElementById('p-title').innerText = p.title;
    document.getElementById('bread-title').innerText = p.title;
    document.getElementById('p-desc').innerText = p.desc;
    document.getElementById('full-desc-text').innerHTML = p.fullDesc;
    document.getElementById('view-counter').innerText = Math.floor(Math.random() * (25 - 8 + 1) + 8);

    // 2. WhatsApp Help Links
    const waHelpLink = `https://wa.me/212600000000?text=${encodeURIComponent("السلام عليكم، عندي استفسار بخصوص: " + p.title)}`;
    document.getElementById('wa-help-btn').href = waHelpLink;
    document.getElementById('wa-btn-mobile').href = waHelpLink;

    // 3. Handle Offers vs Standard
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

    // 4. Populate Specs
    const specsBody = document.getElementById('specs-body');
    for(const [k,v] of Object.entries(p.specs)) {
        specsBody.innerHTML += `<tr><th>${k}</th><td>${v}</td></tr>`;
    }

    // 5. Populate Related
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

    // 6. Thumbnails
    const thumbsContainer = document.getElementById('thumbs-container');
    if(p.images && p.images.length > 0 && !p.offers) {
        p.images.forEach((img, idx) => {
            thumbsContainer.innerHTML += 
                `<img src="${img}" class="thumb ${idx===0?'active':''}" onclick="changeImg(this, '${img}')">`;
        });
    }

    // 7. Zoom & Timer
    initZoomEffect();
    initCountdown();
}

// Product Page Helpers exposed to window
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

window.sendToWhatsApp = function(e) {
    e.preventDefault();
    const name = document.getElementById('order-name').value;
    const city = document.getElementById('order-city').value;
    const phone = document.getElementById('order-phone').value;
    const variant = document.getElementById('selected-variant').value;
    const product = document.getElementById('p-title').innerText;
    
    const msg = `*New Order:*\n📦 Product: ${product}\n🎨 Variant: ${variant}\n👤 Name: ${name}\n📍 City: ${city}\n📞 Phone: ${phone}`;
    window.open(`https://wa.me/212600000000?text=${encodeURIComponent(msg)}`, '_blank');
};

/* =========================================
   CONTACT PAGE LOGIC
   ========================================= */

function initContactPage() {
    window.sendWhatsAppContact = function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const topic = document.getElementById('topic').value;
        const msgText = document.getElementById('msg').value;

        const fullMsg = `*استفسار جديد:*\n👤 الاسم: ${name}\n📞 الهاتف: ${phone}\n📌 الموضوع: ${topic}\n📝 الرسالة: ${msgText}`;
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
    
    // Set deadline to 4 hours from now
    let time = 4 * 60 * 60; 
    
    const timer = setInterval(() => {
        let h = Math.floor(time / 3600);
        let m = Math.floor((time % 3600) / 60);
        let s = Math.floor(time % 60);
        
        el.innerText = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        time--;
        if(time < 0) time = 4 * 60 * 60; // Reset loop
    }, 1000);
}
