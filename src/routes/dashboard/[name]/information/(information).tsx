import { onMount, Match, Show, Switch } from "solid-js";
import { InformationSchema } from "~/lib/definition";
import { dashboardPath } from "~/lib/utility";
import { useDashboard } from "~/context/DashboardContext";
import DescriptionDefault from "~/components/information/DescriptionDefault";
import Breadcrumb from "~/components/navigation/Breadcrumb";

export default function Information() {
  // get dashboard schema context
  const { schema, menuPath, setMenuPath } = useDashboard();
  // update dashboard schema using dashboard path
  const path = dashboardPath();
  onMount(() => {
    const p = menuPath();
    if (p[0] != path.name || p[1] != path.menu) {
      setMenuPath([path.name, path.menu]);
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
      <Breadcrumb dashboard={path.name} parent={{ name: "information", text: "Information" }} children1={children1()} children2={[]} child1={path.submenu} child2="" />
      <Switch>
        <Match when={component() == "description_default"}>
          <DescriptionDefault />
        </Match>
      </Switch>
    </Show>
  );
}
