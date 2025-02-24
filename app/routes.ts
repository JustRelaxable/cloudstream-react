import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("details", "pages/ContentDetails.tsx"),
  //route("player", "./PlayerPage.tsx"),
] satisfies RouteConfig;
