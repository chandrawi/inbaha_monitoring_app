import { onMount, Match, Show, Switch } from "solid-js";
import { BasicSchema, OverviewCardsSchema } from "~/lib/definition";
import { dashboardPath } from "~/lib/utility";
import { useDashboard } from "~/context/DashboardContext";
import { useResource } from "~/context/ResourceContext";
import OverviewCards from "~/components/overview.tsx/OverviewCards";

export default function Overview() {
  // get resource and dashboard schema context
  const { resource, setName } = useResource();
  const { schema, setMenuPath } = useDashboard();
  // update resource and dashboard schema using dashboard path
  const path = dashboardPath();
  onMount(() => {
    setName(path.name);
    setMenuPath([path.name, path.menu]);
  });

  return (
    <Show when={resource() && schema()}>
      <Switch>
        <Match when={(schema() as BasicSchema)?.name === "overview_cards"}>
          <OverviewCards resource={resource()!} overview={(schema() as OverviewCardsSchema)} />
        </Match>
      </Switch>
    </Show>
  );
}
