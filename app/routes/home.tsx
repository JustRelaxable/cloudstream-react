import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import HomePage from "../pages/HomePage";
import VideoJS from "~/videojs";
import { useRef } from "react";
import type Player from "video.js/dist/types/player";
import videojs from "video.js";
import { webServerUrl } from "~/config";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const videoJsOptions = {
  autoplay: true,
  controls: true,
  responsive: true,
  fluid: true,
  sources: [
    {
      src: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
    },
  ],
  html5: {
    vhs: {
      xhr: {
        beforeRequest: function (options) {
          console.log("helloworld!");
        },
      },
    },
  },
};

const handlePlayerReady = (player: Player) => {
  const vhs = player.tech().vhs; // Access VHS (HLS/DASH)

  if (vhs) {
    vhs.xhr.beforeRequest = function (options) {
      console.log("Intercepted segment request:", options.uri);

      options.uri =
        webServerUrl +
        "proxy/" +
        options.uri.replace(`${webServerUrl}proxy/`, "");

      options.headers = {
        ...options.headers,
        "c-Referer": "zeheee",
      };

      console.log("Modified request:", options);
      return options;
    };
  }
};

export default function Home() {
  return <HomePage />;
  /*
  return (
    <VideoJS options={videoJsOptions} onReady={handlePlayerReady}></VideoJS>
  );
  */
  //return <PlayerPage movie={movie} />;
  //return <Welcome />;
}
