import { useLocation } from "@solidjs/router";
import { onMount, Match, Show, Switch } from "solid-js";
import { InformationSchema } from "~/lib/definition";
import { getDashboardPath } from "~/lib/utility";
import { useDashboard } from "~/context/DashboardContext";
import DescriptionDefault from "~/components/information/DescriptionDefault";
import Breadcrumb from "~/components/navigation/Breadcrumb";

export default function Information() {
  // get dashboard path based on URL
  const location = useLocation();
  const dashboardPath = getDashboardPath(location.pathname);
  // get dashboard schema context
  const { schema, path, setPath } = useDashboard();
  // update dashboard schema using dashboard path
  onMount(() => {
    const p = path();
    if (p[0] != dashboardPath.name || p[1] != dashboardPath.menu) {
      setPath([dashboardPath.name, dashboardPath.menu]);
    }
  });

  const children1 = () => {
    const s = schema() as InformationSchema;
    if (!s) return [];
    return Array.isArray(s.children) ? s.children.flatMap((item) => { return { name: item.name, text: item.text } }) : [];
  };
  const component = () => {
    const s = schema() as InformationSchema;
    if (!s) return [];
    return Array.isArray(s.children) ? s.children.find((item) => item.name == "description")?.component : "";
  };

  return(
    <Show when={component()}>
      <Breadcrumb dashboard={dashboardPath.name} parent={{ name: "information", text: "Information" }} children1={children1()} children2={[]} child1={dashboardPath.submenu} child2="" />
      <Switch>
        <Match when={component() == "description_default"}>
          <DescriptionDefault />
        </Match>
      </Switch>
    </Show>
  );
}
