
import { useState } from "react";
import "./App.css";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleShorten = () => {
    if (!longUrl.trim()) {
      alert("Please enter a URL!");
      return;
    }

    try {
      const parsedUrl = new URL(longUrl);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        alert("Please enter a valid HTTP or HTTPS URL!");
        return;
      }

      const randomCode = Math.random().toString(36).substring(2, 8);

      setShortUrl(`http://localhost:3000/${randomCode}`);
    } catch {
      alert("Please enter a valid URL!");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      alert("Short URL copied!");
    } catch {
      alert("Unable to copy. Please copy the URL manually.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>URL Shortener</h1>

        <p className="description">
          Convert your long URLs into short links easily.
        </p>

        <input
          type="url"
          placeholder="Enter your long URL here..."
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />

        <button onClick={handleShorten}>
          Shorten URL
        </button>

        {shortUrl && (
          <div className="result">
            <p>Your shortened URL:</p>

            <div className="short-link">
              <span>{shortUrl}</span>

              <button onClick={handleCopy}>
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
