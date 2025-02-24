import { useState, useEffect } from "react";
import { webServerUrl } from "../config";
import TopContentDetailsBar from "~/components/TopContentDetailsBar";
import PlayerPage from "~/PlayerPage";
import { useLocation } from "react-router";

const ContentDetails = () => {
  const location = useLocation();
  const content = location.state as SearchResponse;

  const [details, setDetails] = useState<LoadResponse | null>(null);
  const [playerActive, setPlayerActive] = useState(false);

  useEffect(() => {
    fetch(`${webServerUrl}api/load-content-details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: content.apiName,
        data: content.url,
      }),
    })
      .then((res) => res.json())
      .then((apiResponse: ApiResponse<LoadResponse>) => {
        console.log("data is:", apiResponse.data);
        setDetails(apiResponse.data);
      })
      .catch(console.error);
  }, [content]);

  if (!content || !details) return null;

  console.log(getLoadResponseType(details));

  return (
    <div className="flex flex-col fixed top-0 left-0 w-full h-full bg-bg z-50">
      <div className="flex-1 overflow-auto">
        {details.posterUrl && (
          <img
            src={details.posterUrl}
            alt={details.name}
            className="w-full h-48 max-w-md mx-auto mb-4 object-cover"
          />
        )}
        <div className="px-4">
          <h1 className="text-2xl font-bold">{details.name}</h1>
          <p className="mt-2 text-sm">{details.plot}</p>
          {getLoadResponseType(details) == "MovieLoadResponse" && (
            <button
              className="bg-white w-full p-2 text-black font-bold rounded-md"
              onClick={() => setPlayerActive(true)}
            >
              Play Movie
            </button>
          )}
        </div>
        {playerActive && <PlayerPage movie={details as MovieLoadResponse} />}
      </div>
    </div>
  );
};

function getLoadResponseType(instance: LoadResponse): string {
  // Check for MovieLoadResponse
  if ("dataUrl" in instance) {
    return "MovieLoadResponse";
  }

  // Check for TvSeriesLoadResponse
  if ("episodes" in instance && Array.isArray(instance.episodes)) {
    return "TvSeriesLoadResponse";
  }

  // Check for AnimeLoadResponse
  if (
    "episodes" in instance &&
    !Array.isArray(instance.episodes) &&
    "engName" in instance
  ) {
    return "AnimeLoadResponse";
  }

  // Fallback for unknown types
  return "Unknown LoadResponse type";
}

export default ContentDetails;
