import React, { useEffect, useState } from "react";
import HomePageCategory from "./HomePageCategory";
import { webServerUrl } from "./config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import BottomBar from "./components/BottomBar";

const HomePage: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [providers, setProviders] = useState<string[] | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isProviderListVisible, setProviderListVisible] = useState(false);

  useEffect(() => {
    fetchProviderList(setProviders);
  }, []);

  useEffect(() => {
    if (selectedProvider != "") {
      fetchProviderMainpageList(
        selectedProvider,
        setLoading,
        setCategories,
        setError
      );
    }
  }, [selectedProvider]);

  /*
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  */

  return (
    <div className="flex flex-col h-full w-full">
      <div className="relative flex-1 overflow-y-auto">
        {selectedProvider == "" && (
          <div className="flex items-center justify-center h-full w-full">
            <p>There is no selected provider</p>
          </div>
        )}
        {selectedProvider != "" &&
          categories.map((category) => (
            <HomePageCategory
              key={category.name}
              provider={selectedProvider}
              category={category}
            />
          ))}

        <div
          className="flex items-center fixed bottom-25 right-5 p-4 bg-blue-950 text-white rounded-xl shadow-lg"
          onClick={() => {
            setProviderListVisible(true);
          }}
        >
          <FontAwesomeIcon className="text-xl" icon={faBars} />
        </div>
      </div>
      {isProviderListVisible && (
        <div className="fixed bottom-0 w-full h-fit bg-blue-950 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-y-auto">
            {providers === null || providers.length === 0 ? (
              <div
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedProvider("");
                  setProviderListVisible(false);
                }}
              >
                None
              </div>
            ) : (
              <>
                {/* Add "None" as the first option */}
                <div
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedProvider("");
                    setProviderListVisible(false);
                  }}
                >
                  None
                </div>
                {/* Map through providers */}
                {providers.map((provider, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedProvider(provider);
                      setProviderListVisible(false);
                    }}
                  >
                    {provider}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
      <BottomBar />
    </div>
  );
};

function fetchProviderMainpageList(
  selectedProvider: string,
  onLoadingStateChanged: (state: boolean) => void,
  onCategoryDataLoaded: (categories: Category[]) => void,
  onError: (error: string) => void
) {
  onLoadingStateChanged(true);
  fetch(`${webServerUrl}api/mainpagelist?provider=${selectedProvider}`)
    .then((response) => response.json())
    .then((apiResponse: ApiResponse<Category[]>) => {
      if (apiResponse.status === "success") {
        onCategoryDataLoaded(apiResponse.data!!);
      } else {
        throw new Error(apiResponse.message!!);
      }
    })
    .catch((err) => onError(err.message))
    .finally(() => onLoadingStateChanged(false));
}

function fetchProviderList(
  onProviderListLoaded: (providerList: string[]) => void
) {
  fetch(`${webServerUrl}api/providers`)
    .then((response) => response.json())
    .then((apiResponse: ApiResponse<string[]>) => {
      onProviderListLoaded(apiResponse.data!!);
    });
}

export default HomePage;
