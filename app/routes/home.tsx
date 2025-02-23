import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import HomePage from "../pages/HomePage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <HomePage />;
  //return <PlayerPage movie={movie} />;
  //return <Welcome />;
}
