// products.js

// 1. The "Pink Tax" Database (Items where we suggest a switch)
const PINK_TAX_DB = [
    {
        // Example: Gillette Venus
        keywords: ["venus", "women", "pink", "razor"], 
        men_equivalent: {
            name: "Gillette Mach 3 (Men)",
            price: "₹499",
            savings: "₹150",
            link: "https://www.flipkart.com/search?q=gillette%20mach%203" // Just a search link for the demo
        },
        message: "Objection! This razor is circumstantial evidence of bad pricing."
    },
    {
        // Example: Nivea Whitening
        keywords: ["nivea", "whitening", "deodorant", "women"],
        men_equivalent: {
            name: "Nivea Men Fresh Active",
            price: "₹190",
            savings: "₹60",
            link: "https://www.flipkart.com/search?q=nivea%20men%20fresh"
        },
        message: "Smell like a CEO for 25% less. What, like it's hard?"
    }
];

// 2. The "Advocacy" Database (Items with NO switch)
const ADVOCACY_DB = [
    "sanitary", 
    "napkin", 
    "pad", 
    "whisper", 
    "stayfree", 
    "tampon",
    "menstrual"
];