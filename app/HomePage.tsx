import React, { useEffect, useState } from "react";
import HomePageCategory from "./HomePageCategory";
import { webServerUrl } from "./config";

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${webServerUrl}api/mainpagelist?provider=InatBox`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.data)) {
          setCategories(data.data);
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
    <div className="p-4">
      {categories.map((category, index) => (
        <HomePageCategory key={index} provider="InatBox" category={category} />
      ))}
    </div>
  );
};

export default HomePage;
