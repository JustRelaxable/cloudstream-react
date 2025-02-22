import { useEffect, useState } from "react";
import ContentThumbnail from "./ContentThumbnail";
import ContentDetails from "./ContentDetails";
import { webServerUrl } from "./config";

const HomePageCategory: React.FC<HomePageCategoryProps> = ({
  provider,
  category,
}) => {
  const [contents, setContents] = useState<SearchResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<SearchResponse | null>(
    null
  );

  useEffect(() => {
    fetch(`${webServerUrl}api/mainpage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider,
        page: 1,
        name: category.name,
        data: category.data,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success" && data.data.items) {
          setContents(data.data.items[0].list);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [provider, category]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="">
      <h2 className="text-lg font-bold mb-2">{category.name}</h2>
      <div className="flex overflow-x-auto space-x-1.5">
        {contents.map((content, index) => (
          <ContentThumbnail
            key={index}
            content={content}
            onClick={() => setSelectedContent(content)}
          />
        ))}
      </div>
      <ContentDetails
        content={selectedContent}
        onClose={() => setSelectedContent(null)}
      />
    </div>
  );
};

export default HomePageCategory;
