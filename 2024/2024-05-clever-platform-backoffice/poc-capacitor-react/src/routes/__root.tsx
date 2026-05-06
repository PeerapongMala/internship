import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div className="container mx-auto py-6 px-4 lg:px-8">
      <div className="flex flex-col gap-4 item-center">
        <div className="p-2 flex gap-2">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{" "}
          <Link to="/upload" className="[&.active]:font-bold">
            Upload
          </Link>{" "}
          <Link to="/view" className="[&.active]:font-bold">
            View
          </Link>
        </div>
        <hr />
        <div className="flex flex-col gap-2">
          <Outlet />
          <TanStackRouterDevtools />
        </div>
      </div>
    </div>
  ),
});
