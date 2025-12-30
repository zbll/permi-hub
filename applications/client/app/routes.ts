import {
  type RouteConfig,
  route,
  layout,
  index,
} from "@react-router/dev/routes";

export default [
  layout("routes/root-layout.tsx", [
    index("routes/home.tsx"),
    route("log", "routes/log.tsx", [route(":id", "routes/log-view.tsx")]),
    route("role", "routes/role.tsx"),
  ]),
] satisfies RouteConfig;
