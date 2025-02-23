import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { ExtractorLinkType } from "./interfaces/ExtractorLinkType";
import { webServerUrl } from "./config";
import TopNavigationBar from "./components/TopNavigationBar";

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
            provider: "HDFilmCehennemi",
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

        console.log(result.data);
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
    <div className="flex flex-col fixed top-0 left-0 w-full h-full bg-bg z-100">
      <TopNavigationBar onNavBack={() => {}} />
      <div className="overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">{movie.name}</h1>
        {videoLink ? (
          <div className="w-full max-w-4xl">
            <ReactPlayer
              url={`${videoLink.url}`}
              controls
              width="100%"
              height="auto"
              config={{
                file: {
                  attributes: {},
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
                      console.log("c-referer");

                      xhr.open("GET", `${webServerUrl}proxy/${url}`, true);
                      xhr.setRequestHeader(
                        "c-Referer",
                        links.extractorLinks[0].referer
                      );
                    },
                  },
                },
              }}
            />
          </div>
        ) : (
          <div className="text-red-500">No playable video link found.</div>
        )}
      </div>
    </div>
  );
};

export default PlayerPage;
