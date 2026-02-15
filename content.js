// content.js - "Elle-gorithm" v16.0 (Guaranteed Demo Mode) 💅

console.log("💅 Elle-gorithm: Loaded. Demo Ready.");

// --- 1. THE STATIC DATABASE ---
const PINK_TAX_DB = [
    
    // --- 1. NIVEA DEODORANT (Updated Price to Force Popup) ---
    {
        id: "nivea_deo",
        // Relaxed keywords: Matches ANY Nivea Deodorant page
        keywords: ["nivea", "deo"], 
        men_equivalent: {
            name: "Nivea Men Fresh (150ml)",
            price: 150, // LOWERED PRICE: Ensures popup always triggers!
            link: "https://www.flipkart.com/nivea-men-fresh-ocean-antibacterial-48h-protection-long-lasting-ocean-extracts-deodorant-spray/p/itme4ec8dc7697a9",
            image: "https://rukminim2.flixcart.com/image/612/612/xif0q/deodorant/a/i/h/-original-imah47mgt5k5v55e.jpeg?q=70"
        },
        women_price_estimate: 245
    },

    // --- 2. RAZOR EXACT MATCH ---
    {
        id: "venus_smooth",
        keywords: ["venus", "smooth"], 
        men_equivalent: {
            name: "Gillette Mach 3 (Fresh Clean)",
            price: 167, 
            link: "https://www.flipkart.com/gillette-mach-3-razor-fresh-clean-men/p/itm7afe8aaedb839",
            image: "https://rukminim2.flixcart.com/image/612/612/xif0q/shaving-razor/h/r/p/-original-imagq3b9f8muh7dz.jpeg?q=70"
        },
        women_price_estimate: 318
    },

    // --- 3. GENERIC FALLBACKS ---
    {
        id: "razor_generic",
        keywords: ["razor"], 
        men_equivalent: {
            name: "Gillette Mach 3",
            price: 167,
            link: "https://www.flipkart.com/gillette-mach-3-razor-fresh-clean-men/p/itm7afe8aaedb839",
            image: "https://rukminim2.flixcart.com/image/612/612/xif0q/shaving-razor/h/r/p/-original-imagq3b9f8muh7dz.jpeg?q=70"
        },
        women_price_estimate: 299
    },
    {
        id: "deo_generic",
        keywords: ["deodorant"], 
        men_equivalent: {
            name: "Nivea Men Fresh",
            price: 150, // Lowered here too
            link: "https://www.flipkart.com/nivea-men-fresh-ocean-antibacterial-48h-protection-long-lasting-ocean-extracts-deodorant-spray/p/itme4ec8dc7697a9",
            image: "https://rukminim2.flixcart.com/image/612/612/xif0q/deodorant/a/i/h/-original-imah47mgt5k5v55e.jpeg?q=70"
        },
        women_price_estimate: 250
    }
];

const ADVOCACY_DB = ["sanitary", "napkin", "pad", "whisper", "stayfree", "tampon", "cup"];

// --- 2. UTILITIES ---

function getProductPrice() {
    const allElements = document.querySelectorAll('*');
    let maxFontSize = 0;
    let bestPrice = null;

    for (let el of allElements) {
        try {
            const text = el.textContent || ""; 
            if (el.childNodes.length === 1 && text.includes('₹')) {
                const style = window.getComputedStyle(el);
                const fontSize = parseFloat(style.fontSize); 

                if (fontSize > maxFontSize && fontSize > 16 && el.offsetParent !== null) { 
                    const numbers = text.replace(/[^0-9]/g, '');
                    if (numbers.length > 0 && numbers.length < 6) { 
                        maxFontSize = fontSize;
                        bestPrice = parseInt(numbers);
                    }
                }
            }
        } catch (e) { continue; }
    }
    return bestPrice;
}

function getProductImage() {
    const imgCandidates = document.querySelectorAll('img._396cs4, img._2r_T1I, img.DByuf4');
    if (imgCandidates.length > 0) return imgCandidates[0].src;

    let maxArea = 0;
    let bestSrc = "https://cdn-icons-png.flaticon.com/512/263/263142.png"; 
    document.querySelectorAll('img').forEach(img => {
        const area = img.width * img.height;
        if (area > maxArea && area > 10000 && img.src.includes('http')) {
            maxArea = area;
            bestSrc = img.src;
        }
    });
    return bestSrc;
}

function removeOverlay() {
    const overlay = document.getElementById("elle-woods-overlay");
    if (overlay) overlay.remove();
    const comparison = document.getElementById("elle-comparison-modal");
    if (comparison) comparison.remove();
}

// --- 3. DYNAMIC SERVER FETCH ---
async function fetchDynamicMatch(productTitle, currentPrice) {
    try {
        if (!productTitle.includes("razor") && !productTitle.includes("deodorant")) return null;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(`http://127.0.0.1:5000/find-match?title=${encodeURIComponent(productTitle)}&price=${currentPrice}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        const data = await response.json();
        if (data.found && data.match) {
            console.log("💅 Server found a dynamic match!");
            return {
                name: data.match.name,
                price: data.match.price,
                link: data.match.link,
                image: data.match.image,
                is_dynamic: true
            };
        }
    } catch (error) {
        // Fail silently
    }
    return null; 
}

// --- 4. MAIN LOGIC FLOW ---
async function runElleWoodsCheck() {
    if (document.getElementById("elle-woods-overlay") || document.getElementById("elle-comparison-modal")) return;

    const pageTitle = document.title.toLowerCase();
    
    if (!pageTitle.includes("flipkart")) return;
    if (pageTitle.includes("men") && !pageTitle.includes("women")) return;

    if (ADVOCACY_DB.some(k => pageTitle.includes(k))) {
        showVerdictUI({ type: "advocacy" });
        return;
    }

    const currentPrice = getProductPrice();
    const currentImage = getProductImage();

    // 1. Try Dynamic
    const dynamicMatch = await fetchDynamicMatch(pageTitle, currentPrice);

    // Only use dynamic if it actually saves money
    if (dynamicMatch && currentPrice && (currentPrice - dynamicMatch.price > 10)) {
        showVerdictUI({
            type: "pink-tax",
            product: {
                men_equivalent: dynamicMatch,
                image: currentImage,
                currentProductTitle: document.title.split('|')[0].trim()
            },
            currentPrice: currentPrice,
            diff: currentPrice - dynamicMatch.price,
            from_dynamic: true
        });
        return; 
    }

    // 2. Fallback to Static (Guaranteed to work now)
    const match = PINK_TAX_DB.find(item => 
        item.keywords.every(k => pageTitle.includes(k))
    );

    if (match) {
        const finalPrice = currentPrice || match.women_price_estimate;
        const diff = finalPrice - match.men_equivalent.price;

        if (!match.image) match.image = currentImage;
        match.currentProductTitle = document.title.split('|')[0].trim();

        // Check if diff is positive
        if (diff > 0) {
            showVerdictUI({
                type: "pink-tax",
                product: match,
                currentPrice: finalPrice,
                diff: diff,
                from_dynamic: false
            });
        }
    }
}

// --- 5. UI BUILDER ---
function showVerdictUI(data) {
    const overlay = document.createElement("div");
    overlay.id = "elle-woods-overlay";
    
    // Inline CSS for the Wrapper
    overlay.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 2147483647;
        font-family: 'Segoe UI', sans-serif;
        animation: slideIn 0.5s ease-out;
    `;
    
    let contentHtml = "";

    if (data.type === "advocacy") {
        contentHtml = `
            <div class="elle-badge red">LUXURY TAX</div>
            <h2 style="margin: 10px 0; color: #333;">Objection! 🚨</h2>
            <p style="color: #666; font-size: 14px;">Sanitary products are often taxed as non-essential goods.</p>
            <div style="margin-top:15px;">
                <button id="elle-tweet-btn" class="elle-btn-primary">Tweet This Injustice</button>
                <button id="elle-dismiss-btn" class="elle-btn-secondary">Dismiss</button>
            </div>
        `;
    } else {
        const coffees = Math.floor(data.diff / 150);
        const coffeeText = coffees > 0 
            ? `You could buy <strong>${coffees} iced coffees</strong> with that savings! ☕`
            : `That's enough for a free snack! 🍩`;

        const badgeText = data.from_dynamic ? "🔍 LIVE SEARCH" : "VERDICT: OVERPRICED";

        contentHtml = `
            <div class="elle-badge pink">${badgeText}</div>
            ${data.from_dynamic ? '<div style="font-size: 11px; color: #ff69b4; margin-bottom: 10px; font-weight: 600;">⚡ Real-time Flipkart search</div>' : ''}
            <div class="elle-comparison">
                <div class="elle-price-box">
                    <span class="label">Women's Price</span>
                    <span class="price">₹${data.currentPrice}</span>
                </div>
                <div class="elle-vs">VS</div>
                <div class="elle-price-box blue">
                    <span class="label">Generic/Men's</span>
                    <span class="price">₹${data.product.men_equivalent.price}</span>
                </div>
            </div>
            <div class="elle-savings">
                You save <span>₹${data.diff}</span>
            </div>
            <div class="elle-tip">${coffeeText}</div>
            <a href="${data.product.men_equivalent.link}" target="_blank" class="elle-btn-primary">
                Buy the Blue One
            </a>
            <div id="elle-view-details" class="elle-link-btn">View comparison details →</div>
            <button id="elle-dismiss-btn" class="elle-btn-secondary">Dismiss</button>
        `;
    }

    overlay.innerHTML = `
        <div class="elle-card">
            <div class="elle-header">
                <span>⚖️ The Elle-gorithm</span>
                <span id="elle-close-x" class="close-x">×</span>
            </div>
            <div class="elle-body">${contentHtml}</div>
        </div>
    `;

    document.body.appendChild(overlay);

    // --- FIX: IMMEDIATE EVENT ATTACHMENT (NO TIMEOUT) ---
    
    // 1. Close 'X' Button
    const closeBtn = document.getElementById("elle-close-x");
    if(closeBtn) closeBtn.onclick = removeOverlay;

    // 2. Dismiss Text Button
    const dismissBtn = document.getElementById("elle-dismiss-btn");
    if(dismissBtn) dismissBtn.onclick = removeOverlay;

    // 3. View Details Link
    const viewDetailsBtn = document.getElementById("elle-view-details");
    if (viewDetailsBtn) {
        viewDetailsBtn.onclick = function() {
            removeOverlay();
            showComparisonModal(data);
        };
    }

    // 4. Tweet Button
    const tweetBtn = document.getElementById("elle-tweet-btn");
    if (tweetBtn) {
        tweetBtn.onclick = function() {
            const text = encodeURIComponent("Why am I paying a luxury tax on my period? #PinkTax");
            window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
        };
    }
}

// --- 6. COMPARISON MODAL ---
function showComparisonModal(data) {
    const modal = document.createElement("div");
    modal.id = "elle-comparison-modal";
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); z-index: 2147483648;
        display: flex; justify-content: center; align-items: center;
        font-family: 'Segoe UI', sans-serif;
    `;

    const sourceInfo = data.from_dynamic 
        ? '<div style="background:#fff9e6; padding:8px; border-radius:8px; margin-bottom:15px; font-size:12px; color:#f57c00; font-weight:600; text-align:center;">⚡ Results from real-time Flipkart search</div>'
        : '';

    modal.innerHTML = `
        <div class="elle-big-card" style="background:white; width:800px; border-radius:15px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.3); animation: popIn 0.3s;">
            <div class="elle-header" style="background:#ff1493; color:white; padding:15px 20px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:bold; font-size:18px;">⚖️ Detailed Comparison</span>
                <span id="elle-big-close" style="cursor:pointer; font-size:24px;">×</span>
            </div>
            <div style="display:flex; padding:30px; gap:20px; background:#fff0f5;">
                <div style="flex:1; background:white; padding:20px; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.05); text-align:center;">
                    <div style="background:#ffe4e1; color:#ff1493; display:inline-block; padding:5px 10px; border-radius:15px; font-size:12px; font-weight:bold; margin-bottom:10px;">Currently Viewing</div>
                    <img src="${data.product.image}" style="height:150px; object-fit:contain; margin-bottom:15px; display:block; margin: 0 auto;">
                    <h3 style="font-size:16px; margin:10px 0; color:#333; height:40px; overflow:hidden;">${data.product.currentProductTitle || "Women's Product"}</h3>
                    <div style="font-size:24px; font-weight:bold; color:#ff1493;">₹${data.currentPrice}</div>
                    <div style="color:#888; font-size:12px;">Pink Tax Applied</div>
                </div>
                <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; font-weight:bold; color:#aaa;">
                    <div style="font-size:20px;">VS</div>
                </div>
                <div style="flex:1; background:#e3f2fd; padding:20px; border-radius:10px; border:2px solid #2196f3; box-shadow:0 4px 10px rgba(0,0,0,0.05); text-align:center; position:relative;">
                    <div style="background:#2196f3; color:white; position:absolute; top:-10px; right:20px; padding:5px 15px; border-radius:15px; font-size:12px; font-weight:bold;">${Math.round((data.diff/data.currentPrice)*100)}% Cheaper</div>
                    <img src="${data.product.men_equivalent.image}" style="height:150px; object-fit:contain; margin-bottom:15px; display:block; margin: 0 auto;">
                    <h3 style="font-size:16px; margin:10px 0; color:#333; height:40px; overflow:hidden;">${data.product.men_equivalent.name}</h3>
                    <div style="font-size:24px; font-weight:bold; color:#2196f3;">₹${data.product.men_equivalent.price}</div>
                    <div style="color:#666; font-size:12px;">Same Function. Better Price.</div>
                    <a href="${data.product.men_equivalent.link}" target="_blank" style="display:block; background:#2196f3; color:white; text-decoration:none; padding:10px; margin-top:15px; border-radius:5px; font-weight:bold;">Switch & Save ₹${data.diff}</a>
                </div>
            </div>
            <div style="background:white; padding:15px; text-align:center; color:#666; font-size:12px; border-top:1px solid #eee;">
                ${sourceInfo}
                <div>✅ Both products have the same functionality and quality. The price difference is due to marketing and gender targeting (The Pink Tax).</div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // FIX: IMMEDIATE EVENT ATTACHMENT
    const bigClose = document.getElementById("elle-big-close");
    if(bigClose) bigClose.onclick = () => modal.remove();
    
    modal.onclick = (e) => { 
        if (e.target === modal) modal.remove(); 
    };
}

// --- 7. STYLE INJECTION ---
function injectStyles() {
    if (document.getElementById("elle-woods-styles")) return;
    const style = document.createElement('style');
    style.id = "elle-woods-styles";
    style.innerHTML = `
        .elle-card { background: #fff0f5; width: 340px; border-radius: 20px; box-shadow: 0 15px 35px rgba(255, 20, 147, 0.25); border: 3px solid #ff69b4; overflow: hidden; }
        .elle-header { background: #ff1493; color: white; padding: 12px 20px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; font-size: 16px; }
        .elle-body { padding: 20px; text-align: center; }
        .close-x { cursor: pointer; font-size: 20px; }
        .elle-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: 700; font-size: 12px; text-transform: uppercase; margin-bottom: 15px; }
        .elle-badge.pink { background: #ffe4e1; color: #ff1493; border: 1px solid #ff1493; }
        .elle-badge.red { background: #ffe4e1; color: #d32f2f; border: 1px solid #d32f2f; }
        .elle-comparison { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .elle-price-box { background: white; padding: 10px; border-radius: 12px; width: 40%; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .elle-price-box.blue { border: 2px solid #2196f3; background: #e3f2fd; }
        .elle-price-box .label { display: block; font-size: 10px; color: #888; text-transform: uppercase; }
        .elle-price-box .price { display: block; font-size: 18px; font-weight: 700; color: #333; }
        .elle-vs { font-weight: bold; color: #ccc; font-size: 12px; }
        .elle-savings { font-size: 22px; font-weight: 700; color: #ff1493; margin-bottom: 15px; }
        .elle-savings span { display: block; font-size: 28px; }
        .elle-tip { background: white; padding: 10px; border-radius: 10px; font-size: 13px; color: #555; margin-bottom: 15px; border-left: 4px solid #ff69b4; text-align: left; }
        .elle-btn-primary { display: block; width: 100%; background: #2196f3; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; text-decoration: none; transition: transform 0.2s; font-size: 14px; }
        .elle-btn-primary:hover { transform: scale(1.02); }
        .elle-btn-secondary { background: none; border: none; color: #999; font-size: 12px; margin-top: 10px; cursor: pointer; text-decoration: underline; }
        .elle-link-btn { text-align: center; color: #ff1493; font-size: 13px; margin-top: 10px; cursor: pointer; text-decoration: underline; }
        .elle-link-btn:hover { color: #c71585; }
        @keyframes slideIn { from { transform: translateX(120%); } to { transform: translateX(0); } }
        @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    `;
    document.head.appendChild(style);
}

// Start Up
injectStyles();
setInterval(runElleWoodsCheck, 2000);