import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import HomePage from "~/HomePage";
import PlayerPage from "~/PlayerPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const movie: MovieLoadResponse = {
  name: "Inception",
  url: "https://example.com/inception",
  apiName: "MovieAPI",
  type: "Movie",
  dataUrl:
    "https://cdn.dzen.ru/vod/converted-video/vod-content/62/51/68/47/57/55/16/72/49/9/26d942f2-92ac-4efc-a85a-2d5071781ab6/kaltura/desc_dc93190ab1f38eed37918c6eee66593b/vxY303R1vtAQ/master.m3u8",
  posterUrl:
    "https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/85KLLVx3I0mwgJdAqUaTTGxbVym.jpg",
  year: 2010,
  plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  rating: 8500,
  tags: ["Action", "Sci-Fi"],
  duration: 148,
  trailers: [],
  recommendations: [],
  actors: [],
  comingSoon: false,
  syncData: {},
  posterHeaders: {},
  backgroundPosterUrl: "https://example.com/background/inception.jpg",
  contentRating: "PG-13",
};

export default function Home() {
  //return <HomePage />;
  return <PlayerPage movie={movie} />;
  //return <Welcome />;
}
