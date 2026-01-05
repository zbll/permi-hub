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
    route("role", "routes/role.tsx", [
      route("add", "routes/role-add.tsx"),
      route("view/:id", "routes/role-view.tsx"),
      route("edit/:id", "routes/role-edit.tsx"),
    ]),
    route("user", "routes/user.tsx", [route("add", "routes/user-add.tsx")]),
  ]),
] satisfies RouteConfig;
