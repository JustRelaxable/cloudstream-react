import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCog } from "@fortawesome/free-solid-svg-icons";

const BottomBar = () => {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    console.log(`Selected tab: ${tab}`);
  };

  return (
    <div className="w-full bg-nav-bg shadow-lg">
      <div className="flex justify-around items-center p-5">
        <div
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === "home" ? "text-icon-active" : "text-gray-500"
          }`}
          onClick={() => handleTabClick("home")}
        >
          <FontAwesomeIcon icon={faHome} className="text-xl" />
        </div>

        <div
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === "settings" ? "text-icon-active" : "text-gray-500"
          }`}
          onClick={() => handleTabClick("settings")}
        >
          <FontAwesomeIcon icon={faCog} className="text-xl" />
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
