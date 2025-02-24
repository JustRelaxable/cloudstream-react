import { useEffect, useState } from "react";
import ContentThumbnail from "./ContentThumbnail";
import { webServerUrl } from "./config";
import ContentDetails from "./pages/ContentDetails";
import { Link } from "react-router";

const HomePageCategory: React.FC<{
  homePageCategoryProps: HomePageCategoryProps;
  onContentSelected: (content: SearchResponse) => void;
}> = ({ homePageCategoryProps, onContentSelected }) => {
  const [contents, setContents] = useState<SearchResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${webServerUrl}api/mainpage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: homePageCategoryProps.provider,
        page: 1,
        name: homePageCategoryProps.category.name,
        data: homePageCategoryProps.category.data,
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
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-2">
        {homePageCategoryProps.category.name}
      </h2>
      <div className="flex overflow-x-auto space-x-1.5">
        {contents.map((content, index) => (
          <Link to={{ pathname: `/details` }} state={content}>
            <ContentThumbnail
              key={index}
              content={content}
              onClick={() => onContentSelected(content)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePageCategory;
