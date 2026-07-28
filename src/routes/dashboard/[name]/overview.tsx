import { useLocation } from "@solidjs/router";
import { createEffect, onMount, Match, Show, Switch } from "solid-js";
import { OverviewSchema, OverviewCardsSchema } from "~/lib/definition";
import { getDashboardPath } from "~/lib/utility";
import { useDashboard } from "~/context/DashboardContext";
import { useResource } from "~/context/ResourceContext";
import OverviewCards from "~/components/overview.tsx/OverviewCards";

export default function Overview() {
  // get dashboard path based on URL
  const location = useLocation();
  const dashboardPath = getDashboardPath(location.pathname);
  // get resource and dashboard schema context
  const { resource, setName } = useResource();
  const { schema, setPath } = useDashboard();
  // update resource and dashboard schema using dashboard path
  onMount(() => {
    setName(dashboardPath.name);
    setPath([dashboardPath.name, dashboardPath.menu]);
  });

  return (
    <Show when={resource() && schema()}>
      <Switch>
        <Match when={(schema() as OverviewSchema)?.name === "overview_cards"}>
          <OverviewCards resource={resource()!} overview={(schema() as OverviewCardsSchema)} />
        </Match>
      </Switch>
    </Show>
  );
}
