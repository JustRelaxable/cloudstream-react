import { useState, useEffect, useRef } from "react";
import { webServerUrl } from "./config";
import VideoJS from "./videojs";
import type Player from "video.js/dist/types/player";

const PlayerPage: React.FC<{ movie: MovieLoadResponse }> = ({ movie }) => {
  const [links, setLinks] = useState<LoadLinksResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(`${webServerUrl}api/load-content-links`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: movie.apiName,
            data: movie.dataUrl,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch video links");
        }

        const result: ApiResponse<LoadLinksResponse> = await response.json();

        if (result.status !== "success") {
          throw new Error(result.message || "Failed to fetch video links");
        }

        setLinks(result.data);
      } catch (err) {
        setError("Error loading video links. Please try again later.");
        console.error(err);
      }
    };

    fetchLinks();
  }, [movie]);

  const interceptRequest = (options) => {
    console.log("Intercepted request:", options.uri);

    // Modify the URI if needed
    options.uri =
      webServerUrl +
      "proxy/" +
      options.uri.replace(`${webServerUrl}proxy/`, "");

    // Add custom headers
    options.headers = {
      ...options.headers,
      "c-Referer": links?.extractorLinks[currentSourceIndex].referer || "",
    };

    // If you need to set headers directly on the XHR object, use beforeSend
    options.beforeSend = (xhr) => {
      xhr.setRequestHeader(
        "c-Referer",
        links?.extractorLinks[currentSourceIndex].referer || ""
      );
    };

    console.log("Modified request:", options);
    return options;
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!links) {
    return null;
  }

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: links.extractorLinks.map((link) => ({
      src: `${link.url}`,
    })),
    tracks: links.subtitleFiles.map((sub) => ({
      kind: "subtitles",
      src: `${webServerUrl}proxy/${sub.url}`,
      srcLang: sub.lang,
      label: sub.lang,
    })),
  };

  return (
    <div className="flex flex-col fixed top-0 left-0 w-full h-full bg-bg z-100">
      <div className="overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">{movie.name}</h1>

        <div>
          <label htmlFor="link-dropdown">Choose a source:</label>
          <select
            id="link-dropdown"
            value={links.extractorLinks[currentSourceIndex].name}
            onChange={(e) => {
              const selectedIndex = links.extractorLinks.findIndex(
                (link) => link.name === e.target.value
              );
              setCurrentSourceIndex(selectedIndex);
            }}
          >
            <option value="" disabled>
              Select a link
            </option>
            {links.extractorLinks.map((link, index) => (
              <option key={index} value={link.name}>
                {link.name} {link.quality && `(${link.quality})`}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full max-w-4xl">
          <VideoJS
            options={videoJsOptions}
            onReady={() => {}}
            onHooksReady={interceptRequest}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
