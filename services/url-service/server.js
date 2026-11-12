
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// Temporary in-memory URL storage
const urls = new Map();

// Home route
app.get("/", (req, res) => {
    res.send("URL Shortener API is running!");
});

// URL shortening API
app.post("/api/shorten", (req, res) => {

    const { longUrl } = req.body;

    // Validate input
    if (!longUrl) {
        return res.status(400).json({
            error: "Please provide a URL"
        });
    }

    // Validate URL format and protocol
    let parsedUrl;

    try {
        parsedUrl = new URL(longUrl);
    } catch {
        return res.status(400).json({
            error: "Invalid URL"
        });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return res.status(400).json({
            error: "Only HTTP and HTTPS URLs are allowed"
        });
    }

    // Generate short code
    let shortCode;
    do {
        shortCode = crypto.randomBytes(4).toString("hex");
    } while (urls.has(shortCode));

    // Store URL temporarily
    urls.set(shortCode, longUrl);

    // Send response
    res.status(201).json({
        longUrl: longUrl,
        shortCode: shortCode,
        shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`
    });
});

// Redirect short URLs to their original destinations
app.get("/:shortCode", (req, res) => {
    const longUrl = urls.get(req.params.shortCode);

    if (!longUrl) {
        return res.status(404).json({
            error: "Short URL not found"
        });
    }

    return res.redirect(longUrl);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
