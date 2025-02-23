import { useState, useEffect } from "react";
import { webServerUrl } from "../config";
import TopContentDetailsBar from "~/components/TopContentDetailsBar";

const ContentDetails: React.FC<{
  content: SearchResponse;
  onClose: () => void;
}> = ({ content, onClose }) => {
  const [details, setDetails] = useState<LoadResponse | null>(null);

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

  // Type guard to check if the response is MovieLoadResponse
  const isMovieLoadResponse = (
    response: LoadResponse
  ): response is MovieLoadResponse => {
    return (response as MovieLoadResponse).dataUrl !== undefined;
  };

  if (!content || !details) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-bg z-50 overflow-auto">
      <TopContentDetailsBar onNavBack={onClose} />
      {details.posterUrl && (
        <img
          src={details.posterUrl}
          alt={details.name}
          className="w-full h-48 max-w-md mx-auto mb-4 object-cover"
        />
      )}
      <div className="px-4">
        <h1 className="text-2xl font-bold">{details.name}</h1>
        <p className="mt-2 text-sm font-bold">{details.plot}</p>
      </div>

      {/* Additional text for MovieLoadResponse */}
      {isMovieLoadResponse(details) && (
        <p className="mt-2 text-blue-500">
          This is a MovieLoadResponse. Data URL: {details.dataUrl}
        </p>
      )}

      <button className="mt-4 p-2 ">Play</button>
    </div>
  );
};

export default ContentDetails;
