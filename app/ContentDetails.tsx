import { useState, useEffect } from "react";
import { webServerUrl } from "./config";

const ContentDetails: React.FC<{
  content: SearchResponse | null;
  onClose: () => void;
}> = ({ content, onClose }) => {
  const [details, setDetails] = useState<LoadResponse | null>(null);

  useEffect(() => {
    if (!content) return;
    fetch(`${webServerUrl}api/load-content-details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: content.apiName,
        data: content.url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data is:", data.data);
        setDetails(data.data);
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
    <div className="fixed top-0 left-0 w-full h-full bg-white p-6 z-50 overflow-auto">
      <button className="mb-4 p-2 bg-red-500 text-white" onClick={onClose}>
        Close
      </button>
      {details.posterUrl && (
        <img
          src={details.posterUrl}
          alt={details.name}
          className="w-full max-w-md mx-auto mb-4 rounded-md"
        />
      )}
      <h1 className="text-2xl font-bold">{details.name}</h1>
      <p className="mt-2">{details.plot}</p>

      {/* Additional text for MovieLoadResponse */}
      {isMovieLoadResponse(details) && (
        <p className="mt-2 text-blue-500">
          This is a MovieLoadResponse. Data URL: {details.dataUrl}
        </p>
      )}

      <button className="mt-4 p-2 bg-blue-500 text-white">Play</button>
    </div>
  );
};

export default ContentDetails;
