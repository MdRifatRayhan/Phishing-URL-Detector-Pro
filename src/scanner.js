const axios = require('axios');
require('dotenv').config();

async function analyzeURL(urlInput) {
    let score = 0;
    const issues = [];
    let vtStatus = "Clean/Not Found";

    try {
        // ১. URL ভ্যালিডেশন এবং নরমালাইজেশন
        const normalizedInput = urlInput.startsWith('http') ? urlInput : `http://${urlInput}`;
        const url = new URL(normalizedInput);

        // ২. আমাদের নিজস্ব সিকিউরিটি রুলস (Custom Rules)
        if (url.protocol === 'http:') { 
            score += 25; 
            issues.push("Insecure HTTP protocol instead of HTTPS."); 
        }
        
        if (urlInput.length > 75) { 
            score += 15; 
            issues.push("URL is unusually long (potential obfuscation)."); 
        }

        const keywords = ["login", "verify", "bank", "account", "update", "secure"];
        keywords.forEach(word => {
            if (urlInput.toLowerCase().includes(word)) {
                score += 10;
                issues.push(`Suspicious keyword detected: ${word}`);
            }
        });

        // ৩. VirusTotal API থেকে রিয়েল ডাটা আনা
        try {
            // VirusTotal-এর জন্য URL-কে Base64 এ এনকোড করতে হয়
            const urlId = Buffer.from(urlInput).toString('base64').replace(/=/g, "");
            const response = await axios.get(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
                headers: { 'x-apikey': process.env.VT_API_KEY }
            });
            
            const stats = response.data.data.attributes.last_analysis_stats;
            if (stats.malicious > 0) {
                score += 50;
                issues.push(`VirusTotal Warning: ${stats.malicious} engines flagged this as malicious!`);
                vtStatus = "Malicious";
            } else {
                vtStatus = "Clean";
            }
        } catch (apiErr) {
            console.log("VirusTotal: No previous data found for this URL.");
            vtStatus = "No Data in VirusTotal";
        }

        // স্কোর ১০০ এর মধ্যে রাখা
        score = Math.min(score, 100);

        // রিস্ক লেভেল নির্ধারণ
        let level = "Safe";
        if (score > 70) level = "High Risk";
        else if (score > 30) level = "Suspicious";

        return {
            url: urlInput,
            riskScore: score,
            riskLevel: level,
            detectedIssues: issues,
            vtStatus: vtStatus
        };

    } catch (e) {
        return { error: "Invalid URL format!" };
    }
}

module.exports = { analyzeURL };