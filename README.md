# Pretty Pink Tax - Setup & Installation

## What This Extension Does 🎀
Detects the "Pink Tax" - where identical products are sold at different prices based on gender targeting. When you browse women's products on Flipkart, it instantly finds cheaper men's alternatives and shows you the savings.

---

## Installation Steps

### 1. Start the Backend Server
```bash
python server.py
```
This starts a Flask server on `http://localhost:5000` that performs real-time product searches on Flipkart.

**Requirements:**
```bash
pip install flask flask-cors requests beautifulsoup4
```

### 2. Load the Extension in Chrome
1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `Pretty_Pink_Tax` folder
5. Extension loaded! ✅

### 3. Test It
1. Go to Flipkart: https://www.flipkart.com
2. Search for "women razor" or "women deodorant"
3. Wait 2-3 seconds...
4. See the Elle-gorithm overlay! 💅

---

## How It Works

### Real-Time Search Flow:
```
User visits women's product page
           ↓
Extension detects women's product title
           ↓
Extension calls server API with product name
           ↓
Server searches Flipkart for men's alternative
           ↓
Server returns cheapest match with exact link
           ↓
Extension shows price comparison overlay
           ↓
User clicks link → bought at cheaper price ✅
```

### Fallback Mechanism:
If server is offline or search fails → Uses hardcoded database (still works!)

---

## File Structure

```
Pretty_Pink_Tax/
├── content.js          # Main extension logic (runs on Flipkart)
├── manifest.json       # Extension metadata
├── products.js         # Hardcoded product database
├── styles.css          # UI styling
├── server.py           # Backend (real-time search)
└── README.md           # This file
```

---

## Current Capabilities

### ✅ Works For:
- Women's razors → Men's razors
- Women's deodorant → Men's deodorant
- Women's shampoo → Men's shampoo

### ✅ Features:
- Real-time Flipkart search
- Exact product links
- Price comparison
- Savings calculation
- Product images
- Direct "Buy" links

### ⚠️ Limitations:
- Requires Flask server running locally
- Only works on Flipkart.com
- Scraping dependent on Flipkart HTML structure
- May need updates if Flipkart changes page layout

---

## Customization

### Add More Products:
Edit `server.py` → `PRODUCT_MAPPINGS` dictionary:
```python
'skincare': {
    'women': ['women', 'ladies', 'feminine'],
    'men_search': 'men skincare',
    'keywords': ['cream', 'lotion']
}
```

### Adjust Price Range:
In `server.py`, change `if price < 50 or price > 5000:`

### Change Search Results:
Edit the number of products checked: `products[:10]` → `products[:20]`

---

## Troubleshooting

### Extension Not Showing Overlay?
1. Check server is running: `python server.py`
2. Check you're on Flipkart.com
3. Check browser console for errors (F12)
4. Reload page

### Server Connection Failed?
1. Install dependencies: `pip install flask flask-cors requests beautifulsoup4`
2. Make sure port 5000 is free
3. Check firewall settings

### Wrong Products Showing?
Flipkart's HTML structure changes frequently. Might need to update CSS selectors in `server.py`.

---

## Features Explained 🎨

### Elle-gorithm Interface:
- 💅 **Pink Badge**: Indicates Pink Tax detected
- ⚡ **LIVE SEARCH**: Shows result came from real-time search
- 💾 **Savings %**: How much cheaper the alternative is
- 🔗 **Direct Link**: Goes straight to Flipkart product page
- 👁️ **View Details**: Shows detailed comparison modal

### Advocacy Mode:
For sanitary products (napkins, pads, tampons) → Shows "Luxury Tax" message instead of alternative products, because these shouldn't have gender pricing.

---

## Legal & Ethical Notes ⚖️

- Educational tool to expose pricing discrimination
- Respects Flipkart's terms (uses standard browser requests)
- No data collection or storage
- User data stays private
- Encourages conscious consumerism

---

## Future Updates 🚀

Potential improvements:
- Support for Amazon, eBay, other e-commerce sites
- Mobile app version
- Browser notifications
- Price history tracking
- Social sharing stats

---

**Status**: Production Ready ✅  
**Last Updated**: February 14, 2026
