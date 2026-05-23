# 🛡️ PhishGuard - Professional Phishing URL Detector

PhishGuard is a full-stack cybersecurity web application designed to analyze URLs for potential phishing threats. It combines **Rule-based Heuristics** with **Real-time Threat Intelligence** using the VirusTotal API to provide a comprehensive risk score.

## 🚀 Live Demo
Click here to view the live app : https://phishguard-pro-sjfc.onrender.com

## ✨ Key Features
- **Heuristic Analysis:** Detects insecure HTTP protocols, suspicious keywords (login, bank, verify), and unusually long URLs.
- **VirusTotal Integration:** Cross-references URLs with 60+ global security engines for real-time malicious detection.
- **Risk Scoring:** Provides a clear risk score from 0-100 and classifies URLs as Safe, Suspicious, or High Risk.
- **Database Persistence:** Stores analysis history using **MongoDB Atlas**, allowing users to see recent scans even after a page refresh.
- **Export Report:** Users can download the analysis findings as a JSON report for further inspection.
- **Responsive UI:** Modern and clean user interface, optimized for all screen sizes.

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Cloud)
- **Security API:** VirusTotal API
- **Deployment:** Render (Server) & GitHub (Version Control)

## 📸 Preview
<img width="386" height="280" alt="dashboard" src="https://github.com/user-attachments/assets/9b0bb786-cb5b-4b29-8f1e-982a97686564" />

<img width="469" height="417" alt="test" src="https://github.com/user-attachments/assets/4f7aa933-eaa7-479a-b774-99bfc6895e9c" />

## ⚙️ Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/MdRifatRayhan/Phishing-URL-Detector-Pro


# 🛡️ PhishGuard Setup & Usage

### 🚀 Live Demo: https://phishguard-pro-sjfc.onrender.com

### ⚙️ Steps to Run Locally:
1. Install dependencies:
   $ npm install

2. Create a .env file and add your credentials:
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   VT_API_KEY=your_virustotal_api_key

3. Run the server:
   $ node server.js


🛡️ Disclaimer:
This tool is for educational and awareness purposes. 
While it uses advanced detection techniques, always 
exercise caution when visiting unknown links.

