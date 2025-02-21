import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { ExtractorLinkType } from "./interfaces/ExtractorLinkType";
import { webServerUrl } from "./config";

const PlayerPage: React.FC<{ movie: MovieLoadResponse }> = ({ movie }) => {
  const [links, setLinks] = useState<LoadLinksResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(`${webServerUrl}api/load-content-links`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: "InatBox",
            data: JSON.stringify({
              chHeaders: "null",
              chUrl: movie.dataUrl,
              chReg: "null",
              chImg: movie.posterUrl,
              chName: movie.name,
              chType: "inat_disk_sh_2",
            }),
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

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!links) {
    return <div>Loading...</div>;
  }

  const videoLink = links.extractorLinks.find((link) =>
    [ExtractorLinkType.VIDEO, ExtractorLinkType.M3U8].includes(link.type)
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Now Playing: {movie.name}</h1>

      {videoLink ? (
        <div className="w-full max-w-4xl mx-auto">
          <ReactPlayer
            url={`${videoLink.url}`}
            controls
            width="100%"
            height="auto"
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload", // Disable download option
                },
                tracks: links.subtitleFiles.map((sub) => ({
                  kind: "subtitles",
                  src: sub.url,
                  srcLang: sub.lang,
                  label: sub.lang,
                  default: sub.lang === "en", // Default to English subtitles
                })),
                hlsOptions: {
                  xhrSetup: (xhr: XMLHttpRequest, url: string) => {
                    console.log("Intercepted segment request:", url);
                    if (url.includes(`${webServerUrl}proxy/`)) {
                      url = url.replace(`${webServerUrl}proxy/`, "");
                    }
                    xhr.open("GET", `${webServerUrl}proxy/${url}`, true);
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <div className="text-red-500">No playable video link found.</div>
      )}

      <div className="mt-4">
        <h2 className="text-xl font-bold">Subtitles</h2>
        <ul className="list-disc pl-6">
          {links.subtitleFiles.map((sub) => (
            <li key={sub.url}>
              {sub.lang}:{" "}
              <a href={sub.url} className="text-blue-500 hover:underline">
                {sub.url}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold">Available Links</h2>
        <ul className="list-disc pl-6">
          {links.extractorLinks.map((link) => (
            <li key={link.url}>
              {link.name} ({link.type}) -{" "}
              <a href={link.url} className="text-blue-500 hover:underline">
                {link.url}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlayerPage;
