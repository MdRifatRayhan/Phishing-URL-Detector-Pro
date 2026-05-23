async function checkURL() {
    const urlInput = document.getElementById('urlInput').value;
    const btn = document.getElementById('checkBtn');
    const loader = document.getElementById('loader');
    const resultSection = document.getElementById('resultSection');

    if (!urlInput) return alert("Please enter a URL to scan.");

    // UI State: Loading শুরু
    btn.disabled = true;
    loader.classList.remove('hidden');
    resultSection.classList.add('hidden');

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlInput })
        });

        const data = await response.json();
        
        if (response.ok) {
            displayResults(data.result);
            updateHistory(data.history);
        } else {
            alert(data.error || "Analysis failed.");
        }
    } catch (err) {
        alert("Server connection failed. Make sure MongoDB and Server are running.");
    } finally {
        btn.disabled = false;
        loader.classList.add('hidden');
    }
}

function displayResults(result) {
    const section = document.getElementById('resultSection');
    const levelBadge = document.getElementById('riskLevel');
    const scoreText = document.getElementById('riskScore');
    const issuesList = document.getElementById('issuesList');

    section.classList.remove('hidden');
    scoreText.innerText = result.riskScore;
    levelBadge.innerText = result.riskLevel;

    // রিস্ক লেভেল অনুযায়ী কালার পরিবর্তন
    levelBadge.className = 'badge'; // Reset classes
    if (result.riskLevel === 'Safe') levelBadge.classList.add('bg-safe');
    else if (result.riskLevel === 'Suspicious') levelBadge.classList.add('bg-suspicious');
    else levelBadge.classList.add('bg-danger');

    // ডিটেক্টেড ইস্যুগুলো লিস্ট আকারে দেখানো
    issuesList.innerHTML = result.detectedIssues.length > 0 
        ? result.detectedIssues.map(i => `<li>⚠️ ${i}</li>`).join('')
        : "<li>✅ No immediate threats detected by rules or VirusTotal.</li>";
    
    // VirusTotal স্ট্যাটাস আলাদাভাবে যোগ করা (অপশনাল)
    if(result.vtStatus) {
        issuesList.innerHTML += `<li style="margin-top:10px; font-weight:bold; color:#2c3e50;">🔍 VirusTotal Status: ${result.vtStatus}</li>`;
    }
}

function updateHistory(history) {
    const historyList = document.getElementById('historyList');
    if (!history || history.length === 0) return;

    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="hist-url">${item.url}</div>
            <div class="hist-info">
                <span class="hist-score">Score: ${item.riskScore}</span>
                <span class="hist-date">${new Date(item.date).toLocaleTimeString()}</span>
            </div>
        </div>
    `).join('');
}

// রিপোর্ট ডাউনলোড করার লজিক
function downloadReport() {
    const url = document.getElementById('urlInput').value;
    const score = document.getElementById('riskScore').innerText;
    const level = document.getElementById('riskLevel').innerText;
    const issues = Array.from(document.querySelectorAll('#issuesList li')).map(li => li.innerText);
    
    const reportData = {
        reportTitle: "PhishGuard Security Analysis Report",
        generatedAt: new Date().toLocaleString(),
        targetUrl: url,
        analysisResult: {
            riskScore: score,
            riskLevel: level,
            findings: issues
        },
        disclaimer: "This report is generated based on rule-based heuristics and VirusTotal intelligence."
    };

    // JSON ফাইল তৈরি এবং ডাউনলোড
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `PhishGuard_Report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
// পেজ লোড হওয়ার সাথে সাথে হিস্ট্রি দেখানোর জন্য
window.onload = async () => {
    try {
        const response = await fetch('/history');
        const history = await response.json();
        updateHistory(history);
    } catch (err) {
        console.log("Initial history fetch failed.");
    }
};