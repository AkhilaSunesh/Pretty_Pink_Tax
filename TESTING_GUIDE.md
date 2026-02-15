# Testing Guide - Pretty Pink Tax v2

## What Changed? 🔄

### Before (Static):
❌ Hardcoded database only  
❌ Pre-existing product links  
❌ No real-time updates  
❌ Limited to predefined products  

### After (Dynamic): ✅
✅ **Real-time Flipkart search**  
✅ **Live product scraping**  
✅ **Exact prices from Flipkart**  
✅ **Direct product links**  
✅ **Works for any product type**  
✅ **Only searches if cheaper**  

---

## How to Test

### Step 1: Start Backend Server
```bash
cd Pretty_Pink_Tax
python server.py
```
You should see:
```
 * Running on http://127.0.0.1:5000
```

### Step 2: Load Extension
1. Open Chrome → `chrome://extensions`
2. Developer mode: ON
3. Load unpacked → select `Pretty_Pink_Tax` folder

### Step 3: Test on Flipkart

#### Test Case 1: Women's Razor
1. Go to: https://www.flipkart.com/search?q=women+razor
2. Click any women's razor product
3. Wait 2-3 seconds...
4. 💅 Overlay appears with:
   - ⚡ **LIVE SEARCH** badge
   - Real men's razor from Flipkart
   - Exact current price
   - Exact savings amount
   - Direct link to buy

#### Test Case 2: Women's Deodorant
1. Go to: https://www.flipkart.com/search?q=women+deodorant
2. Click any women's deodorant
3. 💅 Overlay shows men's alternative with real prices

#### Test Case 3: Sanitary Product (No Alternative)
1. Go to: https://www.flipkart.com/search?q=sanitary+pad
2. Click any pad/napkin product
3. 🚨 Shows "LUXURY TAX" → Because these shouldn't have gender pricing!
4. No alternative offered (as it should be)

#### Test Case 4: Men's Product (No Alert)
1. Go to men's razor page
2. ✅ No overlay → No false positives!

---

## Difference from Static Version

### Static (Before):
```javascript
// Only these exact items trigger:
{
    keywords: ["venus", "women", "pink", "razor"], 
    men_equivalent: {
        name: "Gillette Mach 3 (Men)",
        price: "₹499",
        link: "hardcoded-link"
    }
}
```
❌ Only works if product title has exact keywords  
❌ Can miss variations like "Gillette Venus (Women's)"  
❌ Prices become outdated  

### Dynamic (After):
```javascript
// ANY women's razor gets real-time search:
const dynamicMatch = await fetchDynamicMatch(productTitle, currentPrice);
// Server searches Flipkart with BeautifulSoup
// Returns: actual product, actual price, actual link, actual image
```
✅ Works for any product title variation  
✅ Real-time prices from Flipkart  
✅ Shows exact product links  

---

## What the Server Does 🔧

### /find-match API:
```
GET http://127.0.0.1:5000/find-match?title=Women%20Venus%20Razor&price=500
```

**Response:**
```json
{
  "found": true,
  "match": {
    "name": "Gillette Mach 3 Fresh Clean Safety Razor",
    "price": 167,
    "link": "https://www.flipkart.com/gillette-mach-3...",
    "image": "https://rukminim2.flixcart.com/image/..."
  },
  "savings": 333,
  "savings_percent": 66.6
}
```

---

## Key Metrics to Verify ✅

While testing, confirm:

1. **API Response Time**: 2-3 seconds max
2. **Price Accuracy**: Compare with Flipkart page
3. **Link Validity**: Click should go to actual product
4. **Image Display**: Should show in overlay
5. **Savings Calculation**: Correct math
6. **Percentage Display**: e.g., "66.6% Cheaper"
7. **Fallback Works**: If server down, hardcoded still works

---

## Debug Hints 🐛

### Check Extension Console:
1. Right-click anywhere on Flipkart page
2. Select "Inspect" (or press F12)
3. Go to "Console" tab
4. Look for logs like:
   - ✅ `💅 Elle-gorithm: Loaded`
   - 🔄 `🔄 Starting live search for: Women Venus Razor`
   - ✅ `✅ Server found a dynamic match!`

### Check Server Console:
```
🔍 Searching for razor alternative to: women venus razor
🔎 Search Term: men women venus razor
Found 15 product containers
✅ Updated best match: Gillette Mach 3 @ ₹167
✅ Match found! Savings: ₹333 (66.6%)
```

### Troubleshoot:
- No overlay? → Check if it's a Flipkart product page
- Server not responding? → Check port 5000 available
- Wrong prices? → Flipkart may have updated layout
- Links broken? → Verify href extraction in BeautifulSoup

---

## Expected Behavior 🎯

### Good Scenarios (Show Overlay):
✅ Woman browsing: "Gillette Venus Razor" @ ₹500  
   → Shows: "Gillette Mach 3" @ ₹167 (saves ₹333)

✅ Woman browsing: "Nivea Women Deodorant" @ ₹250  
   → Shows: "Nivea Men Spray" @ ₹180 (saves ₹70)

### Skip Scenarios (No Overlay):
❌ Man browsing: "Gillette Mach 3 Razor"  
   → No popup (already has good price)

❌ Anyone browsing: "Sanitary Pad"  
   → Shows advocacy message instead  
   → Explains luxury tax, doesn't suggest alternative

❌ Browsing: Non-product page  
   → No action (privacy respecting)

---

## Performance Notes ⚡

- **Cold start**: First search may take 3-5s (network latency)
- **Warm start**: Subsequent searches 2-3s
- **Timeout**: If search fails after 3s, falls back to hardcoded DB
- **No performance hit**: Only searches on product pages

---

**Ready to Test?** 🚀  
1. `python server.py`
2. Load extension
3. Visit Flipkart
4. Look for the 💅 overlay!
