
const express = require("express");

const app = express();
const PORT = 3001;

// URL Service address
const URL_SERVICE =
    "http://localhost:3000";

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

        // Redirect to original URL
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
