const express = require('express');
const mongoose = require('mongoose');
const { analyzeURL } = require('./src/scanner');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// ১. MongoDB Atlas কানেকশন
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Atlas Connected Successfully!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ২. ডাটাবেস স্কিমা (কি কি সেভ হবে)
const AnalysisSchema = new mongoose.Schema({
    url: String,
    riskScore: Number,
    riskLevel: String,
    detectedIssues: [String],
    vtStatus: String,
    date: { type: Date, default: Date.now }
});
const Analysis = mongoose.model('Analysis', AnalysisSchema);

// ৩. API এন্ডপয়েন্ট
app.post('/analyze', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    // এনালাইসিস শুরু
    const result = await analyzeURL(url);

    if (result.error) {
        return res.status(400).json(result);
    }

    // ডাটাবেসে ফলাফল সেভ করা
    try {
        const newRecord = new Analysis(result);
        await newRecord.save();
    } catch (dbErr) {
        console.error("Database Save Error:", dbErr);
    }

    // ডাটাবেস থেকে সবশেষ ৫টি হিস্ট্রি নিয়ে আসা
    const history = await Analysis.find().sort({ date: -1 }).limit(5);

    res.json({ result, history });
});
// সবশেষ ৫টি হিস্ট্রি সরাসরি পাওয়ার জন্য নতুন এন্ডপয়েন্ট
app.get('/history', async (req, res) => {
    try {
        const history = await Analysis.find().sort({ date: -1 }).limit(5);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch history" });
    }
});

// ৪. সার্ভার পোর্ট
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});