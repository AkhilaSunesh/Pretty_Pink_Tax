# 🎀 Pretty_Pink_Tax

<p align="center">
  <img width="1012" height="451" alt="Pretty Pink Tax Banner" src="https://github.com/user-attachments/assets/e5a764a6-3623-402c-8060-3a97d4726f1a" />
</p>

---

## 🎯 Basic Details

### 👩‍💻 Individual
- **Name:** Akhila Sunesh  
- **Institution:** Saintgits College of Engineering  

### 🔗 Hosted Project Link
👉 https://github.com/AkhilaSunesh/Pretty_Pink_Tax  
*(Replace with Chrome Web Store link if published)*

---

## 📌 Project Description

**Pretty_Pink_Tax** is a smart Chrome Extension that acts as your personal shopping advocate using the **“Elle-gorithm.”**

It detects when you're viewing a *Pink Tax* product — items marketed to women that cost more than identical men’s versions — on e-commerce platforms like Flipkart.

It instantly suggests the cheaper equivalent and lets you **“Switch & Save”** in one click.

---

## 🚨 Problem Statement

The **Pink Tax** is a discriminatory pricing practice where products marketed to women cost significantly more than identical products marketed to men.

Example:
- Pink razor: ₹299  
- Blue razor: ₹199  
- Same blades. Same function. Higher price.

Most shoppers:
- Don’t realize the price difference  
- Don’t manually search for the men’s version  
- Fall victim to branding and packaging  

---

## 💡 The Solution — “Elle-gorithm”

Our solution is a **Hybrid Analysis Engine** built into a Chrome Extension.

### 🔍 How It Works

1. **Real-Time Scraping**
   - Scans product title and price while you browse.

2. **Hybrid Detection System**
   - **Static Safety Net:**  
     Instantly detects known Pink Tax offenders from a local database.
   - **Dynamic Live Search:**  
     Queries Google Shopping via SerpApi to find the cheapest male equivalent in real-time.

3. **Instant Verdict**
   - Shows savings amount  
   - Displays percentage difference  
   - Provides a direct “Switch & Save” link  

---

## 🛠 Technical Details

### 💻 Technologies Used

**Frontend**
- JavaScript (Chrome Extension – Manifest V3)
- HTML/CSS

**Backend**
- Python
- Flask
- flask-cors
- google-search-results

**API**
- SerpApi (Google Shopping API)

**Tools**
- VS Code
- Git
- Chrome Developer Mode

---

## ✨ Features

- ✅ Real-Time Pink Tax Detection  
- ✅ Dynamic Live Price Comparison  
- ✅ “Switch & Save” Smart Redirect  
- ✅ Side-by-Side Functional Comparison  
- ✅ Advocacy Mode for essential products  
- ✅ Hybrid Static + Dynamic Matching  

---
## Screenshots
<img width="516" height="261" alt="image" src="https://github.com/user-attachments/assets/90960fcc-7bfd-44ad-bc58-3df75b93e699" />

<img width="420" height="545" alt="image" src="https://github.com/user-attachments/assets/3563fd41-e259-40cd-8a78-1691e3210bc6" />

<img width="412" height="368" alt="image" src="https://github.com/user-attachments/assets/ac798d88-de61-4746-9738-c587fd69d350" />

## ⚙️ Implementation

### 1️⃣ Backend Setup

```bash
git clone https://github.com/AkhilaSunesh/Pretty_Pink_Tax
cd backend
pip install flask flask-cors google-search-results
```
Add your SerpApi key inside server.py:

SERPAPI_KEY = "YOUR_KEY_HERE"
Start the backend server:

python server.py
Server runs at:

http://127.0.0.1:5000
### 2️⃣ Chrome Extension Setup
Open Chrome

Go to chrome://extensions/

Enable Developer Mode

Click Load Unpacked

Select the extension folder

### ▶️ How to Use
Open Flipkart.com

Search for:

“Venus Razor”

“Nivea Women Deodorant”

The extension will detect pricing differences automatically.

## 🏗 System Architecture
Chrome Extension (Client)
        ↓
Flask Backend (API Server)
        ↓
SerpApi (Google Shopping API)
        ↓
Returns cheapest male equivalent
        ↓
Extension displays savings verdict
### 🔄 Application Workflow
User visits product
      ↓
Content script extracts title + price
      ↓
Check static database
      ↓
Query SerpApi
      ↓
Backend computes savings
      ↓
Popup displays Switch & Save option
### 📡 API Documentation
Base URL
http://127.0.0.1:5000
Endpoint
GET /find-match
Parameters
title (string)

price (integer)

Example Response
{
  "found": true,
  "match": {
    "name": "Gillette Mach 3 Men's Razor",
    "price": 199,
    "link": "https://flipkart.com/search?q=...",
    "image": "https://image-url.com/...",
    "source": "Flipkart"
  },
  "savings": 100,
  "savings_percent": 33.5
}
## 🎥 Project Demo
https://screenrec.com/share/ZaeDBKNrIj

# This demo showcases:
- Problem Statement
- Solution


Live detection

API-based alternative lookup

Real savings calculation

“Switch & Save” functionality

## 🤖 AI Tools Used
Tool: Gemini (Google)

Used For:
Boilerplate generation

Flask backend structure


Final testing & reliability implementation


📜 License
This project is licensed under the MIT License.

❤️ Built at TinkerHub
Because fairness shouldn't cost extra.
