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
    <div className="w-full bg-white shadow-lg">
      <div className="flex justify-around items-center p-3">
        <div
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === "home" ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => handleTabClick("home")}
        >
          <FontAwesomeIcon icon={faHome} className="text-2xl" />
          <span className="text-sm mt-1">Home</span>
        </div>

        <div
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === "settings" ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => handleTabClick("settings")}
        >
          <FontAwesomeIcon icon={faCog} className="text-2xl" />
          <span className="text-sm mt-1">Settings</span>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
