import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes({
  ignoredRouteFiles: ["**/.*", "**/__*.*", "**/*.server.ts", "**/*.client.ts"],
}) satisfies RouteConfig;
