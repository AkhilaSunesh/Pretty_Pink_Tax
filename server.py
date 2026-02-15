# server.py - "Smart Blade Match" Version 🧠
from flask import Flask, request, jsonify
from flask_cors import CORS
from serpapi import GoogleSearch
import re
import urllib.parse

app = Flask(__name__)
CORS(app)

# 🔑 PASTE YOUR KEY HERE
SERPAPI_KEY = "6a85637365efb6f390d5cce037b9d82b56deac0e4e9201adb06a0d06f9c789e9" 

def extract_blade_count(title):
    # Looks for "5 blade", "3-blade", "5s", etc.
    match = re.search(r'(\d)[\s-]*(?:blade|blades)', title.lower())
    if match:
        return match.group(1) # Returns "3", "5", etc.
    return None

def search_men_alternative(query):
    print(f"🔍 Analyzing Product: {query}")
    
    # 1. Detect Blade Count (The Smart Part)
    blade_count = extract_blade_count(query)
    
    # 2. Build the Perfect Search Query
    if 'razor' in query.lower():
        if blade_count:
            search_term = f"men razor {blade_count} blade gillette"
            print(f"   ↳ Detected {blade_count} blades. Searching for exact match.")
        else:
            # Default fallback if no blade count found
            search_term = "gillette mach 3 men razor"
            print(f"   ↳ No blade count found. Using standard Mach 3.")
            
    elif 'deodorant' in query.lower():
        search_term = "nivea men fresh deodorant"
    else:
        # Generic fallback
        search_term = "men " + query.lower().replace("women", "").replace("pink", "")

    # 3. Search Google Shopping
    params = {
        "engine": "google_shopping",
        "q": search_term,
        "location": "India",
        "hl": "en",
        "gl": "in",
        "google_domain": "google.co.in",
        "api_key": SERPAPI_KEY
    }

    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        shopping_results = results.get("shopping_results", [])

        if shopping_results:
            top_result = shopping_results[0]
            
            # Clean Price
            price_raw = str(top_result.get("price", "0"))
            price_clean = re.sub(r'[^\d]', '', price_raw.split('.')[0])
            
            # Create Safe Flipkart Link
            encoded_name = urllib.parse.quote(top_result.get("title"))
            safe_link = f"https://www.flipkart.com/search?q={encoded_name}&sort=price_asc"

            return {
                "name": top_result.get("title"),
                "price": int(price_clean),
                "link": safe_link,
                "image": top_result.get("thumbnail"),
                "source": "Flipkart"
            }
            
    except Exception as e:
        print(f"⚠️ SerpApi Error: {e}")
        return None

    return None

@app.route('/find-match', methods=['GET'])
def find_match():
    title = request.args.get('title', '')
    price = request.args.get('price', '0')
    
    match = search_men_alternative(title)
    
    if match:
        try:
            current_price = int(float(price))
            savings = current_price - match['price']
            
            if current_price > 0:
                savings_percent = (savings / current_price) * 100
            else:
                savings_percent = 0

            return jsonify({
                "found": True,
                "match": match,
                "savings": savings,
                "savings_percent": round(savings_percent, 1)
            })
        except Exception as e:
            return jsonify({"found": False})
    
    return jsonify({"found": False})

if __name__ == '__main__':
    app.run(port=5000, debug=True)