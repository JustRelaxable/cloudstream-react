import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import BottomBar from "~/components/BottomBar";
import HomePageCategory from "~/HomePageCategory";
import { webServerUrl } from "../config";
import ContentDetails from "./ContentDetails";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router";

const HomePage: React.FC = () => {
  const location = useLocation();
  const selectedProvider = location.state as string;

  const [selectedContent, setSelectedContent] = useState<SearchResponse | null>(
    null
  );
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
              homePageCategoryProps={{
                provider: selectedProvider,
                category: category,
              }}
              onContentSelected={(content) => setSelectedContent(content)}
            />
          ))}

        <div
          className="flex items-center fixed bottom-25 right-5 p-5 bg-nav-bg text-white rounded-xl shadow-lg"
          onClick={() => {
            setProviderListVisible(true);
          }}
        >
          <FontAwesomeIcon className="text-xl" icon={faBars} />
        </div>
      </div>
      {isProviderListVisible && (
        <div className="fixed bottom-0 w-full bg-bg h-fit rounded-t-xl shadow-lg overflow-hidden">
          <div className="overflow-y-auto">
            {providers === null || providers.length === 0 ? (
              <Link to={"/"} state={""}>
                <div
                  className="p-3 cursor-pointer"
                  onClick={() => {
                    setProviderListVisible(false);
                  }}
                >
                  None
                </div>
              </Link>
            ) : (
              <>
                {/* Add "None" as the first option */}
                <Link to={"/"} state={""}>
                  <div
                    className="p-3 cursor-pointer"
                    onClick={() => {
                      setProviderListVisible(false);
                    }}
                  >
                    None
                  </div>
                </Link>
                {providers.map((provider, index) => (
                  <Link to={"/"} state={provider}>
                    <div
                      key={index}
                      className="p-3 cursor-pointer"
                      onClick={() => {
                        setProviderListVisible(false);
                      }}
                    >
                      {provider}
                    </div>
                  </Link>
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
