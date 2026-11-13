
const express = require("express");

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// URL Service address
const URL_SERVICE =
    process.env.URL_SERVICE_URL || "http://localhost:3000";

const ANALYTICS_SERVICE =
    process.env.ANALYTICS_SERVICE_URL || "http://localhost:4000";

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        service: "redirect-service",
        message: "Open a short URL path to be redirected."
    });
});

// Redirect route
app.get("/:shortCode", async (req, res) => {

    const { shortCode } = req.params;

    try {

        // Ask URL Service for original URL
        const response = await fetch(
            `${URL_SERVICE}/api/urls/${encodeURIComponent(shortCode)}`
        );

        // Check whether URL exists
        if (!response.ok) {

            if (response.status === 404) {
                return res.status(404).send(
                    "Short URL not found!"
                );
            }

            return res.status(502).send(
                "Unable to retrieve original URL"
            );
        }

        // Read response data
        const data = await response.json();

        // Record click in Analytics Service
    try {

        await fetch(
            `${ANALYTICS_SERVICE}/api/analytics/click/${encodeURIComponent(shortCode)}`,
            {
                method: "POST"
            }
        );

    } catch (error) {

        console.error(
            "Analytics Service unavailable:",
            error.message
        );

    }

        // Redirect even if analytics fails
        return res.redirect(302, data.longUrl);

    } catch (error) {

        console.error(error);

        return res.status(502).send(
            "URL Service is unavailable"
        );
    }
});

// Start server
app.listen(PORT, () => {
    console.log(
        `Redirect Service running at http://localhost:${PORT}`
    );
});
