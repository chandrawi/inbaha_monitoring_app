import { useLocation } from "@solidjs/router";
import { createResource } from "solid-js";
import { ResourceSchema } from "~/lib/definition";
import { getDashboardPath } from "~/lib/utility";

export default function Overview() {
  // get dashboard path and resource schema based on URL
  const location = useLocation();
  const dashboardPath = getDashboardPath(location.pathname);
  const [resource] = createResource<ResourceSchema, string>(dashboardPath.name, async (name) => {
    const response = await fetch(`/schema/dashboard/${name}/resource.json`);
    return await response.json();
  });

  return (
    <></>
  );
}
