import {
  type RouteConfig,
  route,
  layout,
  index,
} from "@react-router/dev/routes";

const router = [
  layout("routes/root-layout.tsx", [
    index("routes/home.tsx"),
    route("log", "routes/log.tsx", [
      route("info/:id", "routes/log-view.tsx"),
      route("locale", "routes/locale-log.tsx"),
    ]),
    route("role", "routes/role.tsx", [
      route("add", "routes/role-add.tsx"),
      route("view/:id", "routes/role-view.tsx"),
      route("edit/:id", "routes/role-edit.tsx"),
    ]),
    route("user", "routes/user.tsx", [
      route("add", "routes/user-add.tsx"),
      route("view/:id", "routes/user-view.tsx"),
    ]),
  ]),
] satisfies RouteConfig;

export default router;
