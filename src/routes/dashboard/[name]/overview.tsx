import { useLocation } from "@solidjs/router";
import { createEffect, createResource } from "solid-js";
import { ResourceSchema } from "~/lib/definition";
import { resourceServer } from "~/lib/store";
import { getDashboardPath } from "~/lib/utility";

export default function Overview() {
  // get dashboard path and resource schema based on URL
  const location = useLocation();
  const dashboardPath = getDashboardPath(location.pathname);
  const [resource] = createResource<ResourceSchema, string>(dashboardPath.name, async (name) => {
    const resource = await fetch(`/schema/dashboard/${name}/resource.json`);
    return await resource.json();
  });
  // set resource server address to the address of matched dashboard api_id
  createEffect(() => {
    const r = resource();
    if (r) resourceServer.setAddress(r.api_id, r.address);
  });

  return (
    <></>
  );
}
