import { onMount, Match, Show, Switch } from "solid-js";
import { DataLogSchema, DataLogViewSchema, DatasetLogViewSchema } from "~/lib/definition";
import { dashboardPath } from "~/lib/utility";
import { useResource } from "~/context/ResourceContext";
import { useDashboard } from "~/context/DashboardContext";
import Breadcrumb from "~/components/navigation/Breadcrumb";
import DataLogView from "~/components/data_log/DataLogView";
import DataSetLogView from "~/components/data_log/DatasetLogView";

export default function DatasetLogItem() {
  // get resource and dashboard schema context
  const { resource, setName } = useResource();
  const { schema, menuPath, setMenuPath } = useDashboard();
  // update resource and dashboard schema using dashboard path
  const path = dashboardPath();
  onMount(() => {
    setName(path.name);
    const p = menuPath();
    if (p[0] != path.name || p[1] != path.menu) {
      setMenuPath([path.name, path.menu]);
    }
  });

  const children1 = () => {
    const s = schema() as DataLogSchema;
    if (!s) return[];
    return Array.isArray(s.children) ? s.children.flatMap((item) => { return { name: item.name, text: item.text } }) : [];
  };
  const children2 = () => {
    const s = schema() as DataLogSchema;
    if (!s) return[];
    if (Array.isArray(s.children)) {
      const v = s.children.find((item) => item.name == path.submenu);
      if (!v) return [];
      if ("devices" in v) {
        return v ? v.devices?.flatMap((item) => { return { name: item.name, text: item.name, parent: v.name } }): [];
      }
      if ("sets" in v) {
        return v ? v.sets?.flatMap((item) => { return { name: item.name, text: item.name, parent: v.name } }): [];
      }
    }
    return [];
  };

  const data_log = () => {
    const s = schema() as DataLogSchema;
    if (!s) return;
    const c = s.children as (DataLogViewSchema | DatasetLogViewSchema)[];
    if (Array.isArray(c)) {
      return c.find((item) => item.name == path.submenu);
    }
  };

  return (
    <Show when={schema()}>
      <Breadcrumb dashboard={path.name} parent={{ name: "dataset_log", text: "Data Set" }} children1={children1()} children2={children2()} child1={path.submenu} child2={path.item} />
      <Show when={resource() && data_log()}>
        <Switch>
          <Match when={data_log()!.component == "data_log_view"}>
            <DataLogView path={path} resource={resource()!} data_log={data_log()! as DataLogViewSchema} />
          </Match>
          <Match when={data_log()!.component == "dataset_log_view"}>
            <DataSetLogView path={path} resource={resource()!} data_log={data_log()! as DatasetLogViewSchema} />
          </Match>
        </Switch>
      </Show>
    </Show>
  );
}
