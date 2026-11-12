
import { useState } from "react";
import "./App.css";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async (event) => {
    event.preventDefault();
    setError("");
    setShortUrl("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          longUrl: longUrl.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to shorten this URL.");
      }

      setShortUrl(data.shortUrl);
    } catch (requestError) {
      setError(requestError.message || "Unable to connect to the URL service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      alert("Short URL copied!");
    } catch {
      setError("Unable to copy automatically. Please copy the URL manually.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>URL Shortener</h1>

        <p className="description">
          Convert your long URLs into short links easily.
        </p>

        <form onSubmit={handleShorten}>
          <input
            type="url"
            placeholder="Enter your long URL here..."
            value={longUrl}
            onChange={(e) => {
              setLongUrl(e.target.value);
              setError("");
              setShortUrl("");
            }}
            required
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {error && <p role="alert">{error}</p>}

        {shortUrl && (
          <div className="result">
            <p>Your shortened URL:</p>

            <div className="short-link">
              <a href={shortUrl}>{shortUrl}</a>

              <button type="button" onClick={handleCopy}>
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
